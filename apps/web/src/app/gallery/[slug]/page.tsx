import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBanner } from '@/components/site/page-banner';
import { AlbumViewer } from '@/features/gallery/album-viewer';
import { getGalleryAlbumBySlug } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await getGalleryAlbumBySlug(slug);
  return { title: album?.title || 'Gallery Album' };
}

export default async function GalleryAlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = await getGalleryAlbumBySlug(slug);
  if (!album) notFound();

  return (
    <>
      <PageBanner
        title={album.title}
        subtitle={album.description}
        breadcrumb={[{ label: 'Gallery', href: '/gallery' }, { label: album.title }]}
      />
      <section className="py-16">
        <div className="container mx-auto px-4">
          {album.images?.length ? (
            <AlbumViewer images={album.images} />
          ) : (
            <p className="text-center text-slate-500">No photos in this album yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
