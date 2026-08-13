export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-9 text-center">
      <p className="eyebrow mb-1">Apon Air Travels</p>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p>}
    </div>
  );
}
