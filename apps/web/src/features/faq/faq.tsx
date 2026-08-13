'use client';

import { useState } from 'react';
import { SectionHeading } from '@/components/site/section-heading';

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category?: string;
}

export function FAQSection({ faqs, showAll = false }: { faqs: FAQItem[]; showAll?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visible = showAll ? faqs : faqs.slice(0, 5);

  if (!visible.length) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading title="Frequently Asked Questions" subtitle="Answers to common questions about our services" />
        <div className="space-y-4">
          {visible.map((faq, i) => (
            <div key={faq._id} className="overflow-hidden rounded-lg border bg-white">
              <button
                className="flex w-full items-center justify-between p-4 text-left font-semibold text-slate-900"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span>{faq.question}</span>
                <span className="text-slate-400">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && <div className="px-4 pb-4 text-slate-600">{faq.answer}</div>}
            </div>
          ))}
        </div>
        {!showAll && faqs.length > 5 && (
          <p className="mt-8 text-center text-sm text-slate-500">
            View more on the{' '}
            <a href="/faq" className="font-medium text-blue-700 hover:underline">
              FAQ page
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
