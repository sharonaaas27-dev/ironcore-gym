import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  rating: number;
  transformation?: {
    before: string;
    after: string;
  };
  createdAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 500 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    transformation: {
      before: String,
      after: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
