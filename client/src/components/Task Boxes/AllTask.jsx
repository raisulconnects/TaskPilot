export default function AllTask() {
  return (
    <div className="bg-gray-900/70 p-6 rounded-2xl space-y-4">
      {/* Header */}
      <div className="grid grid-cols-3 text-gray-400 text-sm font-semibold px-4">
        <span>Assigned To</span>
        <span>Task</span>
        <span className="text-right">Status</span>
      </div>

      {/* Task Card */}
      <div className="grid grid-cols-3 items-center bg-red-500/15 border border-red-500/30 px-4 py-4 rounded-xl text-white hover:bg-red-500/25 transition">
        <span className="font-medium">John Doe</span>
        <span className="text-gray-200">Make a UI Design</span>
        <span className="text-right text-red-400 font-semibold">Pending</span>
      </div>

      <div className="grid grid-cols-3 items-center bg-green-500/15 border border-green-500/30 px-4 py-4 rounded-xl text-white hover:bg-green-500/25 transition">
        <span className="font-medium">John Doe</span>
        <span className="text-gray-200">Make a UI Design</span>
        <span className="text-right text-green-400 font-semibold">
          Completed
        </span>
      </div>

      <div className="grid grid-cols-3 items-center bg-blue-500/15 border border-blue-500/30 px-4 py-4 rounded-xl text-white hover:bg-blue-500/25 transition">
        <span className="font-medium">John Doe</span>
        <span className="text-gray-200">Make a UI Design</span>
        <span className="text-right text-blue-400 font-semibold">
          In Progress
        </span>
      </div>
    </div>
  );
}
