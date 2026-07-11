import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '@components/ui/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="noise-bg" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-luxury-black px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-[12rem] font-black leading-none tracking-tighter">
            <span className="gradient-text">404</span>
          </h1>
          <p className="mt-4 text-2xl font-bold text-white">Page Not Found</p>
          <p className="mt-2 text-luxury-gray">The page you're looking for doesn't exist or has been moved.</p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 font-semibold text-luxury-black transition-all hover:bg-gold-400"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}
