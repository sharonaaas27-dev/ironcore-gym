import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiClock, HiArrowRight } from 'react-icons/hi';
import { formatDate } from '@utils/helpers';
import type { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  isVisible?: boolean;
}

export default function BlogCard({ post, index = 0, isVisible = true }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.77, 0, 0.18, 1] }}
    >
      <Link to={`/blog/${post.slug}`} className="group glass block overflow-hidden rounded-2xl hover-lift">
        <div className="relative h-52 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="rounded-full bg-gold-500/90 px-3 py-1 text-xs font-semibold text-luxury-black">
              {post.category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 text-xs text-luxury-gray">
            <span>{formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1">
              <HiClock className="h-3 w-3" /> {post.readTime} min read
            </span>
          </div>
          <h3 className="mt-3 text-lg font-bold text-white transition-colors group-hover:text-gold-500">
            {post.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-luxury-gray line-clamp-2">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gold-500">
            <span>Read More</span>
            <HiArrowRight className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
