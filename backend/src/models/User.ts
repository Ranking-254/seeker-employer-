import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    fullName: string;
    role: 'job_seeker' | 'employer' | 'admin';
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    // Job seeker specific fields
    bio?: string;
    skills?: string[];
    education?: any[];
    experience?: any[];
    cvUrl?: string;
    phone?: string;
    location?: string;
    // Employer specific fields
    companyName?: string;
    companyDescription?: string;
    companyLogo?: string;
    companyWebsite?: string;
    industry?: string;
    companySize?: string;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, enum: ['job_seeker', 'employer', 'admin'], required: true },
    avatarUrl: String,
    // Job seeker fields
    bio: String,
    skills: [String],
    education: [Schema.Types.Mixed],
    experience: [Schema.Types.Mixed],
    cvUrl: String,
    phone: String,
    location: String,
    // Employer fields
    companyName: String,
    companyDescription: String,
    companyLogo: String,
    companyWebsite: String,
    industry: String,
    companySize: String,
}, {
    timestamps: true,
    collection: 'users'
});

export default mongoose.model<IUser>('User', UserSchema);