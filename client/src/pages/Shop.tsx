import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import api from '@services/api';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80';

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get('/products')
      .then((res) => {
        if (!mounted) return;
        if (res.data?.success && Array.isArray(res.data.data)) {
          setProducts(res.data.data.map((p: any) => ({
            name: p.name,
            price: p.price,
            image: p.images?.[0] || PLACEHOLDER_IMAGE,
            category: p.category,
          })));
        }
      })
      .catch(() => { if (mounted) setError(true); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="pt-32">
        <section className="relative py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <h1 className="text-display-sm md:text-display-md font-bold">IRONCORE <span className="gradient-text">Shop</span></h1>
              <p className="mt-4 text-lg text-luxury-gray">Premium gear for premium athletes.</p>
            </div>

            {loading && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/5 p-4 animate-pulse">
                    <div className="aspect-square rounded-xl mb-4 bg-white/10" />
                    <div className="h-3 w-16 bg-white/10 rounded mb-2" />
                    <div className="h-4 w-32 bg-white/10 rounded mb-2" />
                    <div className="h-5 w-20 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p className="text-center text-luxury-gray">Unable to load products. Please try again later.</p>
            )}

            {!loading && !error && products.length === 0 && (
              <p className="text-center text-luxury-gray">No products available yet.</p>
            )}

            {!loading && !error && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product, i) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard className="p-4">
                      <div className="aspect-square overflow-hidden rounded-xl mb-4">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" loading="lazy" />
                      </div>
                      <p className="text-xs text-gold-500 uppercase tracking-wider">{product.category}</p>
                      <h3 className="mt-1 font-bold text-white">{product.name}</h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-bold text-gold-500">${product.price}</span>
                        <button className="rounded-lg bg-gold-500 px-4 py-2 text-xs font-bold text-luxury-black transition-all hover:bg-gold-400">Add to Cart</button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
