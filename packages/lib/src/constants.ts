export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  CONTENT_WRITER: 'content-writer',
  SEO_MANAGER: 'seo-manager',
} as const;

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['*'],
  [ROLES.EDITOR]: ['countries:read', 'countries:write', 'visa:read', 'visa:write', 'blog:read', 'blog:write'],
  [ROLES.CONTENT_WRITER]: ['blog:read', 'blog:write', 'faq:read', 'faq:write'],
  [ROLES.SEO_MANAGER]: ['seo:read', 'seo:write', 'analytics:read'],
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Countries', href: '/countries' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
] as const;

export const APP_NAME = 'Apon Air Travels';
export const APP_TAGLINE = 'Your Trusted Travel Partner';
