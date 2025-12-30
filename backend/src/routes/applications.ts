import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Application from '../models/Application';
import Job from '../models/Job';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// --- 1. APPLY FOR A JOB (Job Seekers Only) ---
router.post('/', authenticateToken, requireRole(['job_seeker']), [
    body('jobId').isMongoId().withMessage('Invalid Job ID'),
    body('coverLetter').trim().notEmpty().withMessage('Cover letter is required'),
    body('cvUrl').isURL().withMessage('Please provide a valid CV URL')
], async (req: any, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { jobId, coverLetter, cvUrl } = req.body;

        // Check if job exists and is active
        const job = await Job.findById(jobId);
        if (!job || !job.isActive) {
            return res.status(404).json({ error: 'Job not found or inactive' });
        }

        // Check for existing application (Duplicate check)
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
        res.status(201).json({ message: 'Applied successfully', application });
    } catch (error) {
        console.error('Apply error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- 2. GET MY APPLICATIONS (Job Seeker View) ---
router.get('/my-applications', authenticateToken, requireRole(['job_seeker']), async (req: any, res: Response) => {
    try {
        const applications = await Application.find({ jobSeekerId: req.user._id })
            .populate({
                path: 'jobId',
                select: 'title location salaryMin salaryMax',
                populate: {
                    path: 'employerId',
                    select: 'companyName companyLogo'
                }
            })
            .sort({ createdAt: -1 });

        res.json({ applications });
    } catch (error) {
        console.error('Get my-apps error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- 3. GET APPLICANTS FOR A SPECIFIC JOB (Employer View) ---
router.get('/employer/:jobId', authenticateToken, requireRole(['employer']), async (req: any, res: Response) => {
    try {
        // Verify this employer actually owns the job first
        const job = await Job.findOne({ _id: req.params.jobId, employerId: req.user._id });
        if (!job) {
            return res.status(403).json({ error: 'Unauthorized: You do not own this job listing' });
        }

        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('jobSeekerId', 'fullName email bio skills phone location cvUrl avatarUrl')
            .sort({ createdAt: -1 });

        res.json({ applications, jobTitle: job.title });
    } catch (error) {
        console.error('Get employer applicants error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- 4. UPDATE STATUS (Employer Only) ---
router.put('/:id/status', authenticateToken, requireRole(['employer']), [
    body('status').isIn(['pending', 'reviewed', 'accepted', 'rejected']).withMessage('Invalid status')
], async (req: any, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { status } = req.body;

        // Find application and populate job to verify ownership
        const application = await Application.findById(req.params.id).populate('jobId');

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Check if the current user is the owner of the job associated with this application
        const job = application.jobId as any; 
        if (job.employerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to update this application' });
        }

        application.status = status;
        await application.save();

        res.json({ message: `Application updated to ${status}`, application });
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;