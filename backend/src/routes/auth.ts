import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// --- 1. REGISTER ---
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').trim().isLength({ min: 1 }),
    body('role').isIn(['job_seeker', 'employer'])
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password, fullName, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ email, password: hashedPassword, fullName, role });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- 2. LOGIN ---
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- 3. GET PROFILE ---
router.get('/profile', authenticateToken, async (req: any, res: Response) => {
    try {
        const userId = req.user._id; 
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        // Wrapped in 'user' key to match frontend expectation
        res.json({ user }); 
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- 4. UPDATE PROFILE ---
router.put('/profile', authenticateToken, async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        
        // DESTRUCTURING FIX: Extract only editable fields
        // This ignores _id and email which would cause 500 errors
        const { 
            fullName, bio, location, phone,
            companyName, companyDescription, companyWebsite, companyLogo,
            industry, companySize
        } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                $set: { 
                    fullName, 
                    bio, 
                    location,
                    phone,
                    companyName,
                    companyDescription,
                    companyWebsite,
                    companyLogo,
                    industry,
                    companySize
                } 
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.json({ user: updatedUser });
    } catch (error: any) {
        console.error('Update profile error:', error.message);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;