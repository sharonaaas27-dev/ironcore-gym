import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserProgramStage {
  stageIndex: number;
  status: 'locked' | 'active' | 'completed';
  completedAt?: Date;
}

export interface IUserProgram extends Document {
  user: Types.ObjectId;
  program: Types.ObjectId;
  assignedBy: Types.ObjectId;
  currentStageIndex: number;
  stages: IUserProgramStage[];
  status: 'assigned' | 'in_progress' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

const userProgramStageSchema = new Schema<IUserProgramStage>(
  {
    stageIndex: { type: Number, required: true },
    status: { type: String, enum: ['locked', 'active', 'completed'], default: 'locked' },
    completedAt: { type: Date },
  },
  { _id: false }
);

const userProgramSchema = new Schema<IUserProgram>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    program: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    currentStageIndex: { type: Number, default: 0 },
    stages: [userProgramStageSchema],
    status: { type: String, enum: ['assigned', 'in_progress', 'completed'], default: 'assigned' },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

userProgramSchema.index({ user: 1, program: 1 }, { unique: true });

export default mongoose.model<IUserProgram>('UserProgram', userProgramSchema);
