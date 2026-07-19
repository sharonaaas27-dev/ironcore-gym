import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import SectionHeading from '@components/ui/SectionHeading';
import { cn } from '@utils/cn';
import api from '@services/api';

const placeholderImages = [
  { _id: 'd1', src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', alt: 'Gym Floor', size: 'large' },
  { _id: 'd2', src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80', alt: 'Weight Training', size: 'small' },
  { _id: 'd3', src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&q=80', alt: 'CrossFit Zone', size: 'small' },
  { _id: 'd4', src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', alt: 'Cardio Area', size: 'large' },
  { _id: 'd5', src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80', alt: 'Boxing Ring', size: 'medium' },
  { _id: 'd6', src: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&q=80', alt: 'Yoga Studio', size: 'medium' },
];

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
        if (data && data.length > 0) {
          const mapped = data.map((item: any, i: number) => ({
            _id: item._id,
            src: item.image,
            alt: item.title,
            size: sizePattern[i % sizePattern.length],
          }));
          setImages(mapped);
        } else {
          setImages(placeholderImages);
        }
      } catch (err) {
        setImages(placeholderImages);
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
        <p className="mt-8 text-center text-xs text-luxury-gray/60">
          Demo images used for presentation purposes.
        </p>
      </div>
    </section>
  );
}
