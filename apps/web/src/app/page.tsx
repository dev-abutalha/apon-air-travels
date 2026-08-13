import { HeroSection } from '@/features/hero';
import { ServicesSection } from '@/features/services';
import { CountriesSection } from '@/features/countries';
import { TestimonialsSection } from '@/features/testimonials';
import { GallerySection } from '@/features/gallery';
import { FAQSection } from '@/features/faq';
import { ContactSection } from '@/features/contact';
import { BlogSection } from '@/features/blog/blog-section';
import Link from 'next/link';
import { ArrowRight, Award, CheckCircle2, Headphones, MapPin, ShieldCheck, UsersRound } from 'lucide-react';
import {
  getServices,
  getCountries,
  getFeaturedTestimonials,
  getGalleryAlbums,
  getFaqs,
  getFeaturedBlogPosts,
  getSettings,
} from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [services, countries, testimonials, albums, faqs, posts, settings] = await Promise.all([
    getServices(),
    getCountries(),
    getFeaturedTestimonials(),
    getGalleryAlbums(),
    getFaqs(),
    getFeaturedBlogPosts(),
    getSettings(),
  ]);

  return (
    <>
      <HeroSection />
      <section className="relative z-20 -mt-8 px-4"><div className="site-container soft-card grid grid-cols-2 rounded-3xl p-5 md:grid-cols-4 md:p-7">
        {[
          { icon: Award, value: `${settings.statistics?.yearsOfExperience || 10}+`, label: 'Years Experience' },
          { icon: MapPin, value: `${settings.statistics?.countries || 40}+`, label: 'Countries Covered' },
          { icon: UsersRound, value: `${settings.statistics?.clients || 5000}+`, label: 'Clients Assisted' },
          { icon: ShieldCheck, value: `${settings.statistics?.successRate || 98}%`, label: 'Success Guidance' },
        ].map(({ icon: Icon, value, label }) => <div key={label} className="flex items-center gap-3 border-slate-100 px-3 py-2 even:border-l md:justify-center"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf5ff] text-[#0753a2]"><Icon className="h-5 w-5" /></span><span><b className="block text-2xl leading-none text-[#063d7a] md:text-3xl">{value}</b><span className="mt-1 block text-xs font-semibold text-slate-600 md:text-sm">{label}</span></span></div>)}
      </div></section>
      <section className="py-16"><div className="site-container grid items-center gap-10 lg:grid-cols-2"><div><p className="eyebrow">About us</p><h2 className="section-title mt-1">Making Your <em>Travel</em><br />Dreams Come True</h2><p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">{settings.aboutText || 'We provide trusted visa consultation and travel guidance for individuals, families and businesses.'}</p><div className="mt-5 grid gap-2 text-sm text-slate-700">{(settings.whyChooseUs || ['Expert Visa Consultation', 'Updated Information', 'Personalized Guidance', '100% Client Satisfaction']).slice(0, 4).map((item: string) => <span key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0753a2]" /> {item}</span>)}</div><Link href="/about" className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#063d7a] px-5 py-3 text-xs font-bold text-white">Learn More About Us <ArrowRight className="h-4 w-4" /></Link></div><div className="relative min-h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-[#d8e7ef] via-[#f7e6cc] to-[#927860] shadow-xl">{albums[0]?.coverImage?.url ? <img src={albums[0].coverImage.url} alt={albums[0].title} className="absolute inset-0 h-full w-full object-cover" /> : settings.logo?.url ? <img src={settings.logo.url} alt="Apon Air Travels" className="absolute inset-0 m-auto h-36 w-auto object-contain opacity-90" /> : <div className="absolute inset-0 grid place-items-center text-center text-[#063d7a]"><span className="text-5xl">✈</span><b className="mt-3 text-xl">Apon Air Travels</b><small>Visa & Travel Consultancy</small></div>}</div></div></section>
      <ServicesSection services={services} />
      <CountriesSection countries={countries} />
      <section className="bg-[#f5f8fc] py-14"><div className="site-container grid gap-10 lg:grid-cols-2"><div><p className="eyebrow">Why choose us</p><h2 className="section-title">Why Thousands<br />Choose <em>Apon Air Travels</em></h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{(settings.whyChooseUs || []).slice(0, 4).map((item: string, index: number) => <div key={item} className="soft-card flex gap-3 rounded-lg p-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf5ff] text-[#0753a2]">{index === 1 ? <Headphones className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}</span><p className="text-xs leading-5 text-slate-600">{item}</p></div>)}</div></div><div className="brand-gradient flex min-h-72 items-center justify-center rounded-2xl p-8 text-center text-white"><div><UsersRound className="mx-auto h-12 w-12 text-yellow-300" /><h3 className="mt-4 text-2xl font-bold">A team that cares about your journey</h3><p className="mt-3 text-sm leading-6 text-blue-100">From first consultation through to your destination, we make every step clear and confident.</p><Link href="/contact" className="mt-6 inline-flex rounded-md bg-[#f5bc00] px-5 py-3 text-xs font-bold text-[#10203b]">Talk to an expert</Link></div></div></div></section>
      <section className="py-14"><div className="site-container"><p className="eyebrow">Our process</p><h2 className="section-title">Simple Steps to Get <em>Your Visa</em></h2><div className="mt-8 grid gap-5 md:grid-cols-4">{['Choose Your Destination','Check Requirements','Consult With Us','Submit & Relax'].map((title, i) => <div key={title} className="relative flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf5ff] text-xl font-bold text-[#0753a2]">{i + 1}</span><div><b className="text-sm">{title}</b><p className="mt-1 text-xs leading-5 text-slate-500">{i === 0 ? 'Select the country you want to visit.' : i === 1 ? 'Review the visa requirements and prepare documents.' : i === 2 ? 'Get professional consultation and guidance.' : 'We will help you through the process.'}</p></div></div>)}</div></div></section>
      <TestimonialsSection testimonials={testimonials} />
      <GallerySection albums={albums} />
      <BlogSection posts={posts} />
      <FAQSection faqs={faqs} />
      <ContactSection phone={settings.contactPhone} email={settings.contactEmail} />
    </>
  );
}
