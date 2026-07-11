import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import api from '@services/api';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/blog');
        setPosts(data.data);
      } catch {
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <PageTransition>
        <div className="noise-bg" />
        <Navbar />
        <main className="pt-32">
          <section className="relative py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
            <div className="relative mx-auto max-w-7xl px-6">
              <div className="mb-16 text-center">
                <h1 className="text-display-sm md:text-display-md font-bold">
                  Our <span className="gradient-text">Blog</span>
                </h1>
                <p className="mt-4 text-lg text-luxury-gray">Expert insights, tips, and guides for your fitness journey.</p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-52 bg-luxury-charcoal/50" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 w-1/4 bg-luxury-charcoal/50 rounded" />
                      <div className="h-4 w-3/4 bg-luxury-charcoal/50 rounded" />
                      <div className="h-3 w-full bg-luxury-charcoal/50 rounded" />
                    </div>
                  </div>
                ))}
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
            <div className="relative mx-auto max-w-7xl px-6">
              <div className="mb-16 text-center">
                <h1 className="text-display-sm md:text-display-md font-bold">
                  Our <span className="gradient-text">Blog</span>
                </h1>
                <p className="mt-4 text-lg text-luxury-gray">Expert insights, tips, and guides for your fitness journey.</p>
              </div>
              <p className="text-center text-red-400">{error}</p>
            </div>
          </section>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  if (posts.length === 0) {
    return (
      <PageTransition>
        <div className="noise-bg" />
        <Navbar />
        <main className="pt-32">
          <section className="relative py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
            <div className="relative mx-auto max-w-7xl px-6">
              <div className="mb-16 text-center">
                <h1 className="text-display-sm md:text-display-md font-bold">
                  Our <span className="gradient-text">Blog</span>
                </h1>
                <p className="mt-4 text-lg text-luxury-gray">Expert insights, tips, and guides for your fitness journey.</p>
              </div>
              <p className="text-center text-luxury-gray">No posts yet.</p>
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
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <h1 className="text-display-sm md:text-display-md font-bold">
                Our <span className="gradient-text">Blog</span>
              </h1>
              <p className="mt-4 text-lg text-luxury-gray">Expert insights, tips, and guides for your fitness journey.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Link key={post._id} to={`/blog/${post.slug}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group glass rounded-2xl overflow-hidden hover-lift"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-gold-500/90 px-3 py-1 text-xs font-semibold text-luxury-black">{post.category}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-luxury-gray">
                        <span>{post.author?.name || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>{post.readTime + ' min'} read</span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-white group-hover:text-gold-500 transition-colors">{post.title}</h3>
                      <p className="mt-2 text-sm text-luxury-gray leading-relaxed">{post.excerpt}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-500 group-hover:gap-2 transition-all">Read More →</span>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
