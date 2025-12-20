export default function SingleTask({
  dueDate,
  priority,
  description,
  title,
  status,
}) {
  let priorityBg = "bg-gray-500/80";
  let priorityTextBg = "bg-gray-700";

  if (priority === "High") {
    priorityBg = "bg-gradient-to-br from-red-400 to-red-500";
    priorityTextBg = "bg-red-600";
  } else if (priority === "Medium") {
    priorityBg = "bg-gradient-to-br from-blue-400 to-blue-500";
    priorityTextBg = "bg-blue-600";
  } else if (priority === "General") {
    priorityBg = "bg-gradient-to-br from-yellow-400 to-yellow-500";
    priorityTextBg = "bg-yellow-600";
  }

  const completed = status === "completed";
  priorityBg = completed
    ? "bg-gradient-to-br from-green-500 to-green-600"
    : priorityBg;

  return (
    <div
      className={`h-full shrink-0 w-120 rounded-2xl p-5 text-white 
      shadow-lg hover:shadow-xl transition-all duration-300 
      hover:-translate-y-1 ${priorityBg}`}
    >
      <div className="flex justify-between items-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${priorityTextBg}`}
        >
          {priority}
        </span>

        <span className="text-sm opacity-90 font-medium">{dueDate}</span>
      </div>

      <div className="mt-5 space-y-2">
        <h2 className="font-bold text-2xl leading-tight">{title}</h2>

        <p className="text-[15px] font-medium opacity-95 line-clamp-3">
          {description}
        </p>

        {completed && (
          <span className="inline-block mt-2 text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
            ✅ Completed
          </span>
        )}
      </div>
    </div>
  );
}
