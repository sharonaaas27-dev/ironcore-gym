import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import { HiChevronDown } from 'react-icons/hi';
import { cn } from '@utils/cn';
import api from '@services/api';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [faqGroups, setFaqGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get('/faq')
      .then((res) => {
        if (!mounted) return;
        if (res.data?.success && Array.isArray(res.data.data)) {
          const groups: Record<string, { q: string; a: string }[]> = {};
          res.data.data.forEach((item: any) => {
            const cat = item.category || 'General';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push({ q: item.question, a: item.answer });
          });
          setFaqGroups(Object.entries(groups).map(([category, questions]) => ({ category, questions })));
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
          <div className="relative mx-auto max-w-3xl px-6">
            <div className="mb-16 text-center">
              <h1 className="text-display-sm md:text-display-md font-bold">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h1>
              <p className="mt-4 text-lg text-luxury-gray">Everything you need to know about Ash2 Fitness.</p>
            </div>

            {loading && (
              <div className="space-y-12">
                {[1, 2, 3, 4].map((_, gi) => (
                  <div key={gi} className="mb-12 animate-pulse">
                    <div className="mb-6 h-6 w-32 bg-white/10 rounded" />
                    <div className="space-y-4">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="rounded-2xl bg-white/5 p-6">
                          <div className="h-4 w-3/4 bg-white/10 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p className="text-center text-luxury-gray">Unable to load FAQs. Please try again later.</p>
            )}

            {!loading && !error && faqGroups.length === 0 && (
              <p className="text-center text-luxury-gray">No FAQs available yet.</p>
            )}

            {!loading && !error && faqGroups.map((group, gi) => (
              <div key={group.category} className="mb-12">
                <h2 className="mb-6 text-xl font-bold text-gold-500">{group.category}</h2>
                <div className="space-y-4">
                  {group.questions.map((faq: { q: string; a: string }, i: number) => {
                    const idx = `${gi}-${i}`;
                    const isOpen = openIndex === idx;
                    return (
                      <GlassCard key={i} hover={false} className="overflow-hidden p-0">
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : idx)}
                          className="flex w-full items-center justify-between p-6 text-left"
                        >
                          <span className="font-semibold text-white">{faq.q}</span>
                          <HiChevronDown className={cn('text-gold-500 transition-transform', isOpen && 'rotate-180')} size={20} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="px-6 pb-6 text-luxury-gray leading-relaxed">{faq.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlassCard>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
