import { HeroSlider } from './hero-slider';
import { getHeroSlides, getSettings } from '@/lib/data';

export async function HeroSection() {
  const [slides, settings] = await Promise.all([getHeroSlides(), getSettings()]);
  return <HeroSlider slides={slides} contact={{ phone: settings.contactPhone, email: settings.contactEmail, address: settings.address, whatsapp: settings.socialLinks?.whatsapp }} />;
}
