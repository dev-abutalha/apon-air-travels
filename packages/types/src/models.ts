import type { SEO, MediaItem, Button, Address, SocialLinks, WorkingHours } from './shared';

export interface Country {
  _id: string;
  name: string;
  slug: string;
  flag?: MediaItem;
  heroImage?: MediaItem;
  description: string;
  overview: string;
  processingTime?: string;
  fee?: string;
  embassyInfo?: string;
  seo: SEO;
  requirements: { title: string; items: string[] }[];
  visaTypes: string[];
  faq: FAQItem[];
  relatedBlogs: string[];
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface VisaType {
  _id: string;
  countryId: string;
  title: string;
  slug: string;
  description: string;
  documents: string[];
  eligibility: string[];
  fees: string;
  duration: string;
  processingTime: string;
  faq: FAQItem[];
  seo: SEO;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  image?: MediaItem;
  features: string[];
  cta?: Button;
  seo: SEO;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: MediaItem;
  author: string;
  category: string;
  tags: string[];
  readingTime: number;
  published: boolean;
  featured: boolean;
  seo: SEO;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  country?: string;
  photo?: MediaItem;
  rating: number;
  comment: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQItem {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}

export interface GalleryAlbum {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: MediaItem;
  images: MediaItem[];
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlide {
  _id: string;
  title: string;
  subtitle?: string;
  backgroundImage: MediaItem;
  buttons: Button[];
  highlights: string[];
  published: boolean;
  order: number;
}

export interface Office {
  _id: string;
  branch: string;
  address: Address;
  phone: string;
  email: string;
  mapEmbedUrl?: string;
  images: MediaItem[];
  workingHours: WorkingHours[];
  isHeadOffice: boolean;
  published: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  order: number;
  children?: Array<{ label: string; href: string }>;
}

export interface SiteSettings {
  _id: string;
  siteName: string;
  tagline: string;
  logo: MediaItem;
  favicon: MediaItem;
  socialLinks: SocialLinks;
  contactEmail: string;
  contactPhone: string;
  address: Address;
  statistics: {
    yearsOfExperience: number;
    countries: number;
    clients: number;
    successRate: number;
  };
  whyChooseUs: string[];
  aboutText: string;
  footerText: string;
  navigation: NavigationItem[];
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  country?: string;
  visaType?: string;
  type: 'general' | 'visa-enquiry' | 'newsletter';
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'content-writer' | 'seo-manager';
  avatar?: MediaItem;
  active: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}
