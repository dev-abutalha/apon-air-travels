import Link from 'next/link';
import { SectionHeading } from '@/components/site/section-heading';

export interface GalleryAlbumCard {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: { url?: string } | null;
  images?: Array<{ url?: string }>;
}

export function GallerySection({ albums }: { albums: GalleryAlbumCard[] }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeading title="Our Gallery" subtitle="Moments from our journey" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Link
              key={album._id}
              href={`/gallery/${album.slug}`}
              className="group overflow-hidden rounded-xl border shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-slate-200">
                {album.coverImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={album.coverImage.url}
                    alt={album.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : null}
                <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                  {album.images?.length || 0} photos
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">{album.title}</h3>
                {album.description && <p className="mt-1 text-sm text-slate-600">{album.description}</p>}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
