import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose'; 
import Job from '../models/Job';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/jobs/employer/my-jobs
 */
router.get('/employer/my-jobs', authenticateToken, requireRole(['employer']), async (req: any, res: Response) => {
    try {
        const jobs = await Job.find({ employerId: req.user._id }).sort({ createdAt: -1 });
        res.json({ jobs });
    } catch (error) {
        console.error('Employer jobs fetch error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   GET /api/jobs
 * @desc    Updated to handle high limits for "View All"
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const { title, location, jobType, salaryMin, category, page, limit } = req.query;
        
        // --- THE FIX START ---
        // If the frontend sends a limit (like 100), use it. 
        // If not, default to 50 instead of 10 so you see all 21 jobs.
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.max(1, Number(limit) || 50); 
        const skip = (pageNum - 1) * limitNum;
        // --- THE FIX END ---

        const query: any = { isActive: true };
        const isValid = (val: any) => val && val !== "undefined" && val !== "null" && val !== "";

        if (isValid(title)) query.title = { $regex: title as string, $options: 'i' };
        if (isValid(location)) query.location = { $regex: location as string, $options: 'i' };
        if (isValid(jobType) && jobType !== 'all') query.jobType = jobType;
        
        // Category filtering (matches the Home Screen clicks)
        if (isValid(category) && category !== 'all') {
            query.category = { $regex: category as string, $options: 'i' };
        }

        if (isValid(salaryMin)) {
            const min = Number(salaryMin);
            if (!isNaN(min)) query.salaryMin = { $gte: min };
        }

        const [jobs, total] = await Promise.all([
            Job.find(query)
                .populate('employerId', 'fullName companyName companyLogo')
                .sort({ createdAt: -1 })
                .limit(limitNum) // Now uses the larger limit
                .skip(skip),
            Job.countDocuments(query)
        ]);

        res.json({
            jobs,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            totalJobs: total
        });
    } catch (error) {
        console.error('SERVER ERROR IN GET /api/jobs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @route   GET /api/jobs/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Job ID format' });
        }
        const job = await Job.findById(id)
            .populate('employerId', 'fullName companyName companyDescription companyLogo companyWebsite industry companySize location');
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json({ job });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   POST /api/jobs
 */
router.post('/', authenticateToken, requireRole(['employer']), [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('jobType').isIn(['full_time', 'part_time', 'contract', 'internship'])
], async (req: any, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const job = new Job({ ...req.body, employerId: req.user._id });
        await job.save();
        res.status(201).json({ job });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   PUT /api/jobs/:id
 */
router.put('/:id', authenticateToken, requireRole(['employer']), async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
        const job = await Job.findOneAndUpdate(
            { _id: id, employerId: req.user._id },
            { $set: req.body },
            { new: true }
        );
        if (!job) return res.status(404).json({ error: 'Job not found or unauthorized' });
        res.json({ job });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   DELETE /api/jobs/:id
 */
router.delete('/:id', authenticateToken, requireRole(['employer']), async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const job = await Job.findOneAndDelete({ _id: id, employerId: req.user._id });
        if (!job) return res.status(404).json({ error: 'Unauthorized' });
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;