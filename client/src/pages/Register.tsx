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

export default function Register() {
  const { register, googleLogin, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const googleInitialized = useRef(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [googleRole, setGoogleRole] = useState<'user' | 'trainer'>('user');
  const [showGoogleProfile, setShowGoogleProfile] = useState(false);
  const [googleCredential, setGoogleCredential] = useState('');
  const [googleProfile, setGoogleProfile] = useState({ bio: '', specialties: [] as string[], experience: 0, phone: '' });
  const [googleError, setGoogleError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

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

  useEffect(() => {
    if (!googleInitialized.current && window.google && googleClientId) {
      googleInitialized.current = true;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (googleRole === 'trainer') {
            setGoogleCredential(response.credential);
            setShowGoogleProfile(true);
          } else {
            try {
              const googleUser = await googleLogin({ credential: response.credential, role: 'user' });
              if (googleUser.role === 'admin') navigate('/admin');
              else if (googleUser.role === 'trainer') navigate('/trainer/dashboard');
              else navigate('/dashboard');
            } catch (err: any) {
              setGoogleError(err?.response?.data?.message || err?.message || 'Google login failed. Check that the backend is running.');
            }
          }
        },
      });
    }
  }, [googleLogin, navigate, googleClientId, googleRole]);

  const handleGoogleTrainerSubmit = async () => {
    if (!googleProfile.bio || googleProfile.specialties.length === 0 || googleProfile.experience === undefined) {
      setGoogleError('Please fill in bio, specialties, and experience.');
      return;
    }
    setGoogleLoading(true);
    setGoogleError('');
    try {
      const result = await googleLogin({
        credential: googleCredential,
        role: 'trainer',
        bio: googleProfile.bio,
        specialties: googleProfile.specialties,
        experience: googleProfile.experience,
        phone: googleProfile.phone || undefined,
      });
      if (result.role === 'trainer' && !result.isApproved) {
        navigate('/trainer/pending');
      }
    } catch (err: any) {
      setGoogleError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRegister = async (data: { name?: string; email: string; password: string; role?: 'user' | 'trainer'; bio?: string; specialties?: string[]; experience?: number; phone?: string; certificates?: string[] }) => {
    const newUser = await register(data.name || 'User', data.email, data.password, data.role, data);
    if (newUser.role === 'trainer') {
      navigate('/trainer/pending');
    } else if (newUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
        <div className="relative w-full max-w-md px-6 py-16">
          <div className="mb-8 text-center">
            <h1 className="text-display-sm font-bold">
              Create Your <span className="gradient-text">Account</span>
            </h1>
            <p className="mt-2 text-luxury-gray">Start your transformation today.</p>
          </div>
          <GlassCard className="p-8">
            {showGoogleProfile ? (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white">Complete Your Trainer Profile</h2>
                <p className="text-sm text-luxury-gray">Tell us about yourself so admin can review your application.</p>

                <div>
                  <label className="mb-2 block text-sm font-medium text-luxury-gray">Bio</label>
                  <textarea
                    value={googleProfile.bio}
                    onChange={(e) => setGoogleProfile({ ...googleProfile, bio: e.target.value })}
                    required
                    rows={3}
                    className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3 px-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                    placeholder="Tell us about your experience and training philosophy..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-luxury-gray">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {['Strength Training', 'Cardio', 'Yoga', 'Pilates', 'CrossFit', 'Bodybuilding', 'Weight Loss', 'Nutrition', 'Rehabilitation'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setGoogleProfile((prev) => ({
                          ...prev,
                          specialties: prev.specialties.includes(s)
                            ? prev.specialties.filter((x) => x !== s)
                            : [...prev.specialties, s],
                        }))}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                          googleProfile.specialties.includes(s)
                            ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                            : 'border-glass-light bg-luxury-charcoal/50 text-luxury-gray hover:border-gold-500/50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-luxury-gray">Experience (Years)</label>
                    <input
                      type="number"
                      value={googleProfile.experience || ''}
                      onChange={(e) => setGoogleProfile({ ...googleProfile, experience: parseInt(e.target.value) || 0 })}
                      min={0}
                      max={70}
                      required
                      className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 px-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-luxury-gray">Phone</label>
                    <input
                      type="tel"
                      value={googleProfile.phone}
                      onChange={(e) => setGoogleProfile({ ...googleProfile, phone: e.target.value })}
                      className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 px-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                {googleError && <p className="text-sm text-red-500">{googleError}</p>}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowGoogleProfile(false)}
                    className="flex-1 rounded-full border border-glass-light py-3.5 text-sm font-medium text-luxury-gray transition-all hover:bg-glass-light hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGoogleTrainerSubmit}
                    disabled={googleLoading}
                    className="flex-1 rounded-full bg-gold-500 py-3.5 text-sm font-bold uppercase tracking-wider text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50"
                  >
                    {googleLoading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <AuthForm mode="register" onSubmit={handleRegister} />
                {googleClientId && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-glass-light" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-luxury-charcoal px-4 text-luxury-gray">or sign up with</span>
                      </div>
                    </div>
                    <div className="mb-3 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setGoogleRole('user')}
                        className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
                          googleRole === 'user'
                            ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                            : 'border-glass-light bg-luxury-charcoal/50 text-luxury-gray hover:border-gold-500/50'
                        }`}
                      >
                        Member
                      </button>
                      <button
                        type="button"
                        onClick={() => setGoogleRole('trainer')}
                        className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
                          googleRole === 'trainer'
                            ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                            : 'border-glass-light bg-luxury-charcoal/50 text-luxury-gray hover:border-blue-500/50'
                        }`}
                      >
                        Trainer
                      </button>
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
              </>
            )}
            <div className="mt-6 text-center text-sm text-luxury-gray">
              Already have an account?{' '}
              <Link to="/login" className="text-gold-500 hover:text-gold-400">Sign in</Link>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}