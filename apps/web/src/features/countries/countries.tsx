import Link from 'next/link';
import { ArrowRight, Clock3 } from 'lucide-react';

const fallbackCountryImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=800&q=80';

export interface CountryCard {
  _id: string;
  name: string;
  slug: string;
  description: string;
  flag?: { url?: string } | null;
  heroImage?: { url?: string } | null;
  processingTime?: string;
}

export function CountriesSection({ countries }: { countries: CountryCard[] }) {
  return (
    <section className="py-14">
      <div className="site-container">
        <div className="mb-7 flex items-end justify-between"><div><p className="eyebrow">Popular destinations</p><h2 className="section-title">Visa Information by <em>Country</em></h2></div><Link href="/countries" className="hidden items-center gap-1 text-xs font-bold text-[#0753a2] sm:flex">View All Countries <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {countries.map((country) => (
            <Link
              key={country._id}
              href={`/countries/${country.slug}`}
              className="soft-card group overflow-hidden rounded-xl transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#0b528f] to-[#75a9cb]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={country.heroImage?.url || fallbackCountryImage}
                  alt={`${country.name} travel destination`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062f5f]/45 via-transparent to-transparent" />
              </div>
              <div className="relative p-5"><div className="absolute -top-7 left-5 flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg ">
                {country.flag?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={country.flag.url} alt={country.name} className="h-full w-full object-contain" />
                ) : (
                  '🌐'
                )}
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-[#0753a2]">
                {country.name}
              </h3>
              <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{country.description}</p>
              {country.processingTime && (
                <p className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-500">
                  <Clock3 className="h-3.5 w-3.5 text-[#0753a2]" /> Processing: {country.processingTime}
                </p>
              )}
              <span className="absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#063d7a] text-white"><ArrowRight className="h-3.5 w-3.5" /></span></div>
            </Link>
          ))}
        </div>
        <div className="mt-7 text-center sm:hidden">
          <Link
            href="/countries"
            className="inline-block rounded-lg bg-[#063d7a] px-6 py-3 text-sm font-semibold text-white"
          >
            View All Countries
          </Link>
        </div>
      </div>
    </section>
  );
}
