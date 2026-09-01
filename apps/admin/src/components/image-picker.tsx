'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { ImagePlus, Upload, X, Trash2 } from 'lucide-react';
import { useToast } from '@/components/toaster';

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImagePicker({ label, value, onChange }: Props) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

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
      toast('Image uploaded successfully');
    },
    onError: () => {
      toast('Upload failed', 'error');
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media'] });
      toast('Image deleted');
    },
    onError: () => {
      toast('Failed to delete image', 'error');
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
                  <div key={m._id} className={`group relative overflow-hidden rounded-lg border bg-muted transition ${value === m.url ? 'ring-2 ring-blue-600' : 'hover:ring-2 hover:ring-blue-300'}`}>
                    <button
                      type="button"
                      onClick={() => pick(m.url)}
                      className="aspect-square block w-full"
                      title="Select image"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.url} alt={m.alt || ''} className="h-full w-full object-cover" />
                    </button>
                    {value === m.url && (
                      <span className="absolute left-1 top-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        Selected
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => del.mutate(m._id)}
                      disabled={del.isPending}
                      className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-md bg-red-600 text-white opacity-0 transition-opacity hover:bg-red-700 group-hover:opacity-100 disabled:opacity-50"
                      title="Delete image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
