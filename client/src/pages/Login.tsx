import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import AuthForm from '@components/forms/AuthForm';
import { useAuth } from '@context/AuthContext';
import { setNavigate } from '@utils/navigation';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: { theme: string; size: string; width?: string }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function Login() {
  const { login, googleLogin, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const googleInitialized = useRef(false);

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'trainer') navigate('/trainer/dashboard');
      else navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!googleInitialized.current && window.google && googleClientId) {
      googleInitialized.current = true;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          setIsLoggingIn(true);
          try {
            const googleUser = await googleLogin({ credential: response.credential });
            if (googleUser.role === 'admin') navigate('/admin');
            else if (googleUser.role === 'trainer') navigate('/trainer/dashboard');
            else navigate('/dashboard');
          } catch (err: any) {
            setIsLoggingIn(false);
            setError(err?.response?.data?.message || err?.message || 'Google login failed. Check that the backend is running.');
          }
        },
      });
    }
  }, [googleLogin, navigate, googleClientId]);

  const handleLogin = async (data: { email: string; password: string; remember?: boolean }) => {
    setIsLoggingIn(true);
    try {
      const user = await login(data.email, data.password, data.remember);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'trainer') navigate('/trainer/dashboard');
      else navigate('/dashboard');
    } catch (err: any) {
      setIsLoggingIn(false);
      if (err?.response?.status === 403) {
        navigate('/trainer/pending');
        return;
      }
      throw err;
    }
  };

  return (
    <PageTransition>
      <div className="noise-bg" />
      {isLoggingIn && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-luxury-black/90 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
          <p className="mt-4 text-sm tracking-widest text-gold-500 uppercase">Signing in...</p>
        </div>
      )}
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
        <div className="relative w-full max-w-md px-6 py-16">
          <div className="mb-8 text-center">
            <h1 className="text-display-sm font-bold">
              Welcome <span className="gradient-text">Back</span>
            </h1>
            <p className="mt-2 text-luxury-gray">Sign in to continue your fitness journey.</p>
          </div>
          <GlassCard className="p-8">
            <AuthForm mode="login" onSubmit={handleLogin} />
            {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}
            {googleClientId && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-glass-light" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-luxury-charcoal px-4 text-luxury-gray">or continue with</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.google?.accounts.id.prompt()}
                  className="flex w-full items-center justify-center rounded-full border-2 border-gold-500 bg-black px-5 py-3 transition-all hover:bg-gold-500/10"
                >
                  <span className="text-base font-bold text-white">G</span>
                </button>
              </>
            )}
            <div className="mt-6 text-center text-sm text-luxury-gray">
              <Link to="/forgot-password" className="text-gold-500 hover:text-gold-400">Forgot password?</Link>
            </div>
            <div className="mt-4 text-center text-sm text-luxury-gray">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold-500 hover:text-gold-400">Sign up</Link>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
