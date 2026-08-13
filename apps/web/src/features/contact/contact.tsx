import Link from 'next/link';

export function ContactSection({
  phone,
  email,
}: {
  phone?: string;
  email?: string;
}) {
  return (
    <section className="py-16 bg-blue-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Ready to Start Your Journey?</h2>
        <p className="mx-auto mt-3 max-w-xl text-blue-200">
          Contact us today for a free consultation about your visa and travel needs
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-900 hover:bg-blue-50"
          >
            Get in Touch
          </Link>
          {phone && (
            <a href={`tel:${phone}`} className="rounded-lg border-2 border-white px-8 py-3 font-semibold hover:bg-white/10">
              {phone}
            </a>
          )}
        </div>
        {email && <p className="mt-6 text-sm text-blue-200">{email}</p>}
      </div>
    </section>
  );
}
