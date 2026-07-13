import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReply {
  _id?: Types.ObjectId;
  message: string;
  repliedBy: Types.ObjectId;
  createdAt: Date;
}

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  status: 'open' | 'replied';
  replies: IReply[];
  createdAt: Date;
}

const replySchema = new Schema<IReply>(
  {
    message: { type: String, required: true },
    repliedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true, maxlength: 2000 },
    read: { type: Boolean, default: false },
    status: { type: String, enum: ['open', 'replied'], default: 'open' },
    replies: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.model<IContact>('Contact', contactSchema);
