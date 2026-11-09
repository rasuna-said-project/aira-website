export default function SectionHeading({ eyebrow, title, description, className = "" }) {
  return (
    <div className={className}>
      <p className="text-sm font-semibold uppercase tracking-widest text-aira-peach">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-semibold text-aira-primary sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 leading-relaxed text-aira-text/80">{description}</p>
      )}
    </div>
  );
} 