import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function PageBanner({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
}) {
  return (
    <div className="relative overflow-hidden brand-gradient py-16 text-white">
      <div className="absolute -right-12 -top-24 h-64 w-64 rounded-full border-[35px] border-white/10" />
      <div className="site-container relative">
        {breadcrumb && (
          <nav className="mb-4 flex items-center gap-1 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            {breadcrumb.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl leading-6 text-blue-100">{subtitle}</p>}
      </div>
    </div>
  );
}
