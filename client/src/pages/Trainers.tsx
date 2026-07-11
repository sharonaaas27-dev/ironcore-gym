import { useEffect } from 'react';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import TrainersSection from '@sections/Trainers';

export default function Trainers() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main>
        <div className="pt-32" />
        <TrainersSection />
      </main>
      <Footer />
    </PageTransition>
  );
}
