import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import MagneticButton from '@components/buttons/MagneticButton';
import AnimatedCounter from '@components/ui/AnimatedCounter';
import api from '@services/api';
import { useAuth } from '@context/AuthContext';

const fallbackStats = [
  { target: 5000, suffix: '+', label: 'Active Members' },
  { target: 50, suffix: '+', label: 'Expert Trainers' },
  { target: 15, suffix: '+', label: 'Years Experience' },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [stats, setStats] = useState(fallbackStats);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') return;
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/analytics');
        const data = res.data.data || res.data;
        if (data) {
          setStats([
            { target: data.totalMembers || 5000, suffix: '+', label: 'Active Members' },
            { target: data.activeMemberships || 50, suffix: '+', label: 'Programs Available' },
            { target: Math.floor((data.totalBookings || 1000) / 100) || 15, suffix: '+', label: 'Years Experience' },
          ]);
        }
      } catch {
        // fallback already set
      }
    };
    fetchStats();
  }, [user]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      if (textRef.current && !isMobile) {
        const chars = textRef.current.querySelectorAll('.char');
        gsap.from(chars, {
          y: 100,
          opacity: 0,
          rotateX: -90,
          stagger: 0.05,
          duration: 1,
          ease: 'power4.out',
        });
      }
      if (subtitleRef.current && !isMobile) {
        gsap.from(subtitleRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.8,
          ease: 'power3.out',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (containerRef.current) {
        gsap.to(containerRef.current.querySelector('.parallax-bg'), {
          x: x * 20,
          y: y * 20,
          duration: 1,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div className="parallax-bg absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/80 via-luxury-black/50 to-luxury-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,160,23,0.15),transparent_70%)]" />
        <div className="noise-overlay absolute inset-0" />
        <div className="hidden md:block absolute -left-1/4 -top-1/4 h-[600px] w-[600px] animate-blob1 rounded-full bg-gold-500/20 blur-[150px]" />
        <div className="hidden md:block absolute -right-1/4 -bottom-1/4 h-[500px] w-[500px] animate-blob2 rounded-full bg-gold-400/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-sm font-semibold tracking-[0.3em] text-gold-500 uppercase"
            >
              CrossFit & Fitness Training
            </motion.p>

            <h1
              ref={textRef}
              className="text-display-md md:text-display-lg lg:text-display-lg font-bold tracking-tighter"
            >
              {'TRAIN WITH'.split('').map((char, i) => (
                <span key={i} className="char inline-block">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
              <br />
              {'PURPOSE'.split('').map((char, i) => (
                <span key={i} className="char inline-block gradient-text">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>

            <p
              ref={subtitleRef}
              className="mt-6 max-w-xl text-lg leading-relaxed text-luxury-gray"
            >
              Transform your limits into power. Well-maintained equipment,
              expert CrossFit trainers, and a supportive community that pushes
              you beyond what you thought possible.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <MagneticButton>
                <Link
                  to="/membership"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-luxury-black transition-all"
                >
                  <span className="relative z-10">Start Your Journey</span>
                  <span className="relative z-10 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                  <div className="absolute inset-0 bg-gold-400 transition-transform duration-500 -translate-x-full group-hover:translate-x-0" />
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link
                  to="/programs"
                  className="inline-flex items-center gap-2 rounded-full border border-glass-light px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 md:backdrop-blur-sm"
                >
                  Explore Programs
                </Link>
              </MagneticButton>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-4 pt-10 md:gap-8 lg:gap-16">
              {stats.map((stat) => (
                <div key={stat.label} className="py-4 md:p-6">
                  <AnimatedCounter
                    target={stat.target}
                    suffix={stat.suffix}
                  />
                  <p className="mt-3 text-sm text-luxury-gray">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="aspect-square rounded-full bg-gradient-radial from-gold-500/30 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl font-black tracking-tighter text-white/5">
                  ASH2
                </div>
                <div className="-mt-4 text-8xl font-black tracking-tighter text-gold-500/10">
                  FITNESS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
