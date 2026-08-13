'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

export default function BlogPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['blog-posts'], queryFn: async () => { const r = await fetch('/api/blog'); if (!r.ok) throw new Error(); return r.json(); } });
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [published, setPublished] = useState(true);
  const mut = useMutation({
    mutationFn: async (d: any) => { const r = await fetch(edit ? `/api/blog/${edit._id}` : '/api/blog', { method: edit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }); if (!r.ok) throw new Error(); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog-posts'] }); setShow(false); setEdit(null); setTitle(''); setSlug(''); setContent(''); setExcerpt(''); setPublished(true); },
  });
  const del = useMutation({ mutationFn: async (id: string) => { await fetch(`/api/blog/${id}`, { method: 'DELETE' }); }, onSuccess: () => qc.invalidateQueries({ queryKey: ['blog-posts'] }) });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <button onClick={() => { setShow(!show); setEdit(null); setTitle(''); setSlug(''); setContent(''); setExcerpt(''); setPublished(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4" /> New Post</button>
      </div>
      {show && <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">{edit ? 'Edit' : 'New'} Post</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className="block text-sm font-medium mb-1">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Slug</label><input value={slug} onChange={e => setSlug(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" /></div>
        </div>
        <div className="mt-4"><label className="block text-sm font-medium mb-1">Excerpt</label><input value={excerpt} onChange={e => setExcerpt(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" /></div>
        <div className="mt-4"><label className="block text-sm font-medium mb-1">Content</label><textarea value={content} onChange={e => setContent(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" rows={6} /></div>
        <div className="mt-4 flex items-center gap-4"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} /> Published</label></div>
        <div className="mt-4 flex gap-2"><button onClick={() => mut.mutate({ title, slug, content, excerpt, published, publishedAt: published ? new Date().toISOString() : undefined })} disabled={mut.isPending} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">{mut.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : null} {edit ? 'Update' : 'Publish'}</button><button onClick={() => { setShow(false); setEdit(null); }} className="rounded-lg border px-4 py-2 text-sm">Cancel</button></div>
      </div>}
      <div className="rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50"><th className="px-4 py-3 text-left font-medium">Title</th><th className="px-4 py-3 text-left font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Actions</th></tr></thead>
          <tbody>{isLoading ? <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr> : !data?.length ? <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No posts yet</td></tr> : data.map((p: any) => <tr key={p._id} className="border-b last:border-0 hover:bg-muted/50"><td className="px-4 py-3 font-medium">{p.title}</td><td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{p.published ? 'Published' : 'Draft'}</span></td><td className="px-4 py-3 text-right"><button onClick={() => { setEdit(p); setTitle(p.title); setSlug(p.slug); setContent(p.content || ''); setExcerpt(p.excerpt || ''); setPublished(p.published ?? true); setShow(true); }} className="rounded p-1.5 hover:bg-accent"><Pencil className="h-4 w-4" /></button><button onClick={() => del.mutate(p._id)} disabled={del.isPending} className="rounded p-1.5 hover:bg-accent text-red-600 disabled:opacity-50">{del.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
