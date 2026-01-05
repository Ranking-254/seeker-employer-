import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IApplication extends Document {
  jobId: Types.ObjectId | any; 
  jobSeekerId: Types.ObjectId | any;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter: string;
  cvUrl: string;
  // REKEBISHO: Lazima uiongeze hapa ili TypeScript isiwe na error
  employerNotes: string; 
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    jobSeekerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Job Seeker ID is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
    },
    coverLetter: {
      type: String,
      required: [true, 'Please provide a cover letter'],
      trim: true
    },
    cvUrl: {
      type: String,
      required: [true, 'CV URL is required'],
      trim: true
    },
    // Hii iko sawa, nimeiweka vizuri tu muonekano
    employerNotes: {
      type: String,
      default: "",
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