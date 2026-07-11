import mongoose, { Document, Schema } from 'mongoose';

export interface ITrainer extends Document {
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  bio: string;
  specialties: string[];
  experience: number;
  certificates: string[];
  socialLinks: { instagram?: string; facebook?: string; twitter?: string; linkedin?: string };
  rating: number;
  available: boolean;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const trainerSchema = new Schema<ITrainer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    avatar: { type: String },
    bio: { type: String, required: true },
    specialties: [{ type: String }],
    experience: { type: Number, required: true },
    certificates: [{ type: String }],
    socialLinks: {
      instagram: String,
      facebook: String,
      twitter: String,
      linkedin: String,
    },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    available: { type: Boolean, default: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<ITrainer>('Trainer', trainerSchema);
