import { lazy } from 'react';

export const Home = lazy(() => import('@pages/Home'));
export const About = lazy(() => import('@pages/About'));
export const Programs = lazy(() => import('@pages/Programs'));
export const ProgramDetail = lazy(() => import('@pages/ProgramDetail'));
export const Trainers = lazy(() => import('@pages/Trainers'));
export const TrainerDetail = lazy(() => import('@pages/TrainerDetail'));
export const Membership = lazy(() => import('@pages/Membership'));
export const Pricing = lazy(() => import('@pages/Pricing'));
export const Gallery = lazy(() => import('@pages/Gallery'));
export const Shop = lazy(() => import('@pages/Shop'));
export const Blog = lazy(() => import('@pages/Blog'));
export const BlogDetail = lazy(() => import('@pages/BlogDetail'));
export const FAQ = lazy(() => import('@pages/FAQ'));
export const Contact = lazy(() => import('@pages/Contact'));
export const Dashboard = lazy(() => import('@pages/Dashboard'));
export const AdminDashboard = lazy(() => import('@pages/AdminDashboard'));
export const BMI = lazy(() => import('@pages/BMI'));
export const Checkout = lazy(() => import('@pages/Checkout'));
export const Privacy = lazy(() => import('@pages/Privacy'));
export const Terms = lazy(() => import('@pages/Terms'));
export const NotFound = lazy(() => import('@pages/NotFound'));
export const Login = lazy(() => import('@pages/Login'));
export const Register = lazy(() => import('@pages/Register'));
export const ForgotPassword = lazy(() => import('@pages/ForgotPassword'));
export const ResetPassword = lazy(() => import('@pages/ResetPassword'));
export const Careers = lazy(() => import('@pages/Careers'));

export const AdminBlog = lazy(() => import('@pages/admin/AdminBlog'));
export const AdminPrograms = lazy(() => import('@pages/admin/AdminPrograms'));
export const AdminTrainers = lazy(() => import('@pages/admin/AdminTrainers'));
export const AdminMemberships = lazy(() => import('@pages/admin/AdminMemberships'));
export const AdminGallery = lazy(() => import('@pages/admin/AdminGallery'));
export const AdminProducts = lazy(() => import('@pages/admin/AdminProducts'));
export const AdminFAQ = lazy(() => import('@pages/admin/AdminFAQ'));
export const AdminContacts = lazy(() => import('@pages/admin/AdminContacts'));
export const AdminBookings = lazy(() => import('@pages/admin/AdminBookings'));
export const AdminUsers = lazy(() => import('@pages/admin/AdminUsers'));
export const TrainerDashboard = lazy(() => import('@pages/TrainerDashboard'));

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  protected?: boolean;
  admin?: boolean;
  title: string;
}

export const routes: RouteConfig[] = [
  { path: '/', component: Home, title: 'Home' },
  { path: '/about', component: About, title: 'About' },
  { path: '/programs', component: Programs, title: 'Programs' },
  { path: '/programs/:slug', component: ProgramDetail, title: 'Program Details' },
  { path: '/trainers', component: Trainers, title: 'Trainers' },
  { path: '/trainers/:id', component: TrainerDetail, title: 'Trainer Details' },
  { path: '/membership', component: Membership, title: 'Membership' },
  { path: '/pricing', component: Pricing, title: 'Pricing' },
  { path: '/gallery', component: Gallery, title: 'Gallery' },
  { path: '/shop', component: Shop, title: 'Shop' },
  { path: '/blog', component: Blog, title: 'Blog' },
  { path: '/blog/:slug', component: BlogDetail, title: 'Blog Post' },
  { path: '/faq', component: FAQ, title: 'FAQ' },
  { path: '/contact', component: Contact, title: 'Contact' },
  { path: '/bmi', component: BMI, title: 'BMI Calculator' },
  { path: '/checkout', component: Checkout, title: 'Checkout' },
  { path: '/privacy', component: Privacy, title: 'Privacy Policy' },
  { path: '/terms', component: Terms, title: 'Terms of Service' },
  { path: '/login', component: Login, title: 'Sign In' },
  { path: '/register', component: Register, title: 'Sign Up' },
  { path: '/forgot-password', component: ForgotPassword, title: 'Forgot Password' },
  { path: '/reset-password/:token', component: ResetPassword, title: 'Reset Password' },
  { path: '/careers', component: Careers, title: 'Careers' },
  { path: '/dashboard', component: Dashboard, title: 'Dashboard', protected: true },
  { path: '/trainer/dashboard', component: TrainerDashboard, title: 'Trainer Dashboard', protected: true },
  { path: '/admin', component: AdminDashboard, title: 'Admin Dashboard', admin: true },
  { path: '/admin/blog', component: AdminBlog, title: 'Admin Blog', admin: true },
  { path: '/admin/programs', component: AdminPrograms, title: 'Admin Programs', admin: true },
  { path: '/admin/trainers', component: AdminTrainers, title: 'Admin Trainers', admin: true },
  { path: '/admin/memberships', component: AdminMemberships, title: 'Admin Memberships', admin: true },
  { path: '/admin/gallery', component: AdminGallery, title: 'Admin Gallery', admin: true },
  { path: '/admin/products', component: AdminProducts, title: 'Admin Products', admin: true },
  { path: '/admin/faq', component: AdminFAQ, title: 'Admin FAQ', admin: true },
  { path: '/admin/contacts', component: AdminContacts, title: 'Admin Contacts', admin: true },
  { path: '/admin/bookings', component: AdminBookings, title: 'Admin Bookings', admin: true },
  { path: '/admin/users', component: AdminUsers, title: 'Admin Users', admin: true },
  { path: '*', component: NotFound, title: 'Not Found' },
];
