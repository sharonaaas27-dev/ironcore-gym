import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import SectionHeading from '@components/ui/SectionHeading';
import { HiCheck } from 'react-icons/hi';
import { cn } from '@utils/cn';
import api from '@services/api';

export default function Membership() {
  const [yearly, setYearly] = useState(false);
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/memberships');
        const data = res.data.data;
        const grouped: Record<string, any> = {};
        data.forEach((item: any) => {
          const key = item.type;
          if (!grouped[key]) {
            grouped[key] = {
              name: item.name,
              description: item.description,
              popular: item.popular || false,
              price: { monthly: 0, yearly: 0 },
              features: [],
            };
          }
          if (item.duration === 'monthly') {
            grouped[key].price.monthly = item.price;
            grouped[key].price.yearly = Math.round(item.price * 12 * 0.85);
            grouped[key].features = item.features
              .filter((f: any) => f.included)
              .map((f: any) => f.name);
          }
        });
        setPlans(Object.values(grouped));
      } catch (err) {
        setError('Failed to load membership plans. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <section ref={ref} id="membership" className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          title="$Membership Plans"
          subtitle="Choose the plan that fits your goals. All plans include full access to our world-class facilities."
        />

        <div className="mb-10 flex items-center justify-center gap-4">
          <span className={cn('text-sm font-medium', !yearly ? 'text-white' : 'text-luxury-gray')}>
            Monthly
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className={cn(
              'relative h-7 w-14 rounded-full transition-colors',
              yearly ? 'bg-gold-500' : 'bg-luxury-dark'
            )}
          >
            <div
              className={cn(
                'absolute top-1 h-5 w-5 rounded-full bg-white transition-transform',
                yearly ? 'translate-x-8' : 'translate-x-1'
              )}
            />
          </button>
          <span className={cn('text-sm font-medium', yearly ? 'text-white' : 'text-luxury-gray')}>
            Yearly
            <span className="ml-1 text-gold-500">Save 15%</span>
          </span>
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl p-8 animate-pulse">
                <div className="h-6 w-28 bg-white/10 rounded mb-4" />
                <div className="h-4 w-48 bg-white/10 rounded mb-6" />
                <div className="h-10 w-32 bg-white/10 rounded mb-8" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 w-full bg-white/10 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-luxury-gray text-sm">No membership plans available at this time.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 60 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.77, 0, 0.18, 1] }}
                className={cn(
                  'glass rounded-2xl p-8 relative transition-all duration-500',
                  plan.popular && 'border-gold-500/50 scale-105 shadow-gold'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gold-500 px-4 py-1.5 text-xs font-bold text-luxury-black uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-luxury-gray">{plan.description}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">
                    ${yearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="text-sm text-luxury-gray">
                    /{yearly ? 'year' : 'month'}
                  </span>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature: string) => (
                    <li key={feature} className="flex items-start gap-3">
                      <HiCheck className="mt-0.5 text-gold-500 shrink-0" size={18} />
                      <span className="text-sm text-luxury-gray">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/checkout"
                  className={cn(
                    'mt-8 flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold transition-all',
                    plan.popular
                      ? 'bg-gold-500 text-luxury-black hover:bg-gold-400'
                      : 'border border-glass-light text-white hover:bg-white/5'
                  )}
                >
                  Get {plan.name}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
