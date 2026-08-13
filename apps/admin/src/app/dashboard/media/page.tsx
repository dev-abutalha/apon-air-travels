'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Trash2, Copy, Loader2, X, ExternalLink } from 'lucide-react';
import { useState, useRef } from 'react';

export default function MediaPage() {
  const qc = useQueryClient();
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const { data } = useQuery({ queryKey: ['media'], queryFn: async () => { const r = await fetch('/api/media'); if (!r.ok) throw new Error(); return r.json(); } });
  const del = useMutation({
    mutationFn: async (id: string) => { await fetch(`/api/media/${id}`, { method: 'DELETE' }); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['media'] }); setPreview(null); },
  });
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const r = await fetch('/api/media/upload', { method: 'POST', body: fd });
    if (r.ok) qc.invalidateQueries({ queryKey: ['media'] });
    setUploading(false); if (input.current) input.current.value = '';
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <div><input type="file" ref={input} onChange={upload} className="hidden" accept="image/*" /><button onClick={() => input.current?.click()} disabled={uploading} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"><Upload className="h-4 w-4" /> {uploading ? 'Uploading...' : 'Upload'}</button></div>
      </div>
      {!data?.length ? <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">No media yet</div> : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {data.map((m: any) => <div key={m._id} className="group relative cursor-pointer overflow-hidden rounded-xl border bg-card" onClick={() => setPreview(m)}>
            <div className="aspect-square bg-muted"><img src={m.url} alt={m.alt || ''} className="h-full w-full object-cover transition group-hover:scale-105" /></div>
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={(e) => { e.stopPropagation(); setPreview(m); }} className="rounded-lg bg-white/90 p-2 text-gray-700 hover:bg-white" title="Preview"><ExternalLink className="h-4 w-4" /></button>
              <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(m.url); }} className="rounded-lg bg-white/90 p-2 text-gray-700 hover:bg-white" title="Copy URL"><Copy className="h-4 w-4" /></button>
              <button onClick={(e) => { e.stopPropagation(); del.mutate(m._id); }} disabled={del.isPending} className="rounded-lg bg-white/90 p-2 text-red-600 hover:bg-white disabled:opacity-50" title="Delete">{del.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button>
            </div>
          </div>)}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPreview(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{preview.filename}</p>
                <p className="text-xs text-gray-500">{preview.mimeType} · {Math.round(preview.size / 1024)} KB</p>
              </div>
              <button onClick={() => setPreview(null)} className="rounded p-1.5 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex max-h-[65vh] items-center justify-center bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt={preview.alt || ''} className="max-h-[65vh] w-full object-contain" />
            </div>
            <div className="flex items-center gap-2 border-t p-4">
              <button onClick={() => navigator.clipboard.writeText(preview.url)} className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent"><Copy className="h-4 w-4" /> Copy URL</button>
              <a href={preview.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent"><ExternalLink className="h-4 w-4" /> Open</a>
              <button onClick={() => del.mutate(preview._id)} disabled={del.isPending} className="ml-auto flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"><Trash2 className="h-4 w-4" /> Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
