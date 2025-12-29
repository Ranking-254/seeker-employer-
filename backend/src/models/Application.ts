import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IApplication extends Document {
  // Removed _id here to avoid potential Document inheritance conflicts
  jobId: Types.ObjectId;
  jobSeekerId: Types.ObjectId;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter?: string;
  cvUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    jobSeekerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
    },
    coverLetter: {
      type: String,
    },
    cvUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'applications',
  }
);

// Indexes
ApplicationSchema.index({ jobId: 1, jobSeekerId: 1 }, { unique: true });
ApplicationSchema.index({ jobId: 1 });
ApplicationSchema.index({ jobSeekerId: 1 });
ApplicationSchema.index({ status: 1 });

export default mongoose.model<IApplication>('Application', ApplicationSchema);