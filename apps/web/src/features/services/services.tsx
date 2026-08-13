import Link from 'next/link';
import { SectionHeading } from '@/components/site/section-heading';
import { ArrowRight, BriefcaseBusiness, FileCheck2, Globe2, GraduationCap, Plane, ShieldCheck, Ticket, type LucideIcon } from 'lucide-react';

export interface ServiceCard {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  image?: { url?: string } | null;
  features?: string[];
  cta?: { label?: string; href?: string } | null;
}

const iconMap: Record<string, LucideIcon> = {
  Globe: Globe2, GraduationCap, Briefcase: BriefcaseBusiness, Plane, ShieldCheck, Ticket, FileCheck2,
};

export function ServicesSection({ services }: { services: ServiceCard[] }) {
  return (
    <section className="py-14">
      <div className="site-container">
        <SectionHeading
          title="Our Services"
          subtitle="Comprehensive visa and travel services tailored to your needs"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {services.map((service) => (
            <Link
              key={service._id}
              href={`/services/${service.slug}`}
              className="soft-card group rounded-xl p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              {(() => { const Icon = iconMap[service.icon || ''] || FileCheck2; return <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#edf5ff] text-[#0753a2]"><Icon className="h-6 w-6" /></span>; })()}
              <h3 className="mt-4 text-sm font-bold text-slate-900 group-hover:text-[#0753a2]">
                {service.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{service.description}</p>
              {service.features?.length ? (
                <ul className="mt-4 space-y-1 text-xs text-slate-600">
                  {service.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-blue-600">✓</span> {f}
                    </li>
                  ))}
                </ul>
              ) : null}
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#0753a2]">Learn More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
