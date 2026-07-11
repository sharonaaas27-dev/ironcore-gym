export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'user' | 'admin' | 'trainer';
    isApproved?: boolean;
    avatar?: string;
    membership?: Membership;
    trainer?: Trainer;
    bookings?: Booking[];
    createdAt: string;
    updatedAt: string;
}
export interface Trainer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    bio: string;
    specialties: string[];
    experience: number;
    certificates: string[];
    socialLinks: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        linkedin?: string;
    };
    rating: number;
    available: boolean;
    createdAt: string;
}
export interface Membership {
    _id: string;
    type: 'silver' | 'gold' | 'platinum';
    name: string;
    description: string;
    price: number;
    duration: 'monthly' | 'yearly';
    benefits: string[];
    features: MembershipFeature[];
    popular?: boolean;
}
export interface MembershipFeature {
    name: string;
    included: boolean;
}
export interface Booking {
    _id: string;
    user: User;
    trainer?: Trainer;
    program?: {
        _id: string;
        title: string;
        slug: string;
    };
    date?: string;
    time?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    type: 'training' | 'class';
    createdAt: string;
}
export interface Program {
    _id: string;
    title: string;
    slug: string;
    description: string;
    longDescription: string;
    category: string;
    image: string;
    video?: string;
    duration: string;
    intensity: 'beginner' | 'intermediate' | 'advanced';
    price: number;
    trainer: Trainer;
    schedule: Schedule[];
    benefits: string[];
    enrolledCount: number;
}
export interface Schedule {
    day: string;
    time: string;
    trainer: string;
}
export interface GalleryItem {
    _id: string;
    title: string;
    image: string;
    category: string;
    createdAt: string;
}
export interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: User;
    image: string;
    category: string;
    tags: string[];
    readTime: number;
    publishedAt: string;
    createdAt: string;
}
export interface Payment {
    _id: string;
    user: User;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    method: string;
    membership?: Membership;
    booking?: Booking;
    createdAt: string;
}
export interface Testimonial {
    _id: string;
    user: User;
    content: string;
    rating: number;
    transformation?: {
        before: string;
        after: string;
    };
    createdAt: string;
}
export interface FAQ {
    _id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
}
export interface Notification {
    _id: string;
    user: User;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
}
export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    salePrice?: number;
    images: string[];
    category: string;
    sizes?: string[];
    colors?: string[];
    stock: number;
    featured?: boolean;
    createdAt: string;
}
export interface BMICalculation {
    height: number;
    weight: number;
    age: number;
    gender: 'male' | 'female';
    bmi: number;
    category: string;
    recommendations: string[];
    nutritionTips: string[];
}
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    count?: number;
    pagination?: {
        page: number;
        pages: number;
        total: number;
    };
}
export type SectionRef = React.RefObject<HTMLElement>;
export interface TrainerRequest {
    _id: string;
    user: User;
    trainer: Trainer;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}
export interface NavLink {
    label: string;
    href: string;
    children?: NavLink[];
}
