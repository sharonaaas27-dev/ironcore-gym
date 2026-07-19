import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import { cn } from '@utils/cn';
import api from '@services/api';

const placeholderImages = [
  { _id: 'd1', src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', alt: 'Gym Floor', category: 'Facility' },
  { _id: 'd2', src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80', alt: 'Weight Training', category: 'Training' },
  { _id: 'd3', src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80', alt: 'CrossFit Zone', category: 'Training' },
  { _id: 'd4', src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', alt: 'Boxing Ring', category: 'Training' },
  { _id: 'd5', src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', alt: 'Cardio Area', category: 'Facility' },
  { _id: 'd6', src: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80', alt: 'Personal Training', category: 'Training' },
  { _id: 'd7', src: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=600&q=80', alt: 'Yoga Studio', category: 'Events' },
  { _id: 'd8', src: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&q=80', alt: 'Locker Room', category: 'Facility' },
  { _id: 'd9', src: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=80', alt: 'Group Class', category: 'Events' },
];

const placeholderCategories = ['All', 'Facility', 'Training', 'Events'];

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
        if (data && data.length > 0) {
          const mapped = data.map((item: any) => ({
            _id: item._id,
            src: item.image,
            alt: item.title,
            category: item.category,
          }));
          setImages(mapped);
          const cats = ['All', ...new Set<string>(data.map((item: any) => item.category))];
          setCategories(cats);
        } else {
          setImages(placeholderImages);
          setCategories(placeholderCategories);
        }
      } catch (err) {
        setImages(placeholderImages);
        setCategories(placeholderCategories);
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
              <p className="mt-4 text-lg text-luxury-gray">Demo images used for presentation purposes.</p>
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

                <p className="mt-10 text-center text-xs text-luxury-gray/60">
                  Demo images used for presentation purposes.
                </p>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
