import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import api from '@services/api';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/blog/${slug}`);
        setPost(data.data);
      } catch {
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <PageTransition>
        <div className="noise-bg" />
        <Navbar />
        <main className="pt-32">
          <section className="relative py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
            <div className="relative mx-auto max-w-4xl px-6">
              <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-luxury-gray hover:text-gold-500 transition-colors">
                ← Back to Blog
              </Link>
              <div className="animate-pulse space-y-6">
                <div className="h-[400px] w-full rounded-2xl bg-luxury-charcoal/50" />
                <div className="space-y-4 p-8 md:p-12">
                  <div className="h-4 w-1/3 bg-luxury-charcoal/50 rounded" />
                  <div className="h-8 w-3/4 bg-luxury-charcoal/50 rounded" />
                  <div className="h-4 w-full bg-luxury-charcoal/50 rounded" />
                  <div className="h-4 w-full bg-luxury-charcoal/50 rounded" />
                  <div className="h-4 w-2/3 bg-luxury-charcoal/50 rounded" />
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="noise-bg" />
        <Navbar />
        <main className="pt-32">
          <section className="relative py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
            <div className="relative mx-auto max-w-4xl px-6">
              <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-luxury-gray hover:text-gold-500 transition-colors">
                ← Back to Blog
              </Link>
              <p className="text-center text-red-400">{error}</p>
            </div>
          </section>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  if (!post) {
    return (
      <PageTransition>
        <div className="noise-bg" />
        <Navbar />
        <main className="pt-32">
          <section className="relative py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
            <div className="relative mx-auto max-w-4xl px-6">
              <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-luxury-gray hover:text-gold-500 transition-colors">
                ← Back to Blog
              </Link>
              <p className="text-center text-luxury-gray">Post not found.</p>
            </div>
          </section>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="pt-32">
        <section className="relative py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
          <div className="relative mx-auto max-w-4xl px-6">
            <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-luxury-gray hover:text-gold-500 transition-colors">
              ← Back to Blog
            </Link>
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              src={post.image}
              alt={post.title}
              className="mb-8 h-[400px] w-full rounded-2xl object-cover"
            />
            <GlassCard className="p-8 md:p-12">
              <div className="flex items-center gap-4 text-sm text-luxury-gray mb-6">
                <span className="rounded-full bg-gold-500/20 px-3 py-1 text-gold-500 font-semibold">{post.category}</span>
                <span>{post.author?.name || 'Anonymous'}</span>
                <span>•</span>
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>•</span>
                <span>{post.readTime + ' min read'}</span>
              </div>
              <h1 className="text-display-sm font-bold text-white mb-6">
                {post.title}
              </h1>
              <div className="prose prose-invert max-w-none">
                {post.content.split('\n').map((paragraph: string, i: number) => (
                  <p key={i} className={i > 0 ? 'mt-6 text-lg leading-relaxed text-luxury-gray' : 'text-lg leading-relaxed text-luxury-gray'}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
