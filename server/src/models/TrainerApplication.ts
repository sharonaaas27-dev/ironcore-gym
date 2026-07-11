import mongoose, { Document, Schema } from 'mongoose';

export interface ITrainerApplication extends Document {
  user: mongoose.Types.ObjectId;
  bio: string;
  specialties: string[];
  experience: number;
  phone?: string;
  certificates: string[];
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const trainerApplicationSchema = new Schema<ITrainerApplication>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, required: [true, 'Bio is required'], maxlength: 1000 },
    specialties: { type: [String], required: [true, 'At least one specialty is required'] },
    experience: { type: Number, required: [true, 'Experience is required'], min: 0, max: 70 },
    phone: { type: String, trim: true },
    certificates: { type: [String], default: [] },
    socialLinks: {
      instagram: { type: String },
      facebook: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ITrainerApplication>('TrainerApplication', trainerApplicationSchema);
