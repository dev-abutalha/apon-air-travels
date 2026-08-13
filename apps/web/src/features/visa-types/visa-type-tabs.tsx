'use client';

import { useState } from 'react';

export interface VisaTypeData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  eligibility: string[];
  fees: string;
  duration: string;
  processingTime: string;
}

export function VisaTypeTabs({ visaTypes }: { visaTypes: VisaTypeData[] }) {
  const [active, setActive] = useState(0);

  if (!visaTypes.length) return null;
  const current = visaTypes[active];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {visaTypes.map((vt, i) => (
          <button
            key={vt._id}
            onClick={() => setActive(i)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              i === active ? 'bg-blue-600 text-white' : 'border bg-white text-slate-700 hover:bg-blue-50'
            }`}
          >
            {vt.title}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-xs font-medium uppercase text-blue-700">Processing Time</p>
            <p className="mt-1 font-semibold text-slate-900">{current.processingTime || '—'}</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-xs font-medium uppercase text-blue-700">Government Fees</p>
            <p className="mt-1 font-semibold text-slate-900">{current.fees || '—'}</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-xs font-medium uppercase text-blue-700">Validity</p>
            <p className="mt-1 font-semibold text-slate-900">{current.duration || '—'}</p>
          </div>
        </div>
        <p className="mt-6 text-slate-600">{current.description}</p>

        {current.eligibility?.length ? (
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">Eligibility</h3>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {current.eligibility.map((e) => (
                <li key={e} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="text-blue-600">•</span> {e}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
