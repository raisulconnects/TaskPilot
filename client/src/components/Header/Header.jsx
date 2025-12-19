export default function Header() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">
          Hello, <br />
          <span className="text-3xl font-bold text-amber-400">Raisul 👋</span>
        </div>
        <div>
          <button className="w-full rounded-xl bg-amber-400 text-gray-900 font-semibold py-2.5 hover:bg-amber-300 active:scale-[0.98] transition px-5">
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
