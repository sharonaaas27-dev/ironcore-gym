import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: string;
  stripePaymentId?: string;
  membership?: mongoose.Types.ObjectId;
  booking?: mongoose.Types.ObjectId;
  duration?: 'monthly' | 'yearly';
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    method: { type: String, default: 'unknown' },
    stripePaymentId: { type: String },
    membership: { type: Schema.Types.ObjectId, ref: 'Membership' },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    duration: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', paymentSchema);
