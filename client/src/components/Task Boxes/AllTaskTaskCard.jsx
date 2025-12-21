export default function AllTaskTaskCard({ name, description, status }) {
  // Map status to Tailwind classes
  const colorClasses = {
    completed: {
      bg: "bg-green-500/15",
      border: "border-green-500/30",
      text: "text-green-400",
      hover: "hover:bg-green-500/25",
    },
    assigned: {
      bg: "bg-blue-500/15",
      border: "border-blue-500/30",
      text: "text-blue-400",
      hover: "hover:bg-blue-500/25",
    },
    pending: {
      bg: "bg-red-500/15",
      border: "border-red-500/30",
      text: "text-red-400",
      hover: "hover:bg-red-500/25",
    },
  };

  const taskColor = colorClasses[status] || colorClasses.pending;

  return (
    <div
      className={`grid grid-cols-3 items-center ${taskColor.bg} ${taskColor.border} px-4 py-4 rounded-xl text-white ${taskColor.hover} transition`}
    >
      <span className="font-medium">{name}</span>
      <span className="text-gray-200">{description}</span>
      <span className={`text-right ${taskColor.text} font-semibold`}>
        {status}
      </span>
    </div>
  );
}
