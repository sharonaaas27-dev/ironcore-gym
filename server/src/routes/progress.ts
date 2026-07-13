import { Router } from 'express';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import UserProgram from '../models/UserProgram';
import Program from '../models/Program';
import TrainerRequest from '../models/TrainerRequest';
import Trainer from '../models/Trainer';
import Notification from '../models/Notification';
import { assignProgramSchema, advanceStageSchema } from '../validation/progress';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendNotification } from '../socket';

const router = Router();

router.get('/my', protect, asyncHandler(async (req: AuthRequest, res) => {
  const programs = await UserProgram.find({ user: req.user!._id })
    .populate('program', 'title slug image duration')
    .populate('assignedBy', 'name')
    .sort('-createdAt');
  res.json({ success: true, count: programs.length, data: programs });
}));

router.get('/client/:userId', protect, authorize('trainer', 'admin'), asyncHandler(async (req: AuthRequest, res) => {
  const programs = await UserProgram.find({ user: req.params.userId })
    .populate('program', 'title slug image duration stages')
    .populate('assignedBy', 'name')
    .sort('-createdAt');
  res.json({ success: true, count: programs.length, data: programs });
}));

router.post('/', protect, authorize('trainer', 'admin'), asyncHandler(async (req: AuthRequest, res) => {
  const parsed = assignProgramSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const { userId, programId } = parsed.data;

  if (req.user!.role === 'trainer') {
    const trainerDoc = await Trainer.findOne({ userId: req.user!._id });
    if (!trainerDoc) {
      return res.status(404).json({ success: false, message: 'Trainer profile not found' });
    }
    const isAssigned = await TrainerRequest.findOne({
      user: userId,
      trainer: trainerDoc._id,
      status: 'approved',
    });
    if (!isAssigned) {
      return res.status(403).json({ success: false, message: 'You can only assign programs to your own clients' });
    }
  }

  const program = await Program.findById(programId);
  if (!program) {
    return res.status(404).json({ success: false, message: 'Program not found' });
  }

  const existing = await UserProgram.findOne({ user: userId, program: programId });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Program already assigned to this user' });
  }

  const stages = (program.stages || []).map((_, i) => ({
    stageIndex: i,
    status: i === 0 ? 'active' : ('locked' as 'locked' | 'active' | 'completed'),
  }));

  const userProgram = await UserProgram.create({
    user: userId,
    program: programId,
    assignedBy: req.user!._id,
    currentStageIndex: 0,
    stages,
    status: 'assigned',
    startedAt: new Date(),
  });

  const populated = await userProgram.populate([
    { path: 'program', select: 'title slug image duration stages' },
    { path: 'assignedBy', select: 'name' },
  ]);

  const notification = await Notification.create({
    user: userId,
    title: 'New Program Assigned',
    message: `You have been assigned the program "${program.title}"`,
    type: 'info',
  });
  sendNotification(userId, notification);

  res.status(201).json({ success: true, data: populated });
}));

router.put('/:id/advance', protect, authorize('trainer', 'admin'), asyncHandler(async (req: AuthRequest, res) => {
  const userProgram = await UserProgram.findById(req.params.id);
  if (!userProgram) {
    return res.status(404).json({ success: false, message: 'Program assignment not found' });
  }

  const nextIndex = userProgram.currentStageIndex + 1;

  if (nextIndex >= userProgram.stages.length) {
    userProgram.status = 'completed';
    userProgram.completedAt = new Date();
    userProgram.currentStageIndex = userProgram.stages.length - 1;
    await userProgram.save();

    const notification = await Notification.create({
      user: userProgram.user,
      title: 'Program Completed!',
      message: 'Congratulations! You have completed all stages of your program.',
      type: 'success',
    });
    sendNotification(userProgram.user.toString(), notification);
  } else {
    userProgram.stages[userProgram.currentStageIndex].status = 'completed';
    userProgram.stages[userProgram.currentStageIndex].completedAt = new Date();
    userProgram.stages[nextIndex].status = 'active';
    userProgram.currentStageIndex = nextIndex;
    userProgram.status = 'in_progress';
    await userProgram.save();

    const program = await Program.findById(userProgram.program);
    const stageName = program?.stages?.[nextIndex]?.title || `Stage ${nextIndex + 1}`;

    const notification = await Notification.create({
      user: userProgram.user,
      title: 'Stage Complete!',
      message: `You've advanced to "${stageName}" in your program.`,
      type: 'success',
    });
    sendNotification(userProgram.user.toString(), notification);
  }

  const populated = await userProgram.populate([
    { path: 'program', select: 'title slug image duration stages' },
    { path: 'assignedBy', select: 'name' },
  ]);

  res.json({ success: true, data: populated });
}));

export default router;
