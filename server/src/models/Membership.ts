import mongoose, { Document, Schema } from 'mongoose';

export interface IMembership extends Document {
  type: 'silver' | 'gold' | 'platinum';
  name: string;
  description: string;
  price: number;
  duration: 'monthly' | 'yearly';
  benefits: string[];
  features: { name: string; included: boolean }[];
  popular: boolean;
  createdAt: Date;
}

const membershipSchema = new Schema<IMembership>(
  {
    type: { type: String, enum: ['silver', 'gold', 'platinum'], required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    benefits: [{ type: String }],
    features: [{ name: String, included: Boolean }],
    popular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IMembership>('Membership', membershipSchema);
