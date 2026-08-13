'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, BadgeCheck, GraduationCap, BriefcaseBusiness, FileCheck2, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export interface HeroSlideData {
  _id: string;
  title: string;
  subtitle?: string;
  backgroundImage?: { url?: string; alt?: string };
  buttons?: Array<{ label: string; href: string; variant?: string }>;
  highlights?: string[];
}

export function HeroSlider({ slides, contact }: { slides: HeroSlideData[]; contact?: { phone?: string; email?: string; address?: { city?: string; country?: string }; whatsapp?: string } }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % total), 8000);
    return () => clearInterval(timer);
  }, [total]);

  const fallback: HeroSlideData = { _id: 'fallback', title: 'Your Trusted Visa & Travel Consultancy', subtitle: 'We provide professional visa consultation and travel guidance for individuals, families and businesses to destinations around the world.', buttons: [{ label: 'Explore Visa Guides', href: '/countries' }, { label: 'Contact Us', href: '/contact', variant: 'secondary' }], highlights: ['Tourist Visa', 'Student Visa', 'Business Visa', 'Documentation Support'] };
  const activeSlides = total ? slides : [fallback];

  const slide = activeSlides[index % activeSlides.length];

  return (
    <section className="relative flex min-h-[690px] items-center overflow-hidden bg-[#10202e] text-white">
      <div className="absolute inset-0" aria-hidden="true">
        {activeSlides.map((s, i) =>
          s.backgroundImage?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`image-${s._id}`}
              src={s.backgroundImage.url}
              alt={s.backgroundImage.alt || s.title}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
                i === index ? 'opacity-60' : 'opacity-0'
              }`}
            />
          ) : null
        )}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_45%,rgba(32,110,193,.16)_0,rgba(7,26,48,.22)_32%,rgba(7,26,48,.92)_75%)]" />
      <div className="hero-orb absolute -right-32 top-20 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="site-container relative z-10 w-full pt-48 pb-28">
        <div key={`content-${slide._id}`} className="hero-slide-content max-w-[680px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-yellow-300 backdrop-blur"><BadgeCheck className="h-3.5 w-3.5" /> Your Trusted Travel Partner</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.06] tracking-tight md:text-6xl xl:text-7xl">{slide.title}</h1>
          {slide.subtitle && <p className="mt-4 max-w-xl text-base leading-7 text-slate-100 md:text-lg">{slide.subtitle}</p>}
          {slide.buttons?.length ? (
            <div className="mt-8 flex flex-wrap gap-4">
              {slide.buttons.map((btn) => (
                <Link
                  key={btn.href + btn.label}
                  href={btn.href}
                  className={`rounded-lg px-6 py-3 font-semibold transition ${
                    btn.variant === 'secondary'
                      ? 'border border-white bg-white text-[#063d7a] hover:bg-slate-100'
                      : 'bg-[#f5bc00] text-[#10203b] hover:bg-yellow-300'
                  }`}
                >
                  {btn.label}
                  <ArrowRight className="ml-2 inline h-4 w-4" />
                </Link>
              ))}
            </div>
          ) : null}
          {slide.highlights?.length ? (
            <div className="mt-10 flex flex-wrap gap-5">
              {slide.highlights.slice(0, 4).map((h, i) => {
                const Icon = [BadgeCheck, GraduationCap, BriefcaseBusiness, FileCheck2][i];
                return <span key={h} className="flex max-w-24 flex-col items-center gap-2 text-center text-[10px] font-semibold"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-yellow-300 text-yellow-300"><Icon className="h-5 w-5" /></span>{h}</span>;
              })}
            </div>
          ) : null}
        </div>
        <aside className="absolute right-0 top-1/2 hidden w-[310px] -translate-y-1/2 rounded-3xl border border-white/25 bg-white/15 p-6 text-sm text-white shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:block">
          <div className="absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-white/20 to-transparent" />
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f5bc00] text-[#10203b]"><MessageCircle className="h-5 w-5" /></span>
          <b className="mt-4 block text-lg tracking-tight">Need visa assistance?</b>
          <p className="mt-1.5 text-xs leading-5 text-white/75">Speak with a travel specialist and get clear next steps for your application.</p>
          <div className="mt-5 space-y-3 border-y border-white/15 py-4 text-xs">
            {contact?.phone && <a href={`tel:${contact.phone}`} className="flex items-center gap-2.5 transition hover:text-yellow-200"><Phone className="h-4 w-4 text-yellow-300" /> {contact.phone}</a>}
            {contact?.email && <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 transition hover:text-yellow-200"><Mail className="h-4 w-4 text-yellow-300" /> {contact.email}</a>}
            {(contact?.address?.city || contact?.address?.country) && <span className="flex items-center gap-2.5 text-white/80"><MapPin className="h-4 w-4 shrink-0 text-yellow-300" /> {[contact?.address?.city, contact?.address?.country].filter(Boolean).join(', ')}</span>}
          </div>
          <a href={contact?.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` : '/contact'} className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-bold text-[#063d7a] transition hover:-translate-y-0.5 hover:bg-yellow-100"><MessageCircle className="h-4 w-4" /> Chat on WhatsApp</a>
        </aside>
      </div>

      {total > 1 && (
        <>
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s._id}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setIndex((index - 1 + total) % total)}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 hover:bg-black/50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setIndex((index + 1) % total)}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 hover:bg-black/50"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </section>
  );
}
