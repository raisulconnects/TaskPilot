export default function AllTaskTaskCard({ id, description, status }) {
  let taskColor = "red";

  taskColor =
    status === "completed" ? "green" : status === "assigned" ? "blue" : "red";

  return (
    <div
      className={`grid grid-cols-3 items-center bg-${taskColor}-500/15 border border-${taskColor}-500/30 px-4 py-4 rounded-xl text-white hover:bg-${taskColor}-500/25 transition`}
    >
      <span className="font-medium">{id}</span>
      <span className="text-gray-200">{description}</span>
      <span className={`text-right text-${taskColor}-400 font-semibold`}>
        {status}
      </span>
    </div>
  );
}
