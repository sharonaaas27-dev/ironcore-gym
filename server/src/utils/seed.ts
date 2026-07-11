import mongoose from 'mongoose';
import { config } from '../config';
import User from '../models/User';
import Membership from '../models/Membership';
import Trainer from '../models/Trainer';
import Program from '../models/Program';
import FAQ from '../models/FAQ';
import Gallery from '../models/Gallery';
import Blog from '../models/Blog';
import Product from '../models/Product';
import Testimonial from '../models/Testimonial';

async function seed() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB');

  const cleanups = [
    User.deleteMany({}),
    Membership.deleteMany({}),
    Trainer.deleteMany({}),
    Program.deleteMany({}),
    FAQ.deleteMany({}),
    Gallery.deleteMany({}),
    Blog.deleteMany({}),
    Product.deleteMany({}),
    Testimonial.deleteMany({}),
  ];
  await Promise.allSettled(cleanups);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@ironcore.com',
    password: 'admin123',
    role: 'admin',
  });

  const member = await User.create({
    name: 'John Member',
    email: 'john@example.com',
    password: 'member123',
    role: 'user',
  });

  const trainerUser = await User.create({
    name: 'Alexander Stone',
    email: 'alexander@ironcore.com',
    password: 'trainer123',
    role: 'trainer',
    isApproved: true,
  });

  await Trainer.create({
    name: trainerUser.name,
    email: trainerUser.email,
    phone: '555-0101',
    avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80',
    bio: 'Head Coach & Strength Specialist. Certified NSCA and ISSA professional with over 12 years of experience.',
    experience: 12,
    specialties: ['Strength', 'Powerlifting', 'Bodybuilding'],
    available: true,
    rating: 5.0,
    socialLinks: { instagram: '#', linkedin: '#' },
    userId: trainerUser._id,
  });

  await Membership.create([
    { type: 'silver', name: 'Silver', description: 'Essential access to our premium facilities', price: 49, duration: 'monthly', benefits: ['Gym access (6am-10pm)', 'Basic equipment', 'Locker room access', '1 group class/week', 'Fitness assessment'], features: [{ name: 'Gym Access', included: true }, { name: 'Cardio Equipment', included: true }, { name: 'Strength Machines', included: true }, { name: 'Locker Room', included: true }, { name: 'Group Classes', included: false }, { name: 'Personal Training', included: false }, { name: 'Sauna Access', included: false }, { name: 'Nutrition Plan', included: false }] },
    { type: 'silver', name: 'Silver', description: 'Essential access to our premium facilities', price: 490, duration: 'yearly', popular: false, benefits: ['Gym access (6am-10pm)', 'Basic equipment', 'Locker room access', '1 group class/week', 'Fitness assessment'], features: [{ name: 'Gym Access', included: true }, { name: 'Cardio Equipment', included: true }, { name: 'Strength Machines', included: true }, { name: 'Locker Room', included: true }, { name: 'Group Classes', included: false }, { name: 'Personal Training', included: false }, { name: 'Sauna Access', included: false }, { name: 'Nutrition Plan', included: false }] },
    { type: 'gold', name: 'Gold', description: 'Full access with group classes and perks', price: 89, duration: 'monthly', popular: true, benefits: ['24/7 gym access', 'All equipment & zones', 'Locker room & sauna', 'Unlimited group classes', '2 PT sessions/month', 'Nutrition plan', 'Guest pass (2x/month)'], features: [{ name: 'Gym Access', included: true }, { name: 'Cardio Equipment', included: true }, { name: 'Strength Machines', included: true }, { name: 'Locker Room', included: true }, { name: 'Unlimited Group Classes', included: true }, { name: '2 PT Sessions/Month', included: true }, { name: 'Sauna Access', included: true }, { name: 'Nutrition Plan', included: false }] },
    { type: 'gold', name: 'Gold', description: 'Full access with group classes and perks', price: 890, duration: 'yearly', popular: true, benefits: ['24/7 gym access', 'All equipment & zones', 'Locker room & sauna', 'Unlimited group classes', '2 PT sessions/month', 'Nutrition plan', 'Guest pass (2x/month)'], features: [{ name: 'Gym Access', included: true }, { name: 'Cardio Equipment', included: true }, { name: 'Strength Machines', included: true }, { name: 'Locker Room', included: true }, { name: 'Unlimited Group Classes', included: true }, { name: '2 PT Sessions/Month', included: true }, { name: 'Sauna Access', included: true }, { name: 'Nutrition Plan', included: false }] },
    { type: 'platinum', name: 'Platinum', description: 'The ultimate VIP experience with everything included', price: 149, duration: 'monthly', benefits: ['24/7 premium access', 'All equipment & zones', 'Locker room, sauna & steam', 'Unlimited classes & workshops', '4 PT sessions/month', 'Custom nutrition & meal plan', 'Unlimited guest passes', 'Priority booking', 'Exclusive events access'], features: [{ name: 'Gym Access', included: true }, { name: 'Cardio Equipment', included: true }, { name: 'Strength Machines', included: true }, { name: 'Locker Room & Spa', included: true }, { name: 'Unlimited Classes', included: true }, { name: '4 PT Sessions/Month', included: true }, { name: 'Sauna & Steam Room', included: true }, { name: 'Custom Nutrition Plan', included: true }] },
    { type: 'platinum', name: 'Platinum', description: 'The ultimate VIP experience with everything included', price: 1490, duration: 'yearly', benefits: ['24/7 premium access', 'All equipment & zones', 'Locker room, sauna & steam', 'Unlimited classes & workshops', '4 PT sessions/month', 'Custom nutrition & meal plan', 'Unlimited guest passes', 'Priority booking', 'Exclusive events access'], features: [{ name: 'Gym Access', included: true }, { name: 'Cardio Equipment', included: true }, { name: 'Strength Machines', included: true }, { name: 'Locker Room & Spa', included: true }, { name: 'Unlimited Classes', included: true }, { name: '4 PT Sessions/Month', included: true }, { name: 'Sauna & Steam Room', included: true }, { name: 'Custom Nutrition Plan', included: true }] },
  ]);

  const trainers = await Trainer.create([
    { name: 'Sofia Martinez', email: 'sofia@ironcore.com', phone: '555-0102', bio: 'CrossFit & HIIT Coach specializing in high-intensity functional training and metabolic conditioning.', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80', specialties: ['CrossFit', 'HIIT', 'Functional Training'], experience: 8, rating: 4.9, socialLinks: { instagram: '#', linkedin: '#' }, available: true },
    { name: 'Marcus Johnson', email: 'marcus@ironcore.com', phone: '555-0103', bio: 'Yoga & Flexibility Expert with a focus on mobility, pilates, and mind-body connection.', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80', specialties: ['Yoga', 'Pilates', 'Mobility'], experience: 10, rating: 4.8, socialLinks: { instagram: '#', linkedin: '#' }, available: true },
    { name: 'Emily Chen', email: 'emily@ironcore.com', phone: '555-0104', bio: 'Nutrition & Wellness Coach helping members achieve their goals through science-based nutrition strategies.', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80', specialties: ['Nutrition', 'Weight Loss', 'Wellness'], experience: 7, rating: 4.7, socialLinks: { instagram: '#', linkedin: '#' }, available: true },
  ]);

  await Program.create([
    { title: 'Strength Training', slug: 'strength', description: 'Build raw power with progressive overload and compound movements.', longDescription: 'Build raw power and muscle with progressive overload techniques and compound movements. Our comprehensive program covers squats, deadlifts, bench press, and olympic lifting with expert coaching.', category: 'Strength', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', duration: '60 min', intensity: 'intermediate', price: 199, trainer: trainers[0]._id, benefits: ['Increased muscle mass', 'Improved bone density', 'Better posture', 'Enhanced metabolism'], enrolledCount: 128, schedule: [{ day: 'Monday', time: '6:00 AM', trainer: 'Alexander Stone' }, { day: 'Wednesday', time: '6:00 AM', trainer: 'Alexander Stone' }, { day: 'Friday', time: '6:00 AM', trainer: 'Alexander Stone' }] },
    { title: 'CrossFit', slug: 'crossfit', description: 'High-intensity functional movements for total fitness.', longDescription: 'CrossFit combines weightlifting, gymnastics, and cardio for full-body conditioning. Each workout is scalable for any fitness level.', category: 'HIIT', image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80', duration: '45 min', intensity: 'intermediate', price: 179, trainer: trainers[1]._id, benefits: ['Full-body conditioning', 'Improved endurance', 'Functional strength', 'Community atmosphere'], enrolledCount: 95, schedule: [{ day: 'Monday', time: '7:00 AM', trainer: 'Sofia Martinez' }, { day: 'Wednesday', time: '7:00 AM', trainer: 'Sofia Martinez' }, { day: 'Friday', time: '7:00 AM', trainer: 'Sofia Martinez' }] },
    { title: 'Yoga & Flexibility', slug: 'yoga', description: 'Enhance flexibility, balance, and inner peace through yoga.', longDescription: 'A blend of Hatha and Vinyasa yoga for all skill levels. Enhance flexibility, balance, and mental focus through guided yoga sessions.', category: 'Flexibility', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', duration: '60 min', intensity: 'beginner', price: 149, trainer: trainers[2]._id, benefits: ['Increased flexibility', 'Stress relief', 'Better balance', 'Mindfulness'], enrolledCount: 72, schedule: [{ day: 'Tuesday', time: '8:00 AM', trainer: 'Marcus Johnson' }, { day: 'Thursday', time: '8:00 AM', trainer: 'Marcus Johnson' }, { day: 'Saturday', time: '9:00 AM', trainer: 'Marcus Johnson' }] },
    { title: 'HIIT Training', slug: 'hiit', description: 'Maximum results in minimum time with intense intervals.', longDescription: 'High-intensity interval training designed to maximize calorie burn and cardiovascular fitness in minimal time.', category: 'HIIT', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', duration: '30 min', intensity: 'advanced', price: 159, trainer: trainers[1]._id, benefits: ['Rapid fat loss', 'Improved cardiovascular health', 'Time efficient', 'Afterburn effect'], enrolledCount: 110, schedule: [{ day: 'Tuesday', time: '6:30 AM', trainer: 'Sofia Martinez' }, { day: 'Thursday', time: '6:30 AM', trainer: 'Sofia Martinez' }] },
    { title: 'Weight Loss', slug: 'weight-loss', description: 'Structured programs combining cardio, strength, and nutrition.', longDescription: 'Our structured weight loss program combines cardio, strength training, and nutrition guidance for sustainable results.', category: 'Wellness', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', duration: '45 min', intensity: 'beginner', price: 199, trainer: trainers[3]._id, benefits: ['Sustainable weight loss', 'Nutrition guidance', 'Accountability', 'Long-term results'], enrolledCount: 85, schedule: [{ day: 'Monday', time: '9:00 AM', trainer: 'Emily Chen' }, { day: 'Wednesday', time: '9:00 AM', trainer: 'Emily Chen' }, { day: 'Friday', time: '9:00 AM', trainer: 'Emily Chen' }] },
    { title: 'Boxing & MMA', slug: 'boxing', description: 'Combat sports training for fitness, skill, and conditioning.', longDescription: 'Combat sports training combining boxing, kickboxing, and MMA techniques for fitness, self-defense, and conditioning.', category: 'Combat', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80', duration: '60 min', intensity: 'intermediate', price: 189, trainer: trainers[0]._id, benefits: ['Self-defense skills', 'Improved coordination', 'Cardio conditioning', 'Stress relief'], enrolledCount: 65, schedule: [{ day: 'Tuesday', time: '7:00 PM', trainer: 'Alexander Stone' }, { day: 'Thursday', time: '7:00 PM', trainer: 'Alexander Stone' }, { day: 'Saturday', time: '10:00 AM', trainer: 'Alexander Stone' }] },
  ]);

  await FAQ.create([
    { question: 'What membership options are available?', answer: 'We offer Silver, Gold, and Platinum memberships with flexible monthly and yearly billing options. Each tier provides increasing levels of access and benefits.', category: 'Membership', order: 1 },
    { question: 'Can I cancel my membership anytime?', answer: 'Yes, you can cancel your membership at any time with no cancellation fees. Yearly plans include a prorated refund.', category: 'Membership', order: 2 },
    { question: 'Is there a joining fee?', answer: 'We occasionally have promotions waiving the joining fee. Standard joining fee is $49 for Silver, waived for Gold and Platinum.', category: 'Membership', order: 3 },
    { question: 'Do I need a personal trainer?', answer: 'While not required, our trainers can help you achieve results faster with personalized programs and proper form guidance.', category: 'Training', order: 4 },
    { question: 'What should I bring to my first session?', answer: 'Comfortable workout clothes, training shoes, a water bottle, and a towel. We provide all equipment.', category: 'Training', order: 5 },
    { question: 'How do I book a training session?', answer: 'You can book through our website, mobile app, or at the front desk. Gold and Platinum members get priority booking.', category: 'Training', order: 6 },
    { question: 'What are your opening hours?', answer: 'Silver members: 6AM-10PM daily. Gold and Platinum members enjoy 24/7 access.', category: 'Facilities', order: 7 },
    { question: 'Do you have parking?', answer: 'Yes, we offer complimentary parking for all members with dedicated parking spaces.', category: 'Facilities', order: 8 },
    { question: 'Is there a sauna?', answer: 'Yes, Gold and Platinum members have access to our premium sauna and steam rooms.', category: 'Facilities', order: 9 },
    { question: 'What types of classes do you offer?', answer: 'We offer Strength Training, CrossFit, Yoga, HIIT, Boxing, Pilates, and specialized workshops.', category: 'Classes', order: 10 },
    { question: 'How do I sign up for classes?', answer: 'Classes can be booked through our app or website. Gold and Platinum members get priority access.', category: 'Classes', order: 11 },
  ]);

  await Gallery.create([
    { title: 'Gym Floor', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', category: 'Facility' },
    { title: 'Weight Training', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80', category: 'Training' },
    { title: 'CrossFit', image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80', category: 'Training' },
    { title: 'Boxing', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', category: 'Training' },
    { title: 'Cardio Zone', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', category: 'Facility' },
    { title: 'Personal Training', image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80', category: 'Training' },
    { title: 'Yoga Studio', image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80', category: 'Events' },
    { title: 'Locker Room', image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80', category: 'Facility' },
    { title: 'Group Class', image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80', category: 'Events' },
  ]);

  const blogAdmin = await User.create({ name: 'Alexander Stone', email: 'alexander.blog@ironcore.com', password: 'blog123', role: 'user' });

  await Blog.create([
    { title: 'The Science of Progressive Overload', slug: 'progressive-overload', excerpt: 'Understand how progressive overload builds muscle and strength effectively.', content: 'Progressive overload is the foundation of all muscle growth and strength development. In this comprehensive guide, we will explore how to apply this principle effectively.\n\nThe concept is simple: to get stronger and build muscle, you must gradually increase the demands placed on your body. This can be achieved by adding more weight, increasing repetitions, or reducing rest periods.\n\nResearch shows that consistent application of progressive overload leads to significant strength gains over time. The key is tracking your workouts and making small, incremental improvements each session.', author: blogAdmin._id, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', category: 'Training', tags: ['strength', 'muscle', 'workout'], readTime: 5, publishedAt: new Date('2026-06-20') },
    { title: 'Nutrition Tips for Maximum Gains', slug: 'nutrition-maximum-gains', excerpt: 'Fuel your body right with these science-backed nutrition strategies.', content: 'Nutrition plays a crucial role in achieving your fitness goals. Whether you want to build muscle, lose fat, or improve performance, what you eat matters.\n\nProtein is essential for muscle repair and growth. Aim for 1.6-2.2 grams per kilogram of body weight daily. Good sources include lean meats, eggs, dairy, and plant-based options like tofu and legumes.\n\nCarbohydrates provide energy for your workouts. Complex carbs like oats, sweet potatoes, and brown rice offer sustained energy release.', author: blogAdmin._id, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', category: 'Nutrition', tags: ['nutrition', 'diet', 'gains'], readTime: 7, publishedAt: new Date('2026-06-18') },
    { title: 'Recovery: The Missing Piece of Fitness', slug: 'recovery-fitness', excerpt: 'Why rest and recovery are just as important as your workouts.', content: 'Many people overlook recovery, but it is just as important as the workout itself. Your muscles grow and repair during rest, not during training.\n\nSleep is the most powerful recovery tool. Aim for 7-9 hours of quality sleep per night. During deep sleep, your body releases growth hormone which is essential for muscle repair.\n\nActive recovery, such as light walking or stretching, can help reduce muscle soreness and improve blood flow to recovering muscles.', author: blogAdmin._id, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', category: 'Wellness', tags: ['recovery', 'rest', 'sleep'], readTime: 4, publishedAt: new Date('2026-06-15') },
    { title: 'CrossFit vs Traditional Weightlifting', slug: 'crossfit-vs-weightlifting', excerpt: 'Compare the benefits and choose the right training style for you.', content: 'Both CrossFit and traditional weightlifting offer unique benefits, and the best choice depends on your goals and preferences.\n\nCrossFit focuses on functional movements performed at high intensity. It combines weightlifting, gymnastics, and cardio in varied workouts. This approach builds overall fitness and endurance.\n\nTraditional weightlifting emphasizes progressive overload on specific lifts like squats, deadlifts, and bench press. It is ideal for building maximum strength and muscle size.', author: blogAdmin._id, image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80', category: 'Training', tags: ['crossfit', 'weightlifting', 'comparison'], readTime: 6, publishedAt: new Date('2026-06-12') },
    { title: 'Beginner Guide to Gym Equipment', slug: 'beginner-gym-equipment', excerpt: 'Everything you need to know about using gym equipment safely and effectively.', content: 'Walking into a gym for the first time can be overwhelming. This guide covers the basic equipment you will encounter and how to use it safely.\n\nCardio machines like treadmills, stationary bikes, and ellipticals are great for warming up and improving cardiovascular health. Start with 10-15 minutes at a moderate pace.\n\nResistance machines are perfect for beginners because they guide your movement path. They target specific muscle groups and reduce the risk of improper form.', author: blogAdmin._id, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', category: 'Beginners', tags: ['beginner', 'equipment', 'guide'], readTime: 8, publishedAt: new Date('2026-06-10') },
  ]);

  await Product.create([
    { name: 'Premium Gym Tank', slug: 'premium-gym-tank', description: 'High-performance athletic tank top for intense workouts.', price: 49, images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80'], category: 'Apparel', stock: 50, sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Gray'], featured: true },
    { name: 'IRONCORE Hoodie', slug: 'ironcore-hoodie', description: 'Premium quality hoodie for post-workout comfort.', price: 89, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80'], category: 'Apparel', stock: 30, sizes: ['M', 'L', 'XL'], colors: ['Black', 'Navy'], featured: true },
    { name: 'Shaker Bottle', slug: 'shaker-bottle', description: 'Premium shaker bottle with mixing ball for protein shakes.', price: 29, images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'], category: 'Accessories', stock: 100, featured: false },
    { name: 'Gym Bag', slug: 'gym-bag', description: 'Spacious gym bag with multiple compartments.', price: 69, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80'], category: 'Accessories', stock: 25, featured: false },
    { name: 'Resistance Bands Set', slug: 'resistance-bands', description: 'Complete set of resistance bands for home and gym workouts.', price: 39, images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&q=80'], category: 'Equipment', stock: 60, featured: false },
    { name: 'Premium Yoga Mat', slug: 'premium-yoga-mat', description: 'Extra thick, non-slip yoga mat for comfort and stability.', price: 59, images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80'], category: 'Equipment', stock: 40, featured: true },
  ]);

  await Testimonial.create([
    { user: member._id, content: 'IRONCORE completely transformed my life. In just 6 months, I lost 30 pounds and gained confidence I never knew I had. The trainers here are world-class.', rating: 5, transformation: { before: '95kg', after: '75kg' } },
    { user: member._id, content: 'The best gym I have ever been to. The equipment is top-notch, the atmosphere is incredible, and the community keeps you motivated every single day.', rating: 5, transformation: { before: '78kg', after: '62kg' } },
    { user: member._id, content: 'After trying multiple gyms, IRONCORE stands out. The personalized attention and scientific approach to training makes all the difference.', rating: 5, transformation: { before: '88kg', after: '76kg' } },
  ]);

  console.log('Seed data created successfully');
  console.log(`Admin:   admin@ironcore.com / admin123`);
  console.log(`User:    john@example.com / member123`);
  console.log(`Trainer: alexander@ironcore.com / trainer123`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
