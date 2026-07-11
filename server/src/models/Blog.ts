import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: mongoose.Types.ObjectId;
  image: string;
  category: string;
  tags: string[];
  readTime: number;
  publishedAt: Date;
  createdAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    readTime: { type: Number, default: 5 },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>('Blog', blogSchema);
