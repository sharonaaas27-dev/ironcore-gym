import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';

export default function BMI() {
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bmi, setBmi] = useState(0);
  const [category, setCategory] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const heightM = height / 100;
    const calculated = weight / (heightM * heightM);
    setBmi(parseFloat(calculated.toFixed(1)));

    let cat = '';
    let recs: string[] = [];

    if (calculated < 18.5) {
      cat = 'Underweight';
      recs = [
        'Focus on nutrient-dense foods',
        'Increase protein intake',
        'Strength training to build muscle',
        'Consult with a nutritionist',
      ];
    } else if (calculated < 25) {
      cat = 'Normal';
      recs = [
        'Maintain balanced diet',
        'Regular exercise routine',
        'Stay hydrated',
        'Get adequate sleep',
      ];
    } else if (calculated < 30) {
      cat = 'Overweight';
      recs = [
        'Calorie-controlled diet',
        'Increase cardio exercise',
        'HIIT training for fat loss',
        'Track daily food intake',
      ];
    } else {
      cat = 'Obese';
      recs = [
        'Consult with healthcare provider',
        'Structured weight loss program',
        'Low-impact cardio exercises',
        'Professional nutrition plan',
      ];
    }

    setCategory(cat);
    setRecommendations(recs);
  }, [height, weight]);

  const getBMIColor = () => {
    if (bmi < 18.5) return 'text-blue-400';
    if (bmi < 25) return 'text-green-400';
    if (bmi < 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="pt-32">
        <section className="relative min-h-screen py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <h1 className="text-display-sm md:text-display-md font-bold">
                BMI <span className="gradient-text">Calculator</span>
              </h1>
              <p className="mt-4 text-lg text-luxury-gray">
                Calculate your Body Mass Index and get personalized recommendations.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              <GlassCard className="p-8">
                <h2 className="mb-8 text-2xl font-bold text-white">Your Measurements</h2>

                <div className="space-y-8">
                  <div>
                    <div className="mb-2 flex justify-between">
                      <label className="text-sm text-luxury-gray">Height (cm)</label>
                      <span className="text-sm font-semibold text-gold-500">{height} cm</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="250"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full accent-gold-500"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between">
                      <label className="text-sm text-luxury-gray">Weight (kg)</label>
                      <span className="text-sm font-semibold text-gold-500">{weight} kg</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="200"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full accent-gold-500"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-sm text-luxury-gray">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-20 rounded-xl bg-luxury-dark px-4 py-2 text-center text-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setGender('male')}
                        className={`rounded-xl px-6 py-2 text-sm font-semibold transition-colors ${gender === 'male' ? 'bg-gold-500 text-luxury-black' : 'bg-luxury-dark text-luxury-gray'}`}
                      >
                        Male
                      </button>
                      <button
                        onClick={() => setGender('female')}
                        className={`rounded-xl px-6 py-2 text-sm font-semibold transition-colors ${gender === 'female' ? 'bg-gold-500 text-luxury-black' : 'bg-luxury-dark text-luxury-gray'}`}
                      >
                        Female
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-8">
                <h2 className="mb-8 text-2xl font-bold text-white">Your Results</h2>

                <div className="flex items-center justify-center">
                  <div className="relative h-48 w-48">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a1a" strokeWidth="8" />
                      <motion.circle
                        cx="50" cy="50" r="45" fill="none" stroke="#d4a017" strokeWidth="8"
                        strokeDasharray={`${(bmi / 40) * 283} 283`}
                        strokeLinecap="round"
                        animate={{ strokeDasharray: `${(bmi / 40) * 283} 283` }}
                        transition={{ duration: 0.8 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-5xl font-bold ${getBMIColor()}`}>{bmi}</span>
                      <span className="mt-1 text-sm text-luxury-gray">BMI</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <span className={`inline-block rounded-full px-6 py-2 text-sm font-bold ${
                    category === 'Normal' ? 'bg-green-500/20 text-green-400' :
                    category === 'Underweight' ? 'bg-blue-500/20 text-blue-400' :
                    category === 'Overweight' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {category}
                  </span>
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-bold text-white">Recommendations</h3>
                  <ul className="space-y-3">
                    {recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-luxury-gray">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
