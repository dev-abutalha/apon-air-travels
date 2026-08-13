export interface SEO {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
  twitterCard?: string;
  schema?: Record<string, unknown>;
  breadcrumb?: BreadcrumbItem[];
  robots?: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface MediaItem {
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  format?: string;
  publicId?: string;
}

export interface Button {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  target?: '_blank' | '_self';
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  twitter?: string;
  whatsapp?: string;
}

export interface WorkingHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}
