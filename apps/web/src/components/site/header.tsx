'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Plane, Phone, Mail, MapPin, Clock3, ChevronDown } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  order: number;
  children?: Array<{ label: string; href: string }>;
}

interface HeaderProps {
  nav: NavItem[];
  siteName: string;
  logo?: { url?: string; alt?: string } | null;
  darkBackgroundLogo?: { url?: string; alt?: string } | null;
  contactPhone?: string;
  contactEmail?: string;
  address?: { city?: string; country?: string };
}

export function Header({ nav, siteName, logo, darkBackgroundLogo, contactPhone, contactEmail, address }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === '/';
  const activeLogo = isHome ? (darkBackgroundLogo?.url ? darkBackgroundLogo : logo) : logo;

  return (
    <header className={`${isHome ? 'absolute inset-x-0 top-0' : 'sticky top-0 bg-white shadow-sm'} z-50`}>
      <div className="hidden brand-gradient text-white md:block">
        <div className="site-container flex items-center justify-between py-2 text-[11px]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-yellow-400" /> {[address?.city, address?.country].filter(Boolean).join(', ') || 'Dhaka, Bangladesh'}</span>
            {contactPhone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {contactPhone}
              </span>
            )}
            {contactEmail && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" /> {contactEmail}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1"><Clock3 className="h-3 w-3 text-yellow-400" /> Mon - Sat: 9:00 AM - 8:00 PM</span>
        </div>
      </div>
      <div className={`site-container flex h-[74px] items-center justify-between ${isHome ? 'bg-transparent' : 'bg-white'}`}>
        <Link href="/" className="flex items-center gap-2.5">
          {activeLogo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={activeLogo.url} alt={activeLogo.alt || siteName} className="h-14 w-auto max-w-[170px] object-contain object-left" />
          ) : (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-yellow-400 text-white shadow">
                <Plane className="h-5 w-5" />
              </span>
              <span className="leading-tight"><b className={`block text-[15px] font-extrabold uppercase tracking-tight ${isHome ? 'text-white' : 'text-[#063d7a]'}`}>{siteName}</b><small className="block text-[8px] font-bold tracking-[.15em] text-[#e7263f]">LET&apos;S COME &amp; FLY!</small></span>
            </>
          )}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`border-b-2 px-2.5 py-2 text-[12px] font-semibold transition-colors ${
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                  ? isHome ? '!border-[#f5bc00] text-white' : '!border-[#f5bc00] text-[#063d7a]'
                  : isHome ? '!border-transparent text-white/90 hover:text-white' : '!border-transparent text-slate-700 hover:text-[#063d7a]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className={`rounded-md p-2 lg:hidden ${isHome ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t bg-white lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 text-sm font-medium ${
                pathname === item.href ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
