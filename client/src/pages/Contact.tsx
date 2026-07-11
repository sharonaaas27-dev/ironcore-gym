import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import api from '@services/api';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  subject: z.string().min(5),
  message: z.string().min(20),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setStatus('idle');
    try {
      await api.post('/contact', data);
      setStatus('success');
      setStatusMessage('Your message has been sent. We will get back to you soon!');
      reset();
    } catch {
      setStatus('error');
      setStatusMessage('Failed to send message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

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
                Get in <span className="gradient-text">Touch</span>
              </h1>
              <p className="mt-4 text-lg text-luxury-gray">Ready to start your journey? We're here to help.</p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              <GlassCard className="p-8">
                <h2 className="mb-8 text-2xl font-bold text-white">Send Us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <input {...register('name')} placeholder="Your Name" className="w-full rounded-xl bg-luxury-dark px-4 py-3.5 text-white placeholder:text-luxury-gray focus:outline-none focus:ring-2 focus:ring-gold-500/50" />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <input {...register('email')} type="email" placeholder="Your Email" className="w-full rounded-xl bg-luxury-dark px-4 py-3.5 text-white placeholder:text-luxury-gray focus:outline-none focus:ring-2 focus:ring-gold-500/50" />
                      {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                    </div>
                    <div>
                      <input {...register('phone')} placeholder="Your Phone" className="w-full rounded-xl bg-luxury-dark px-4 py-3.5 text-white placeholder:text-luxury-gray focus:outline-none focus:ring-2 focus:ring-gold-500/50" />
                      {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div>
                    <input {...register('subject')} placeholder="Subject" className="w-full rounded-xl bg-luxury-dark px-4 py-3.5 text-white placeholder:text-luxury-gray focus:outline-none focus:ring-2 focus:ring-gold-500/50" />
                    {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <textarea {...register('message')} rows={5} placeholder="Your Message" className="w-full resize-none rounded-xl bg-luxury-dark px-4 py-3.5 text-white placeholder:text-luxury-gray focus:outline-none focus:ring-2 focus:ring-gold-500/50" />
                    {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                  </div>
                  {status === 'success' && (
                    <p className="text-sm text-green-400">{statusMessage}</p>
                  )}
                  {status === 'error' && (
                    <p className="text-sm text-red-400">{statusMessage}</p>
                  )}
                  <button type="submit" disabled={submitting} className="w-full rounded-xl bg-gold-500 py-4 font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50">
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </GlassCard>

              <div className="space-y-6">
                <GlassCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20">
                      <HiLocationMarker className="text-gold-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Visit Us</h3>
                      <p className="mt-1 text-sm text-luxury-gray">123 Fitness Avenue<br />Downtown City, ST 12345</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20">
                      <HiPhone className="text-gold-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Call Us</h3>
                      <p className="mt-1 text-sm text-luxury-gray">+1 (555) 123-4567<br />Mon-Sat: 6AM - 10PM</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20">
                      <HiMail className="text-gold-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Email Us</h3>
                      <p className="mt-1 text-sm text-luxury-gray">hello@ironcore-gym.com<br />support@ironcore-gym.com</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="mb-4 font-bold text-white">Connect With Us</h3>
                  <div className="flex gap-3">
                    {[
                      { icon: FaWhatsapp, href: '#', label: 'WhatsApp' },
                      { icon: FaInstagram, href: '#', label: 'Instagram' },
                      { icon: FaFacebook, href: '#', label: 'Facebook' },
                    ].map((s) => (
                      <a key={s.label} href={s.href} className="flex h-12 w-12 items-center justify-center rounded-xl bg-glass-light text-luxury-gray transition-all hover:bg-gold-500 hover:text-luxury-black">
                        <s.icon size={20} />
                      </a>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>

            <div className="mt-12 h-[400px] overflow-hidden rounded-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m8!1m3!1d387193.305935303!2d-74.259865!3d40.697149!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew+York!5e0!3m2!1sen!2sus!4v1"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                className="filter invert-[100%] hue-rotate-[180deg] saturate-0 opacity-80"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
