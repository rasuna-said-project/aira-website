import SectionHeading from "@/components/ui/SectionHeading";
import FeatureCard from "@/components/home/FeatureCard";
import { FEATURES_CONTENT as c } from "@/data/home";

export default function FeatureSection() {
  return (
    <section className="mx-auto max-w-310 px-4 pb-16 pt-4 sm:px-5 sm:pb-20">
      <SectionHeading eyebrow={c.eyebrow} title={c.title} className="max-w-2xl" />
      <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {c.items.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
} 