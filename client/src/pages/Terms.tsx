import { useEffect } from 'react';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';

export default function Terms() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  return (
    <PageTransition>
      <Navbar />
      <main className="pt-32 py-32">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-display-sm font-bold mb-8">Terms of <span className="gradient-text">Service</span></h1>
          <GlassCard className="p-8 md:p-12">
            <div className="prose prose-invert max-w-none text-luxury-gray space-y-6">
              <p>Last updated: January 2026</p>
              <h3 className="text-white font-bold">1. Membership</h3>
              <p>Membership is subject to monthly or yearly fees as agreed upon signup. Cancellation policies apply.</p>
              <h3 className="text-white font-bold">2. Gym Rules</h3>
              <p>Members must follow all gym rules and guidelines. Proper attire and behavior are required at all times.</p>
              <h3 className="text-white font-bold">3. Liability</h3>
              <p>Members participate in activities at their own risk. Ash2 Fitness is not liable for injuries sustained on premises.</p>
              <h3 className="text-white font-bold">4. Termination</h3>
              <p>We reserve the right to terminate memberships for violating terms or rules.</p>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
