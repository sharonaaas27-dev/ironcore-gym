import { useEffect } from 'react';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';

export default function Privacy() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-32 py-32">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-display-sm font-bold mb-8">Privacy <span className="gradient-text">Policy</span></h1>
          <GlassCard className="p-8 md:p-12">
            <div className="prose prose-invert max-w-none text-luxury-gray space-y-6">
              <p>Last updated: January 2026</p>
              <h3 className="text-white font-bold">1. Information We Collect</h3>
              <p>We collect information you provide directly, including name, email, phone, and payment details necessary for membership processing.</p>
              <h3 className="text-white font-bold">2. How We Use Your Information</h3>
              <p>Your information is used to manage your membership, process payments, send updates, and improve our services.</p>
              <h3 className="text-white font-bold">3. Data Protection</h3>
              <p>We implement industry-standard security measures to protect your personal information against unauthorized access.</p>
              <h3 className="text-white font-bold">4. Contact</h3>
              <p>For privacy-related inquiries, contact us at info@ash2fitness.com</p>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
