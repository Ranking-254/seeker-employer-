import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// --- CORS CONFIGURATION ---
// Orodha ya website zinazoruhusiwa kuongea na server hii
const allowedOrigins = [
    'http://localhost:8080', // Frontend yako ya local
    'https://seeker-employer.vercel.app', // Frontend yako ya Vercel
    process.env.FRONTEND_URL // URL yoyote utakayoweka kwenye .env
].filter(Boolean) as string[]; // Inafuta "undefined" kama .env haipo

app.use(cors({
    origin: function (origin, callback) {
        // Inaruhusu requests zisizo na origin (kama Postman au simu)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin); // Inasaidia ku-debug origin inayokataliwa
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
// --------------------------

app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Routes
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import applicationRoutes from './routes/applications';
import profileRoutes from './routes/profiles';
import savedJobRoutes from './routes/savedJobs';

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/saved-jobs', savedJobRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

export default app;