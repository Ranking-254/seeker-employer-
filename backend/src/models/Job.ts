import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
    _id: string;
    employerId: string; // Reference to User
    title: string;
    description: string;
    requirements: string[];
    jobType: 'full_time' | 'part_time' | 'contract' | 'internship';
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    category?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const JobSchema = new Schema<IJob>({
    employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    jobType: { type: String, enum: ['full_time', 'part_time', 'contract', 'internship'], required: true },
    location: { type: String, required: true },
    salaryMin: Number,
    salaryMax: Number,
    category: String,
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    collection: 'jobs'
});

// Indexes for better query performance
JobSchema.index({ employerId: 1 });
JobSchema.index({ category: 1 });
JobSchema.index({ isActive: 1 });
JobSchema.index({ createdAt: -1 });

export default mongoose.model<IJob>('Job', JobSchema);