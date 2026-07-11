import PageTransition from '@components/ui/PageTransition';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';

// TODO: Implement full careers page with job listings API when backend is ready.
export default function Careers() {
  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
        <div className="relative text-center px-6">
          <h1 className="text-display-sm font-bold">
            Careers <span className="gradient-text">Coming Soon</span>
          </h1>
          <p className="mt-4 text-lg text-luxury-gray">
            We're building something great. Check back soon for open positions.
          </p>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
