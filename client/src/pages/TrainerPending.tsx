import { Link } from 'react-router-dom';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import { HiStar, HiMail } from 'react-icons/hi';

export default function TrainerPending() {
  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
        <div className="relative w-full max-w-lg px-6 py-16">
          <GlassCard className="p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
              <HiStar className="text-blue-500" size={32} />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-white">Account Pending Approval</h1>
            <p className="mt-3 text-luxury-gray">
              Your trainer application has been submitted successfully. An administrator will review your
              application details and approve it shortly. You will be notified via email once a decision is made.
            </p>
            <div className="mt-6 rounded-xl bg-luxury-dark p-4">
              <div className="flex items-center gap-3 text-sm text-luxury-gray">
                <HiMail size={18} className="text-gold-500 shrink-0" />
                <span>
                  A confirmation email will be sent to your email address once your application is approved or rejected.
                  If you have any questions, please contact the gym administration.
                </span>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                to="/login"
                className="rounded-full bg-gold-500 py-3.5 text-sm font-bold uppercase tracking-wider text-luxury-black transition-all hover:bg-gold-400"
              >
                Back to Login
              </Link>
              <Link
                to="/"
                className="rounded-full border border-glass-light py-3.5 text-sm font-medium text-luxury-gray transition-all hover:bg-glass-light hover:text-white"
              >
                Return Home
              </Link>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
