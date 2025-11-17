import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Application from '../models/Application';
import Job from '../models/Job';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Apply for a job (job seekers only)
router.post('/', authenticateToken, requireRole(['job_seeker']), [
    body('jobId').isMongoId(),
    body('coverLetter').optional().trim(),
    body('cvUrl').optional().trim()
], async (req: any, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { jobId, coverLetter, cvUrl } = req.body;

        // Check if job exists and is active
        const job = await Job.findById(jobId);
        if (!job || !job.isActive) {
            return res.status(404).json({ error: 'Job not found or inactive' });
        }

        // Check if user already applied
        const existingApplication = await Application.findOne({
            jobId,
            jobSeekerId: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied for this job' });
        }

        const application = new Application({
            jobId,
            jobSeekerId: req.user._id,
            coverLetter,
            cvUrl
        });

        await application.save();

        res.status(201).json({ application });
    } catch (error) {
        console.error('Apply for job error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get applications for current job seeker
router.get('/my-applications', authenticateToken, requireRole(['job_seeker']), async (req: any, res: Response) => {
    try {
        const applications = await Application.find({ jobSeekerId: req.user._id })
            .populate({
                path: 'jobId',
                populate: {
                    path: 'employerId',
                    select: 'fullName companyName companyLogo'
                }
            })
            .sort({ createdAt: -1 });

        res.json({ applications });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get applications for employer's jobs
router.get('/employer/:jobId', authenticateToken, requireRole(['employer']), async (req: any, res: Response) => {
    try {
        // Verify employer owns the job
        const job = await Job.findOne({ _id: req.params.jobId, employerId: req.user._id });
        if (!job) {
            return res.status(404).json({ error: 'Job not found or unauthorized' });
        }

        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('jobSeekerId', 'fullName email bio skills phone location cvUrl')
            .sort({ createdAt: -1 });

        res.json({ applications });
    } catch (error) {
        console.error('Get job applications error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update application status (employers only)
router.put('/:id/status', authenticateToken, requireRole(['employer']), [
    body('status').isIn(['pending', 'reviewed', 'accepted', 'rejected'])
], async (req: any, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { status } = req.body;

        // Find application and verify employer owns the job
        const application = await Application.findById(req.params.id)
            .populate({
                path: 'jobId',
                match: { employerId: req.user._id }
            });

        if (!application || !application.jobId) {
            return res.status(404).json({ error: 'Application not found or unauthorized' });
        }

        application.status = status;
        await application.save();

        res.json({ application });
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;