export default function SingleTask({ dueDate, priority, description, title }) {
  return (
    <div className="h-full shrink-0 w-120 rounded-2xl bg-red-400 p-5">
      <div className="text-white flex justify-between items-center">
        <h2 className="bg-red-600 px-2 py-1 rounded-sm font-semibold">
          {priority}
        </h2>
        <h2 className="font-semibold">{dueDate}</h2>
      </div>
      <div className="mt-4">
        <h2 className="font-bold text-2xl">{title}</h2>
        <p className="mt-2 font-sm text-[17px] font-semibold">{description}</p>
      </div>
    </div>
  );
}
