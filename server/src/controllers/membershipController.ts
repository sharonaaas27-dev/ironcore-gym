import { Request, Response } from 'express';
import Membership from '../models/Membership';
import { createMembershipSchema, updateMembershipSchema } from '../validation/membership';
import { getPaginationParams, buildPaginationResponse } from '../utils/helpers';

export const getMemberships = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const { skip } = getPaginationParams(page, limit);
  const total = await Membership.countDocuments();
  const memberships = await Membership.find().skip(skip).limit(limit);
  res.json({ success: true, count: memberships.length, data: memberships, pagination: buildPaginationResponse(total, page, limit) });
};

export const getMembership = async (req: Request, res: Response) => {
  const membership = await Membership.findById(req.params.id);
  if (!membership) {
    return res.status(404).json({ success: false, message: 'Membership not found' });
  }
  res.json({ success: true, data: membership });
};

export const createMembership = async (req: Request, res: Response) => {
  const parsed = createMembershipSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }
  const membership = await Membership.create(parsed.data);
  res.status(201).json({ success: true, data: membership });
};

export const updateMembership = async (req: Request, res: Response) => {
  const parsed = updateMembershipSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }
  const membership = await Membership.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
  if (!membership) {
    return res.status(404).json({ success: false, message: 'Membership not found' });
  }
  res.json({ success: true, data: membership });
};

export const deleteMembership = async (req: Request, res: Response) => {
  const membership = await Membership.findByIdAndDelete(req.params.id);
  if (!membership) {
    return res.status(404).json({ success: false, message: 'Membership not found' });
  }
  res.json({ success: true, message: 'Membership deleted' });
};
