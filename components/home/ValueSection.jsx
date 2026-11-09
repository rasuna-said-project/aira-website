import SectionHeading from "@/components/ui/SectionHeading";
import ValueCard from "@/components/home/ValueCard";
import { VALUES_CONTENT as c } from "@/data/home";

export default function ValueSection() {
  return (
    <section className="bg-aira-warm">
      <div className="mx-auto grid max-w-310 gap-10 px-4 py-16 sm:px-5 sm:py-20 lg:grid-cols-12 lg:gap-12">
        <SectionHeading
          eyebrow={c.eyebrow}
          title={c.title}
          description={c.description}
          className="lg:col-span-4"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
          {c.items.map((item, i) => (
            <ValueCard
              key={item.key}
              icon={item.icon}
              label={item.key}
              title={item.title}
              desc={item.desc}
              iconStyle={item.iconStyle}
              offset={i % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}