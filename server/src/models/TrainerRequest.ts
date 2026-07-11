import mongoose, { Document, Schema } from 'mongoose';

export interface ITrainerRequest extends Document {
  user: mongoose.Types.ObjectId;
  trainer: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const trainerRequestSchema = new Schema<ITrainerRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trainer: { type: Schema.Types.ObjectId, ref: 'Trainer', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

trainerRequestSchema.index({ user: 1, trainer: 1 }, { unique: true });

export default mongoose.model<ITrainerRequest>('TrainerRequest', trainerRequestSchema);
