import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedJob extends Document {
    _id: string;
    jobSeekerId: string; // Reference to User
    jobId: string; // Reference to Job
    createdAt: Date;
}

const SavedJobSchema = new Schema<ISavedJob>({
    jobSeekerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
}, {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'saved_jobs'
});

// Ensure unique saved job per job-seeker-job combination
SavedJobSchema.index({ jobSeekerId: 1, jobId: 1 }, { unique: true });

// Indexes for better query performance
SavedJobSchema.index({ jobSeekerId: 1 });
SavedJobSchema.index({ jobId: 1 });

export default mongoose.model<ISavedJob>('SavedJob', SavedJobSchema);