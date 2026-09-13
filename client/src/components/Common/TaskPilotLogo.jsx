import { Link } from "react-router-dom";

export default function TaskPilotLogo({
  size = "md",
  showText = true,
  to = "/",
  className = "",
  textSize = "text-lg",
  textColor = "text-ink",
}) {
  const sizeClasses = {
    xs: "w-6 h-6 rounded-lg",
    sm: "w-8 h-8 rounded-xl",
    md: "w-9 h-9 rounded-xl",
    lg: "w-11 h-11 rounded-2xl",
    xl: "w-14 h-14 rounded-2xl",
  };

  const imageClass = sizeClasses[size] || sizeClasses.md;

  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <div
        className={`${imageClass} overflow-hidden shadow-xs border border-mist/60 shrink-0 bg-monday-violet transition-transform duration-300 group-hover:scale-105 flex items-center justify-center`}
      >
        <img
          src="/logo.png"
          alt="TaskPilot"
          className="w-full h-full object-cover object-center"
        />
      </div>
      {showText && (
        <span
          className={`font-bold tracking-tight ${textSize} ${textColor} transition-colors`}
        >
          TaskPilot
        </span>
      )}
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}
