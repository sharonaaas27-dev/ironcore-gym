import { useEffect } from 'react';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import MembershipSection from '@sections/Membership';
import CTA from '@sections/CTA';

export default function Membership() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main>
        <div className="pt-32" />
        <MembershipSection />
        <CTA />
      </main>
      <Footer />
    </PageTransition>
  );
}
