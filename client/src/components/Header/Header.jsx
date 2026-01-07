import { useAuthContext } from "../../context/AuthContext";
import { useTaskContext } from "../../context/TaskContext";

export default function Header() {
  const { logout, user } = useAuthContext();
  const { fetchTasks } = useTaskContext();

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-xl sm:text-2xl font-semibold">
          Hello, <br />
          <span className="text-2xl sm:text-3xl font-bold text-amber-400">
            {user.name} 👋
          </span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Refetch Tasks */}
          <button
            className="flex-1 sm:flex-none rounded-xl bg-amber-400 text-gray-900 font-semibold py-2 sm:py-2.5 hover:bg-amber-300 active:scale-[0.98] transition px-4 sm:px-5 text-sm sm:text-base"
            onClick={() => {
              fetchTasks();
            }}
          >
            Refresh
          </button>

          {/* Logout Button */}
          <button
            className="flex-1 sm:flex-none rounded-xl bg-amber-400 text-gray-900 font-semibold py-2 sm:py-2.5 hover:bg-amber-300 active:scale-[0.98] transition px-4 sm:px-5 text-sm sm:text-base"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
