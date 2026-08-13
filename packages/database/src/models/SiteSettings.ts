import mongoose, { Schema, type Document } from 'mongoose';

export interface INavigationItem {
  label: string;
  href: string;
  order: number;
  children?: Array<{ label: string; href: string }>;
}

export interface ISiteSettings extends Document {
  siteName: string;
  tagline: string;
  logo: { url: string; alt?: string; publicId?: string };
  darkBackgroundLogo: { url: string; alt?: string; publicId?: string };
  favicon: { url: string; publicId?: string };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
    whatsapp?: string;
  };
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  statistics: {
    yearsOfExperience: number;
    countries: number;
    clients: number;
    successRate: number;
  };
  whyChooseUs: string[];
  aboutText: string;
  footerText: string;
  navigation: INavigationItem[];
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: 'Apon Air Travels' },
    tagline: { type: String, default: 'Your Trusted Travel Partner' },
    logo: {
      url: String,
      alt: String,
      publicId: String,
    },
    darkBackgroundLogo: {
      url: String,
      alt: String,
      publicId: String,
    },
    favicon: {
      url: String,
      publicId: String,
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      linkedin: String,
      youtube: String,
      twitter: String,
      whatsapp: String,
    },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'Bangladesh' },
    },
    statistics: {
      yearsOfExperience: { type: Number, default: 0 },
      countries: { type: Number, default: 0 },
      clients: { type: Number, default: 0 },
      successRate: { type: Number, default: 0 },
    },
    whyChooseUs: [{ type: String }],
    aboutText: { type: String, default: '' },
    footerText: { type: String, default: '' },
    navigation: [
      {
        label: { type: String, required: true },
        href: { type: String, required: true },
        order: { type: Number, default: 0 },
        children: [{ label: String, href: String }],
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
