import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import { cn } from '@utils/cn';
import api from '@services/api';

export default function Gallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const response = await api.get('/gallery');
        const data = response.data.data;
        const mapped = data.map((item: any) => ({
          _id: item._id,
          src: item.image,
          alt: item.title,
          category: item.category,
        }));
        setImages(mapped);
        const cats = ['All', ...new Set<string>(data.map((item: any) => item.category))];
        setCategories(cats);
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filtered = activeCategory === 'All'
    ? images
    : images.filter((img) => img.category === activeCategory);

  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="pt-32">
        <section className="relative py-32 min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <h1 className="text-display-sm md:text-display-md font-bold">
                Our <span className="gradient-text">Gallery</span>
              </h1>
              <p className="mt-4 text-lg text-luxury-gray">Take a visual tour of our premium facility.</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
              </div>
            ) : images.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-lg text-luxury-gray">No gallery images available at the moment.</p>
              </div>
            ) : (
              <>
                <div className="mb-10 flex flex-wrap justify-center gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        'rounded-full px-6 py-2.5 text-sm font-semibold transition-all',
                        activeCategory === cat
                          ? 'bg-gold-500 text-luxury-black'
                          : 'bg-glass-light text-luxury-gray hover:text-white'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((image, i) => (
                    <motion.div
                      key={image._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05 }}
                      className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
                    >
                      <img src={image.src} alt={image.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-luxury-black/0 transition-colors duration-300 group-hover:bg-luxury-black/60" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="text-center">
                          <p className="text-lg font-bold text-white">{image.alt}</p>
                          <p className="text-sm text-gold-500">{image.category}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
