import { Router } from 'express';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import Message from '../models/Message';
import TrainerRequest from '../models/TrainerRequest';
import Trainer from '../models/Trainer';
import User from '../models/User';
import { sendMessageSchema } from '../validation/message';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendNotification } from '../socket';

const router = Router();

function getConversationId(a: string, b: string): string {
  return [a, b].sort().join('_');
}

router.get('/conversations', protect, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!._id.toString();

  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: req.user!._id }, { receiver: req.user!._id }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$conversationId',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$receiver', req.user!._id] }, { $eq: ['$read', false] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { 'lastMessage.createdAt': -1 } },
  ]);

  const populated = await Message.populate(conversations.map((c) => c.lastMessage), [
    { path: 'sender', select: 'name avatar' },
    { path: 'receiver', select: 'name avatar' },
  ]);

  const result = conversations.map((c, i) => ({
    conversationId: c._id,
    lastMessage: populated[i],
    unreadCount: c.unreadCount,
  }));

  res.json({ success: true, count: result.length, data: result });
}));

router.get('/conversations/:conversationId', protect, asyncHandler(async (req: AuthRequest, res) => {
  const messages = await Message.find({ conversationId: req.params.conversationId })
    .sort({ createdAt: 1 })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');

  res.json({ success: true, count: messages.length, data: messages });
}));

router.post('/', protect, asyncHandler(async (req: AuthRequest, res) => {
  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const { receiverId, body } = parsed.data;
  const senderId = req.user!._id.toString();

  if (receiverId === senderId) {
    return res.status(400).json({ success: false, message: 'Cannot send a message to yourself' });
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({ success: false, message: 'Receiver not found' });
  }

  const senderRole = req.user!.role;
  if (senderRole === 'user') {
    const trainerDoc = await Trainer.findOne({ userId: receiver._id });
    if (!trainerDoc) {
      return res.status(403).json({ success: false, message: 'Users can only message their assigned trainer' });
    }
    const isAssigned = await TrainerRequest.findOne({
      user: req.user!._id,
      trainer: trainerDoc._id,
      status: 'approved',
    });
    if (!isAssigned) {
      return res.status(403).json({ success: false, message: 'You can only message your assigned trainer' });
    }
  }

  const conversationId = getConversationId(senderId, receiverId);

  const message = await Message.create({
    sender: req.user!._id,
    receiver: receiver._id,
    conversationId,
    body,
    read: false,
  });

  const populated = await message.populate([
    { path: 'sender', select: 'name avatar' },
    { path: 'receiver', select: 'name avatar' },
  ]);

  sendNotification(receiverId, {
    type: 'new_message',
    title: 'New Message',
    message: `${req.user!.name} sent you a message`,
    conversationId,
  });

  res.status(201).json({ success: true, data: populated });
}));

router.put('/:id/read', protect, asyncHandler(async (req: AuthRequest, res) => {
  const message = await Message.findOneAndUpdate(
    { _id: req.params.id, receiver: req.user!._id },
    { read: true },
    { new: true }
  );
  if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
  res.json({ success: true, data: message });
}));

router.get('/unread-count', protect, asyncHandler(async (req: AuthRequest, res) => {
  const count = await Message.countDocuments({ receiver: req.user!._id, read: false });
  res.json({ success: true, count });
}));

export default router;
