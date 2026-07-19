import { Response, Request } from 'express';
import Blog from '../models/Blog';
import { createBlogSchema, updateBlogSchema } from '../validation/blog';
import { uploadImage } from '../services/cloudinaryService';
import { AuthRequest } from '../middleware/auth';
import { getPaginationParams, buildPaginationResponse, slugify } from '../utils/helpers';

export const getPosts = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const { skip } = getPaginationParams(page, limit);
  const total = await Blog.countDocuments();
  const posts = await Blog.find()
    .populate('author', 'name email avatar')
    .sort('-publishedAt')
    .skip(skip)
    .limit(limit);
  res.json({ success: true, count: posts.length, data: posts, pagination: buildPaginationResponse(total, page, limit) });
};

export const getPost = async (req: AuthRequest, res: Response) => {
  const post = await Blog.findOne({ slug: req.params.slug }).populate('author', 'name email avatar');
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
  res.json({ success: true, data: post });
};

export const createPost = async (req: AuthRequest, res: Response) => {
  const parsed = createBlogSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const file = (req as any).file as Express.Multer.File | undefined;
  if (file) {
    const result = await uploadImage(file.path, 'ash2-fitness/blog');
    parsed.data.image = result.url;
  }

  let slug = slugify(parsed.data.title);
  const existingSlug = await Blog.findOne({ slug });
  if (existingSlug) {
    let counter = 1;
    while (await Blog.findOne({ slug: `${slug}-${counter}` })) {
      counter++;
    }
    slug = `${slug}-${counter}`;
  }
  const post = await Blog.create({ ...parsed.data, slug, author: req.user!._id });
  res.status(201).json({ success: true, data: post });
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  const parsed = updateBlogSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }
  const updateData: Record<string, unknown> = { ...parsed.data };
  // Regenerate slug if title changed
  if (updateData.title) {
    let slug = slugify(updateData.title as string);
    const existingSlug = await Blog.findOne({ slug, _id: { $ne: req.params.id } });
    if (existingSlug) {
      let counter = 1;
      while (await Blog.findOne({ slug: `${slug}-${counter}`, _id: { $ne: req.params.id } })) {
        counter++;
      }
      slug = `${slug}-${counter}`;
    }
    updateData.slug = slug;
  }
  const post = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
  res.json({ success: true, data: post });
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  const post = await Blog.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
  res.json({ success: true, message: 'Post deleted' });
};

export const uploadBlogImage = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }
  const result = await uploadImage(file.path, 'ash2-fitness/blog');
  res.json({ success: true, data: { url: result.url, publicId: result.publicId } });
};
