import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken, async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update current user profile
router.put('/me', authenticateToken, async (req: any, res: Response) => {
    try {
        const allowedFields = [
            'fullName', 'avatarUrl',
            // Job seeker fields
            'bio', 'skills', 'education', 'experience', 'cvUrl', 'phone', 'location',
            // Employer fields
            'companyName', 'companyDescription', 'companyLogo', 'companyWebsite', 'industry', 'companySize'
        ];

        const updates: any = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get public profile by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password -email');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get public profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get job seekers (public endpoint)
router.get('/job-seekers/search', async (req: Request, res: Response) => {
    try {
        const { skills, location, page = 1, limit = 10 } = req.query;

        const query: any = { role: 'job_seeker' };

        if (skills) {
            query.skills = { $in: (skills as string).split(',').map(s => s.trim()) };
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        const users = await User.find(query)
            .select('fullName bio skills location avatarUrl cvUrl')
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));

        const total = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total
        });
    } catch (error) {
        console.error('Search job seekers error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get employers (public endpoint)
router.get('/employers/search', async (req: Request, res: Response) => {
    try {
        const { industry, location, page = 1, limit = 10 } = req.query;

        const query: any = { role: 'employer' };

        if (industry) {
            query.industry = { $regex: industry, $options: 'i' };
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        const users = await User.find(query)
            .select('fullName companyName companyDescription companyLogo companyWebsite industry companySize location')
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));

        const total = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total
        });
    } catch (error) {
        console.error('Search employers error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;