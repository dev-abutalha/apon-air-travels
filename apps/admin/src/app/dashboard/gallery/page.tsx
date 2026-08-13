'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

export default function GalleryPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['gallery-albums'],
    queryFn: async () => {
      const r = await fetch('/api/gallery');
      if (!r.ok) throw new Error();
      return r.json();
    },
  });
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [published, setPublished] = useState(true);

  const mut = useMutation({
    mutationFn: async (d: any) => {
      const r = await fetch(edit ? `/api/gallery/${edit._id}` : '/api/gallery', {
        method: edit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });
      if (!r.ok) throw new Error();
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gallery-albums'] });
      reset();
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gallery-albums'] }),
  });

  const reset = () => {
    setShow(false);
    setEdit(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setImageUrls('');
    setPublished(true);
  };

  const openNew = () => {
    reset();
    setShow(true);
  };

  const openEdit = (a: any) => {
    setEdit(a);
    setTitle(a.title);
    setSlug(a.slug);
    setDescription(a.description || '');
    setImageUrls((a.images || []).map((i: any) => i.url).join('\n'));
    setPublished(a.published ?? true);
    setShow(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gallery Albums</h1>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> New Album
        </button>
      </div>

      {show && (
        <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">{edit ? 'Edit' : 'New'} Album</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><label className="block text-sm font-medium mb-1">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Slug</label><input value={slug} onChange={e => setSlug(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><input value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" /></div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Image URLs (one per line)</label>
              <textarea value={imageUrls} onChange={e => setImageUrls(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" rows={5} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Published</label>
              <select value={published ? 'true' : 'false'} onChange={e => setPublished(e.target.value === 'true')} className="w-full rounded-lg border px-3 py-2 text-sm">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => mut.mutate({
                title,
                slug,
                description,
                published,
                images: imageUrls.split('\n').map((u) => u.trim()).filter(Boolean).map((url) => ({ url })),
                coverImage: imageUrls.split('\n').map((u) => u.trim()).filter(Boolean)[0]
                  ? { url: imageUrls.split('\n').map((u) => u.trim()).filter(Boolean)[0] }
                  : undefined,
              })}
              disabled={mut.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
            >
              {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : null} {edit ? 'Update' : 'Create'}
            </button>
            <button onClick={reset} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-card shadow-sm">
        {isLoading ? (
          <p className="p-8 text-center text-muted-foreground">Loading...</p>
        ) : !data?.length ? (
          <p className="p-8 text-center text-muted-foreground">No albums yet</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((a: any) => (
              <div key={a._id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                  {a.coverImage?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.coverImage.url} alt={a.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl">📷</div>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{a.title}</h3>
                    <p className="text-xs text-muted-foreground">{a.images?.length || 0} images · {a.published ? 'Published' : 'Draft'}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(a)} className="rounded p-1.5 hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => del.mutate(a._id)} disabled={del.isPending} className="rounded p-1.5 text-red-600 hover:bg-accent disabled:opacity-50">
                      {del.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
