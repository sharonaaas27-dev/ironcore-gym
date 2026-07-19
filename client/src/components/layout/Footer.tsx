import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { useScrollAnimation } from '@hooks/useScrollAnimation';

const footerLinks = {
  programs: [
    { label: 'Strength Training', href: '/programs/strength' },
    { label: 'CrossFit', href: '/programs/crossfit' },
    { label: 'Yoga', href: '/programs/yoga' },
    { label: 'Weight Loss', href: '/programs/weight-loss' },
    { label: 'Cardio', href: '/programs/cardio' },
    { label: 'HIIT', href: '/programs/hiit' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Team', href: '/trainers' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Membership', href: '/membership' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'BMI Calculator', href: '/bmi' },
  ],
};

const socialLinks = [
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <footer ref={ref} className="relative overflow-hidden bg-luxury-charcoal pt-20 pb-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 grid gap-12 md:grid-cols-2 lg:grid-cols-5"
        >
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold tracking-tighter">
              Ash2<span className="gradient-text">Fitness</span>
            </h2>
            <p className="mt-4 max-w-sm text-luxury-gray leading-relaxed">
              CrossFit & fitness center in Kanjiramkulam, Kerala dedicated to
              transforming lives through expert training, well-maintained
              equipment, and a supportive community.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-luxury-dark text-luxury-gray transition-all hover:border-gold-500 hover:text-gold-500"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-widest uppercase text-gold-500">
              Programs
            </h3>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-luxury-gray transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-widest uppercase text-gold-500">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-luxury-gray transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-widest uppercase text-gold-500">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-luxury-gray transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-luxury-dark pt-8 text-center"
        >
          <p className="text-sm text-luxury-gray">
            &copy; {new Date().getFullYear()} Ash2 Fitness. All rights reserved.
          </p>
          <p className="mt-2 text-[10px] text-luxury-gray/40">
            Demo Concept &mdash; Sample design for presentation. Information shown is for illustrative purposes only.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
