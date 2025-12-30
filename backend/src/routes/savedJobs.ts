import express, { Response } from 'express';
import SavedJob from '../models/SavedJob';
import Job from '../models/Job';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// 1. Save a job (job seekers only)
router.post('/', authenticateToken, requireRole(['job_seeker']), async (req: any, res: Response) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ error: 'Job ID is required' });
        }

        const job = await Job.findById(jobId);
        if (!job || !job.isActive) {
            return res.status(404).json({ error: 'Job not found or inactive' });
        }

        const existingSavedJob = await SavedJob.findOne({
            jobSeekerId: req.user._id,
            jobId
        });

        if (existingSavedJob) {
            return res.status(400).json({ error: 'Job already saved' });
        }

        const savedJob = new SavedJob({
            jobSeekerId: req.user._id,
            jobId
        });

        await savedJob.save();
        res.status(201).json({ savedJob });
    } catch (error) {
        console.error('Save job error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. Get saved jobs for current user
router.get('/', authenticateToken, requireRole(['job_seeker']), async (req: any, res: Response) => {
    try {
        const savedJobs = await SavedJob.find({ jobSeekerId: req.user._id })
            .populate({
                path: 'jobId',
                populate: {
                    path: 'employerId',
                    select: 'fullName companyName companyLogo'
                }
            })
            .sort({ createdAt: -1 });

        res.json({ savedJobs });
    } catch (error) {
        console.error('Get saved jobs error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 3. Check if a specific job is saved
router.get('/check/:jobId', authenticateToken, requireRole(['job_seeker']), async (req: any, res: Response) => {
    try {
        const savedJob = await SavedJob.findOne({
            jobSeekerId: req.user._id,
            jobId: req.params.jobId
        });

        res.json({ isSaved: !!savedJob });
    } catch (error) {
        console.error('Check saved job error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 4. Remove saved job
router.delete('/:jobId', authenticateToken, requireRole(['job_seeker']), async (req: any, res: Response) => {
    try {
        const savedJob = await SavedJob.findOneAndDelete({
            jobSeekerId: req.user._id,
            jobId: req.params.jobId
        });

        if (!savedJob) {
            return res.status(404).json({ error: 'Saved job not found' });
        }

        res.json({ message: 'Job removed from saved jobs' });
    } catch (error) {
        console.error('Remove saved job error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;