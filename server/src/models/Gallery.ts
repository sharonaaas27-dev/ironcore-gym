import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  image: string;
  category: string;
  createdAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IGallery>('Gallery', gallerySchema);
