import mongoose, { Document, Schema } from 'mongoose';

export interface IPasswordResetToken extends Document {
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>({
  email: { type: String, required: true, lowercase: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
}, { timestamps: true });

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IPasswordResetToken>('PasswordResetToken', passwordResetTokenSchema);
