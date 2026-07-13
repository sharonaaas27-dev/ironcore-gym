import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '@components/ui/LoadingScreen';
import ScrollToTop from '@components/ui/ScrollToTop';
import PageTransition from '@components/ui/PageTransition';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import AdminRoute from '@components/admin/AdminRoute';
import ProtectedRoute from '@components/admin/ProtectedRoute';
import TrainerRoute from '@components/admin/TrainerRoute';
import AdminLayout from '@components/admin/AdminLayout';
import { setNavigate } from '@utils/navigation';

const Home = lazy(() => import('@pages/Home'));
const About = lazy(() => import('@pages/About'));
const Programs = lazy(() => import('@pages/Programs'));
const ProgramDetail = lazy(() => import('@pages/ProgramDetail'));
const Trainers = lazy(() => import('@pages/Trainers'));
const TrainerDetail = lazy(() => import('@pages/TrainerDetail'));
const Membership = lazy(() => import('@pages/Membership'));
const Gallery = lazy(() => import('@pages/Gallery'));
const Shop = lazy(() => import('@pages/Shop'));
const Blog = lazy(() => import('@pages/Blog'));
const BlogDetail = lazy(() => import('@pages/BlogDetail'));
const FAQ = lazy(() => import('@pages/FAQ'));
const Contact = lazy(() => import('@pages/Contact'));
const Dashboard = lazy(() => import('@pages/Dashboard'));
const AdminDashboard = lazy(() => import('@pages/AdminDashboard'));
const NotFound = lazy(() => import('@pages/NotFound'));
const Privacy = lazy(() => import('@pages/Privacy'));
const Terms = lazy(() => import('@pages/Terms'));
const BMI = lazy(() => import('@pages/BMI'));
const Pricing = lazy(() => import('@pages/Pricing'));
const Checkout = lazy(() => import('@pages/Checkout'));
const Login = lazy(() => import('@pages/Login'));
const Register = lazy(() => import('@pages/Register'));
const ForgotPassword = lazy(() => import('@pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@pages/ResetPassword'));
const Careers = lazy(() => import('@pages/Careers'));
const TrainerPending = lazy(() => import('@pages/TrainerPending'));
const Messages = lazy(() => import('@pages/Messages'));

const AdminBlog = lazy(() => import('@pages/admin/AdminBlog'));
const AdminPrograms = lazy(() => import('@pages/admin/AdminPrograms'));
const AdminTrainers = lazy(() => import('@pages/admin/AdminTrainers'));
const AdminMemberships = lazy(() => import('@pages/admin/AdminMemberships'));
const AdminPayments = lazy(() => import('@pages/admin/AdminPayments'));
const AdminGallery = lazy(() => import('@pages/admin/AdminGallery'));
const AdminProducts = lazy(() => import('@pages/admin/AdminProducts'));
const AdminFAQ = lazy(() => import('@pages/admin/AdminFAQ'));
const AdminContacts = lazy(() => import('@pages/admin/AdminContacts'));
const AdminBookings = lazy(() => import('@pages/admin/AdminBookings'));
const AdminEnrollments = lazy(() => import('@pages/admin/AdminEnrollments'));
const AdminUsers = lazy(() => import('@pages/admin/AdminUsers'));
const AdminTrainerRequests = lazy(() => import('@pages/admin/AdminTrainerRequests'));
const TrainerDashboard = lazy(() => import('@pages/TrainerDashboard'));

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <>
      <LoadingScreen />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:slug" element={<ProgramDetail />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/trainers/:id" element={<TrainerDetail />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/bmi" element={<BMI />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/trainer/dashboard" element={<TrainerRoute><TrainerDashboard /></TrainerRoute>} />
            <Route path="/trainer/contacts" element={<TrainerRoute><PageTransition><div className="noise-bg" /><Navbar /><main className="min-h-screen pt-32"><div className="relative mx-auto max-w-7xl px-6 py-16"><AdminContacts /></div></main><Footer /></PageTransition></TrainerRoute>} />
            <Route path="/trainer/pending" element={<TrainerPending />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="programs" element={<AdminPrograms />} />
              <Route path="trainers" element={<AdminTrainers />} />
              <Route path="memberships" element={<AdminMemberships />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="faq" element={<AdminFAQ />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="enrollments" element={<AdminEnrollments />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="trainer-requests" element={<AdminTrainerRequests />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
}
