import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  trainer?: mongoose.Types.ObjectId;
  program?: mongoose.Types.ObjectId;
  date?: Date;
  time?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: 'training' | 'class';
  createdAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trainer: { type: Schema.Types.ObjectId, ref: 'Trainer' },
    program: { type: Schema.Types.ObjectId, ref: 'Program' },
    date: { type: Date },
    time: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    type: { type: String, enum: ['training', 'class'], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
