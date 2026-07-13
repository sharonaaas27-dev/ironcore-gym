import mongoose, { Document, Schema } from 'mongoose';

export interface IProgramStage {
  title: string;
  description: string;
  order: number;
  duration: string;
}

export interface IProgram extends Document {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  image: string;
  video?: string;
  duration: string;
  intensity: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  trainer: mongoose.Types.ObjectId;
  schedule: { day: string; time: string; trainer: string }[];
  benefits: string[];
  stages: IProgramStage[];
  enrolledCount: number;
  createdAt: Date;
}

const stageSchema = new Schema<IProgramStage>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
    duration: { type: String, required: true },
  },
  { _id: false }
);

const programSchema = new Schema<IProgram>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    category: { type: String, required: true },
    image: { type: String, required: true },
    video: { type: String },
    duration: { type: String, required: true },
    intensity: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    price: { type: Number, required: true },
    trainer: { type: Schema.Types.ObjectId, ref: 'Trainer' },
    schedule: [{ day: String, time: String, trainer: String }],
    benefits: [{ type: String }],
    stages: [stageSchema],
    enrolledCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProgram>('Program', programSchema);
