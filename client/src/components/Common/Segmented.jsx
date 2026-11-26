// Button-group picker (radio semantics) used for category, priority and
// status in the create and edit forms.
export default function Segmented({ options, value, onChange, render, name }) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const on = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(opt)}
            className={`inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              on
                ? "border-monday-violet bg-periwinkle/60 text-monday-violet"
                : "border-mist bg-snow text-slate hover:border-fog"
            }`}
          >
            {render ? render(opt) : opt}
          </button>
        );
      })}
    </div>
  );
}
