import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
    _id: string;
    jobId: string; // Reference to Job
    jobSeekerId: string; // Reference to User
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    coverLetter?: string;
    cvUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    jobSeekerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
    coverLetter: String,
    cvUrl: String,
}, {
    timestamps: true,
    collection: 'applications'
});

// Ensure unique application per job-seeker-job combination
ApplicationSchema.index({ jobId: 1, jobSeekerId: 1 }, { unique: true });

// Indexes for better query performance
ApplicationSchema.index({ jobId: 1 });
ApplicationSchema.index({ jobSeekerId: 1 });
ApplicationSchema.index({ status: 1 });

export default mongoose.model<IApplication>('Application', ApplicationSchema);