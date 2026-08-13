import { connectDB } from '@apon-air/database';
import {
  SiteSettings,
  Service,
  Country,
  VisaType,
  BlogPost,
  FAQ,
  Testimonial,
  GalleryAlbum,
  HeroSlide,
  Office,
  Page,
} from '@apon-air/database';

const serialize = <T,>(value: T): any => JSON.parse(JSON.stringify(value));

export const DEFAULT_NAV = [
  { label: 'Home', href: '/', order: 0 },
  { label: 'About', href: '/about', order: 1 },
  { label: 'Services', href: '/services', order: 2 },
  { label: 'Countries', href: '/countries', order: 3 },
  { label: 'Blog', href: '/blog', order: 4 },
  { label: 'Gallery', href: '/gallery', order: 5 },
  { label: 'FAQ', href: '/faq', order: 6 },
  { label: 'Contact', href: '/contact', order: 7 },
];

export async function getSettings() {
  await connectDB();
  const settings: any = await SiteSettings.findOne().lean();
  return serialize({
    siteName: settings?.siteName || 'Apon Air Travels',
    tagline: settings?.tagline || 'Your Trusted Travel Partner',
    footerText: settings?.footerText || '',
    aboutText: settings?.aboutText || '',
    logo: settings?.logo || null,
    darkBackgroundLogo: settings?.darkBackgroundLogo || null,
    socialLinks: settings?.socialLinks || {},
    contactEmail: settings?.contactEmail || '',
    contactPhone: settings?.contactPhone || '',
    address: settings?.address || {},
    statistics: settings?.statistics || {},
    whyChooseUs: settings?.whyChooseUs || [],
    navigation: (settings?.navigation?.length ? settings.navigation : DEFAULT_NAV).sort(
      (a: { order: number }, b: { order: number }) => a.order - b.order,
    ),
  });
}

export async function getServices() {
  await connectDB();
  return serialize(await Service.find({ published: true }).sort({ order: 1 }).lean());
}

export async function getServiceBySlug(slug: string) {
  await connectDB();
  return serialize(await Service.findOne({ slug, published: true }).lean());
}

export async function getCountries() {
  await connectDB();
  return serialize(await Country.find({ published: true }).sort({ order: 1 }).lean());
}

export async function getCountryBySlug(slug: string) {
  await connectDB();
  const country: any = await Country.findOne({ slug, published: true })
    .populate({ path: 'faq', options: { sort: { order: 1 } } })
    .lean();
  if (!country) return null;
  const visaTypes = await VisaType.find({ countryId: country._id, published: true })
    .sort({ order: 1 })
    .lean();
  return serialize({ ...country, visaTypes });
}

export async function getVisaTypes() {
  await connectDB();
  return serialize(await VisaType.find({ published: true }).populate('countryId').sort({ order: 1 }).lean());
}

export async function getBlogPosts() {
  await connectDB();
  return serialize(await BlogPost.find({ published: true }).sort({ publishedAt: -1 }).lean());
}

export async function getFeaturedBlogPosts(limit = 3) {
  await connectDB();
  return serialize(await BlogPost.find({ published: true }).sort({ publishedAt: -1 }).limit(limit).lean());
}

export async function getBlogPostBySlug(slug: string) {
  await connectDB();
  return serialize(await BlogPost.findOne({ slug, published: true }).lean());
}

export async function getFaqs() {
  await connectDB();
  return serialize(await FAQ.find({ published: true }).sort({ order: 1 }).lean());
}

export async function getTestimonials() {
  await connectDB();
  return serialize(await Testimonial.find({ published: true }).sort({ order: 1 }).lean());
}

export async function getFeaturedTestimonials(limit = 3) {
  await connectDB();
  return serialize(
    await Testimonial.find({ published: true, featured: true }).sort({ order: 1 }).limit(limit).lean(),
  );
}

export async function getGalleryAlbums() {
  await connectDB();
  return serialize(await GalleryAlbum.find({ published: true }).sort({ order: 1 }).lean());
}

export async function getGalleryAlbumBySlug(slug: string) {
  await connectDB();
  return serialize(await GalleryAlbum.findOne({ slug, published: true }).lean());
}

export async function getHeroSlides() {
  await connectDB();
  return serialize(await HeroSlide.find({ published: true }).sort({ order: 1 }).lean());
}

export async function getOffices() {
  await connectDB();
  return serialize(await Office.find({ published: true }).sort({ isHeadOffice: -1 }).lean());
}

export async function getPageBySlug(slug: string) {
  await connectDB();
  return serialize(await Page.findOne({ slug, published: true }).lean());
}
