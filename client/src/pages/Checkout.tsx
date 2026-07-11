import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import MagneticButton from '@components/buttons/MagneticButton';
import { cn } from '@utils/cn';
import api from '@services/api';
import { APP_CONFIG } from '@/app/config';

const stripeKey = APP_CONFIG.stripeKey;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

function PaymentForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/dashboard' },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      <MagneticButton>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="mt-6 w-full rounded-xl bg-gold-500 py-4 font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Pay Now`}
        </button>
      </MagneticButton>
    </form>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('Gold');
  const [yearly, setYearly] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'payment'>('select');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/memberships');
        const data = res.data.data;
        const seen = new Set<string>();
        const monthly = data
          .filter((item: any) => item.duration === 'monthly')
          .filter((item: any) => {
            if (seen.has(item.name)) return false;
            seen.add(item.name);
            return true;
          })
          .map((item: any) => ({ _id: item._id, name: item.name, price: item.price, type: item.type }));
        setPlans(monthly);
      } catch {
        setError('Failed to load plans. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const selected = plans.find((p) => p.name === selectedPlan);
  const finalPrice = selected ? (yearly ? Math.round(selected.price * 12 * 0.85) : selected.price) : 0;

  const handleProceedToPayment = async () => {
    if (!selected) return;
    try {
      setPaymentError(null);
      const res = await api.post('/payments/create-payment-intent', { membershipId: selected._id, duration: yearly ? 'yearly' : 'monthly' });
      setClientSecret(res.data.data.clientSecret);
      setStep('payment');
    } catch (err: any) {
      setPaymentError(err?.response?.data?.message || 'Failed to initialize payment');
    }
  };

  const handlePaymentSuccess = () => {
    navigate('/dashboard');
  };

  if (step === 'payment' && clientSecret) {
    const options: StripeElementsOptions = { clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#D4AF37' } } };
    return (
      <PageTransition>
        <div className="noise-bg" />
        <Navbar />
        <main className="pt-32">
          <section className="relative min-h-screen py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
            <div className="relative mx-auto max-w-lg px-6">
              <GlassCard className="p-8">
                <h2 className="mb-6 text-xl font-bold text-white">Complete Payment</h2>
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between text-sm text-luxury-gray">
                    <span>Plan</span>
                    <span className="font-semibold text-white">{selected?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm text-luxury-gray">
                    <span>Billing</span>
                    <span className="font-semibold text-white">{yearly ? 'Yearly' : 'Monthly'}</span>
                  </div>
                  <div className="border-t border-glass-light pt-3 flex justify-between">
                    <span className="font-bold text-white">Total</span>
                    <span className="text-xl font-bold text-gold-500">${finalPrice}</span>
                  </div>
                </div>
                <Elements stripe={stripePromise} options={options}>
                  <PaymentForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
                </Elements>
              </GlassCard>
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
        <section className="relative min-h-screen py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
          <div className="relative mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <h1 className="text-display-sm font-bold">Complete Your <span className="gradient-text">Membership</span></h1>
            </div>

            {loading ? (
              <div className="grid gap-8 lg:grid-cols-2">
                <GlassCard className="p-8">
                  <div className="h-6 w-32 bg-white/10 rounded animate-pulse mb-6" />
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-14 w-full bg-white/10 rounded-xl animate-pulse" />
                    ))}
                  </div>
                  <div className="mt-6 h-7 w-40 bg-white/10 rounded animate-pulse" />
                </GlassCard>
                <GlassCard className="p-8">
                  <div className="h-6 w-32 bg-white/10 rounded animate-pulse mb-6" />
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-5 w-full bg-white/10 rounded animate-pulse" />
                    ))}
                  </div>
                </GlassCard>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-2">
                <GlassCard className="p-8">
                  <h2 className="mb-6 text-xl font-bold text-white">Select Plan</h2>
                  <div className="space-y-4">
                    {plans.map((plan) => (
                      <button
                        key={plan.name}
                        onClick={() => setSelectedPlan(plan.name)}
                        className={cn(
                          'w-full rounded-xl border p-4 text-left transition-all',
                          selectedPlan === plan.name
                            ? 'border-gold-500 bg-gold-500/10'
                            : 'border-glass-light hover:border-gold-500/50'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{plan.name}</span>
                          <span className="font-bold text-gold-500">${yearly ? Math.round(plan.price * 12 * 0.85) : plan.price}/{yearly ? 'yr' : 'mo'}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <span className={cn('text-sm', !yearly ? 'text-white' : 'text-luxury-gray')}>Monthly</span>
                    <button onClick={() => setYearly(!yearly)} className={cn('relative h-7 w-14 rounded-full transition-colors', yearly ? 'bg-gold-500' : 'bg-luxury-dark')}>
                      <div className={cn('absolute top-1 h-5 w-5 rounded-full bg-white transition-transform', yearly ? 'translate-x-8' : 'translate-x-1')} />
                    </button>
                    <span className={cn('text-sm', yearly ? 'text-white' : 'text-luxury-gray')}>Yearly</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-8">
                  <h2 className="mb-6 text-xl font-bold text-white">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-luxury-gray">
                      <span>Plan</span>
                      <span className="text-white font-semibold">{selected?.name || '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm text-luxury-gray">
                      <span>Billing</span>
                      <span className="text-white font-semibold">{yearly ? 'Yearly' : 'Monthly'}</span>
                    </div>
                    <div className="border-t border-glass-light pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-white">Total</span>
                        <span className="text-2xl font-bold text-gold-500">${finalPrice}</span>
                      </div>
                      <span className="text-xs text-luxury-gray">{yearly ? 'Billed annually' : 'Billed monthly'}</span>
                    </div>
                  </div>

                  {paymentError && <p className="text-sm text-red-400">{paymentError}</p>}

                  <MagneticButton>
                    <button
                      onClick={handleProceedToPayment}
                      className="mt-6 w-full rounded-xl bg-gold-500 py-4 font-bold text-luxury-black transition-all hover:bg-gold-400"
                    >
                      Proceed to Payment
                    </button>
                  </MagneticButton>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-luxury-gray">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    Secured with Stripe
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
