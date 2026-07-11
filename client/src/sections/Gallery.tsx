import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import SectionHeading from '@components/ui/SectionHeading';
import { cn } from '@utils/cn';
import api from '@services/api';

const sizePattern = ['large', 'small', 'small', 'large', 'medium', 'medium'];

export default function Gallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const response = await api.get('/gallery');
        const data = response.data.data;
        const mapped = data.map((item: any, i: number) => ({
          _id: item._id,
          src: item.image,
          alt: item.title,
          size: sizePattern[i % sizePattern.length],
        }));
        setImages(mapped);
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-luxury-black" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Our $Facility"
          subtitle="Experience premium training environments designed for peak performance."
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
          </div>
        ) : images.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-luxury-gray">No gallery images available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:grid-rows-2">
            {images.map((image, i) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl cursor-pointer',
                  image.size === 'large' && 'col-span-2 row-span-2',
                  image.size === 'medium' && 'col-span-1 row-span-1'
                )}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-luxury-black/0 transition-colors duration-300 group-hover:bg-luxury-black/40" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-sm font-semibold tracking-wider text-white uppercase">
                    {image.alt}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
