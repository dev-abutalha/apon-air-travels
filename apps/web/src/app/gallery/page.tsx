import type { Metadata } from 'next';
import { PageBanner } from '@/components/site/page-banner';
import { GallerySection } from '@/features/gallery';
import { getGalleryAlbums } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Gallery' };

export default async function GalleryPage() {
  const albums = await getGalleryAlbums();

  return (
    <>
      <PageBanner
        title="Gallery"
        subtitle="Moments from our journey with clients"
        breadcrumb={[{ label: 'Gallery' }]}
      />
      <div className="py-16">
        <div className="container mx-auto px-4">
          {albums.length ? (
            <GallerySection albums={albums} />
          ) : (
            <p className="text-center text-slate-500">No albums available yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
