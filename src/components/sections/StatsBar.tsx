const stats = [
  { value: "12", label: "Wijnen" },
  { value: "6", label: "Landen" },
  { value: "5", label: "Body levels" },
  { value: "€175", label: "Per box" },
];

export function StatsBar() {
  return (
    <section className="bg-wine border-y-brutal border-ink">
      <div className="container-brutal px-4 py-8 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="font-display text-4xl md:text-5xl font-bold text-champagne block">
                {stat.value}
              </span>
              <span className="font-accent text-[10px] uppercase tracking-widest text-champagne/60">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
