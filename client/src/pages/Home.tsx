import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import Navbar from '@components/navbar/Navbar';
import Hero from '@sections/Hero';
import About from '@sections/About';
import Programs from '@sections/Programs';
import Trainers from '@sections/Trainers';
import Testimonials from '@sections/Testimonials';
import Membership from '@sections/Membership';
import Gallery from '@sections/Gallery';
import CTA from '@sections/CTA';
import Footer from '@components/layout/Footer';

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="noise-bg" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Programs />
        <Trainers />
        <Testimonials />
        <Membership />
        <Gallery />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
