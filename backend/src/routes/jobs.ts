import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Job from '../models/Job';
import User from '../models/User';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Get all active jobs with employer info
router.get('/', async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, category, location, jobType } = req.query;

        const query: any = { isActive: true };

        if (category) query.category = category;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (jobType) query.jobType = jobType;

        const jobs = await Job.find(query)
            .populate('employerId', 'fullName companyName companyLogo')
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));

        const total = await Job.countDocuments(query);

        res.json({
            jobs,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single job by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('employerId', 'fullName companyName companyDescription companyLogo companyWebsite industry companySize location');

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json({ job });
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new job (employers only)
router.post('/', authenticateToken, requireRole(['employer']), [
    body('title').trim().isLength({ min: 1 }),
    body('description').trim().isLength({ min: 1 }),
    body('location').trim().isLength({ min: 1 }),
    body('jobType').isIn(['full_time', 'part_time', 'contract', 'internship'])
], async (req: any, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const jobData = {
            ...req.body,
            employerId: req.user._id
        };

        const job = new Job(jobData);
        await job.save();

        res.status(201).json({ job });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update job (employer who owns the job)
router.put('/:id', authenticateToken, requireRole(['employer']), async (req: any, res: Response) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, employerId: req.user._id });

        if (!job) {
            return res.status(404).json({ error: 'Job not found or unauthorized' });
        }

        Object.assign(job, req.body);
        await job.save();

        res.json({ job });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete job (employer who owns the job)
router.delete('/:id', authenticateToken, requireRole(['employer']), async (req: any, res: Response) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, employerId: req.user._id });

        if (!job) {
            return res.status(404).json({ error: 'Job not found or unauthorized' });
        }

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get jobs posted by current employer
router.get('/employer/my-jobs', authenticateToken, requireRole(['employer']), async (req: any, res: Response) => {
    try {
        const jobs = await Job.find({ employerId: req.user._id })
            .sort({ createdAt: -1 });

        res.json({ jobs });
    } catch (error) {
        console.error('Get employer jobs error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;