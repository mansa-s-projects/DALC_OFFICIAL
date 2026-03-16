import ServiceCard from '../cards/ServiceCard';

type EditorsPickItem = {
  title: string;
  subtitle: string;
  tag: string;
};

type EditorsPicksProps = {
  items: EditorsPickItem[];
};

export default function EditorsPicks({ items }: EditorsPicksProps) {
  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-3xl text-[#EBD2A0] md:text-4xl">Editor's Picks</h2>
        <span className="text-xs uppercase tracking-[0.12em] text-white/45">Curated Now</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {items.map((item, index) => (
          <ServiceCard key={item.title} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
