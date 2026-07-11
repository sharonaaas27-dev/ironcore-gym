import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  sizes?: string[];
  colors?: string[];
  stock: number;
  featured: boolean;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    images: [{ type: String }],
    category: { type: String, required: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
