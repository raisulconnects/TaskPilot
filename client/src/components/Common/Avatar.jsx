// Initial-letter avatar with a stable, name-derived tint so the same person
// always gets the same colour across the table, charts and member list.
const TINTS = [
  "bg-periwinkle text-monday-violet",
  "bg-mint/60 text-forest",
  "bg-peony/70 text-ultra-violet",
  "bg-sky/60 text-[#1d6fa3]",
  "bg-lavender text-ultra-violet",
  "bg-apricot/20 text-apricot",
];

const SIZES = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

function tintFor(name = "") {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return TINTS[hash % TINTS.length];
}

export default function Avatar({ name, size = "sm", className = "" }) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${SIZES[size]} ${tintFor(name)} ${className}`}
    >
      {name?.trim()?.charAt(0)?.toUpperCase() || "?"}
    </span>
  );
}
