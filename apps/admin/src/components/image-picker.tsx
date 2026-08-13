'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { ImagePlus, Upload, X, Check } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImagePicker({ label, value, onChange }: Props) {
  const qc = useQueryClient();
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  const { data } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const r = await fetch('/api/media');
      if (!r.ok) throw new Error();
      return r.json();
    },
    enabled: open,
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/media/upload', { method: 'POST', body: fd });
      if (!r.ok) throw new Error();
      return r.json();
    },
    onSuccess: (m: any) => {
      qc.invalidateQueries({ queryKey: ['media'] });
      onChange(m.url);
      setOpen(false);
    },
  });

  const pick = (url: string) => {
    onChange(url);
    setOpen(false);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImagePlus className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or /uploads/..."
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <div className="mt-1.5 flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
            >
              Choose from Media
            </button>
            <button
              type="button"
              onClick={() => input.current?.click()}
              disabled={upload.isPending}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium disabled:opacity-50"
            >
              <Upload className="mr-1 inline h-3 w-3" />
              {upload.isPending ? 'Uploading...' : 'Upload'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium text-red-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      <input
        type="file"
        ref={input}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload.mutate(file);
          e.target.value = '';
        }}
      />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Choose Image</h3>
              <button onClick={() => setOpen(false)} className="rounded p-1.5 hover:bg-gray-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            {!data?.length ? (
              <div className="p-8 text-center text-sm text-gray-500">Media library is empty. Upload an image first.</div>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {data.map((m: any) => (
                  <button
                    key={m._id}
                    type="button"
                    onClick={() => setPreview(m)}
                    className={`overflow-hidden rounded-lg border bg-muted transition ${value === m.url ? 'ring-2 ring-blue-600' : 'hover:ring-2 hover:ring-blue-300'}`}
                  >
                    <div className="aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.url} alt={m.alt || ''} className="h-full w-full object-cover" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPreview(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{preview.filename || preview.alt || 'Image'}</p>
                {preview.mimeType && <p className="text-xs text-gray-500">{preview.mimeType} · {Math.round(preview.size / 1024)} KB</p>}
              </div>
              <button onClick={() => setPreview(null)} className="rounded p-1.5 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex max-h-[60vh] items-center justify-center bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt={preview.alt || ''} className="max-h-[60vh] w-full object-contain" />
            </div>
            <div className="flex items-center justify-end gap-2 border-t p-4">
              <button onClick={() => setPreview(null)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
              <button onClick={() => pick(preview.url)} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                <Check className="h-4 w-4" /> Select this image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
