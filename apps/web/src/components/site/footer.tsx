import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Mail, Phone, MapPin } from 'lucide-react';

interface Settings {
  siteName: string;
  logo?: { url?: string; alt?: string } | null;
  darkBackgroundLogo?: { url?: string; alt?: string } | null;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  address: Record<string, string>;
  socialLinks: Record<string, string>;
  navigation: Array<{ label: string; href: string; order: number }>;
}

const socialIcons: Record<string, { icon: typeof Facebook; color: string }> = {
  facebook: { icon: Facebook, color: 'hover:bg-blue-600' },
  instagram: { icon: Instagram, color: 'hover:bg-pink-600' },
  linkedin: { icon: Linkedin, color: 'hover:bg-blue-700' },
  youtube: { icon: Youtube, color: 'hover:bg-red-600' },
  twitter: { icon: Twitter, color: 'hover:bg-sky-500' },
};

export function Footer({ settings }: { settings: Settings }) {
  const nav = [...settings.navigation].sort((a, b) => a.order - b.order);
  const footerLogo = settings.darkBackgroundLogo?.url ? settings.darkBackgroundLogo : settings.logo;

  return (
    <footer className="brand-gradient text-slate-200">
      <div className="site-container grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          {footerLogo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={footerLogo.url} alt={footerLogo.alt || settings.siteName} className="mb-3 h-14 w-auto max-w-[170px] object-contain object-left" />
          ) : <h3 className="mb-3 text-lg font-extrabold text-white">{settings.siteName}</h3>}
          <p className="mb-4 text-sm leading-relaxed">{settings.footerText}</p>
          <div className="flex items-center gap-3">
            {Object.entries(settings.socialLinks)
              .filter(([, url]) => url)
              .map(([key, url]) => {
                const conf = socialIcons[key];
                if (!conf) return null;
                const Icon = conf.icon;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors ${conf.color}`}
                    aria-label={key}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {nav.slice(0, 4).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
          <ul className="space-y-3 text-sm">
            {settings.address?.street && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {settings.address.street}, {settings.address.city}, {settings.address.country}
                </span>
              </li>
            )}
            {settings.contactPhone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" /> {settings.contactPhone}
              </li>
            )}
            {settings.contactEmail && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" /> {settings.contactEmail}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 py-4 text-center text-xs text-blue-200">
        © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
      </div>
    </footer>
  );
}
