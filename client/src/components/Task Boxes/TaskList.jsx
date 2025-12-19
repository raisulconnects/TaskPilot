export default function TaskList() {
  return (
    <>
      <div
        className=" mt-5 h-80 flex gap-5 justify-start items-center overflow-auto "
        id="TaskList"
      >
        <div className="h-full shrink-0 w-120 rounded-2xl bg-red-400 p-5">
          <div className="text-white flex justify-between items-center">
            <h2 className="bg-red-600 px-2 py-1 rounded-sm font-semibold">
              High
            </h2>
            <h2 className="font-semibold">19th December, 2025</h2>
          </div>
          <div className="mt-4">
            <h2 className="font-bold text-2xl">This is the work title</h2>
            <p className="mt-2 font-sm text-[17px] font-semibold">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
              illum laudantium harum voluptatum porro quae cum veniam. Fuga,
              non. Corporis id voluptatibus dolores maiores quod
            </p>
          </div>
        </div>

        <div className="h-full shrink-0 w-120 rounded-2xl bg-amber-400 p-5">
          <div className="text-white flex justify-between items-center">
            <h2 className="bg-green-500 px-2 py-1 rounded-sm font-semibold">
              General
            </h2>
            <h2 className="font-semibold">19th December, 2025</h2>
          </div>
          <div className="mt-4">
            <h2 className="font-bold text-2xl">This is the work title</h2>
            <p className="mt-2 font-sm text-[17px] font-semibold">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
              illum laudantium harum voluptatum porro quae cum veniam. Fuga,
              non. Corporis id voluptatibus dolores maiores quod
            </p>
          </div>
        </div>

        <div className="h-full shrink-0 w-120 rounded-2xl bg-blue-400 p-5">
          <div className="text-white flex justify-between items-center">
            <h2 className="bg-gray-500 px-2 py-1 rounded-sm font-semibold">
              Average
            </h2>
            <h2 className="font-semibold">19th December, 2025</h2>
          </div>
          <div className="mt-4">
            <h2 className="font-bold text-2xl">This is the work title</h2>
            <p className="mt-2 font-sm text-[17px] font-semibold">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
              illum laudantium harum voluptatum porro quae cum veniam. Fuga,
              non. Corporis id voluptatibus dolores maiores quod
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
