import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        // Tunatumia .env pekee. Kama haipo, mongoURI itakuwa undefined
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 15000, 
            socketTimeoutMS: 45000,
        } as mongoose.ConnectOptions);

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;