export default function NewTask() {
  return (
    <div className="mt-10 flex gap-5">
      <div className="bg-red-400 w-80 px-10 py-10 rounded-2xl text-white">
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold">0</div>
          <div className="text-2xl font-semibold">New Task</div>
        </div>
      </div>
      <div className="bg-blue-400 w-80 px-10 py-10 rounded-2xl text-white">
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold">0</div>
          <div className="text-2xl font-semibold">Completed Task</div>
        </div>
      </div>
      <div className="bg-green-400 w-80 px-10 py-10 rounded-2xl text-white">
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold">0</div>
          <div className="text-2xl font-semibold">Accepted Task</div>
        </div>
      </div>
      <div className="bg-yellow-400 w-80 px-10 py-10 rounded-2xl text-white">
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold">0</div>
          <div className="text-2xl font-semibold">Failed Task</div>
        </div>
      </div>
    </div>
  );
}
