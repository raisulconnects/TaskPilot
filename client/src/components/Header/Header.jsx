import { useAuthContext } from "../../context/AuthContext";
import { useTaskContext } from "../../context/TaskContext";

export default function Header() {
  const { logout, user } = useAuthContext();
  const { fetchTasks } = useTaskContext();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">
          Hello, <br />
          <span className="text-3xl font-bold text-amber-400">
            {user.name} 👋
          </span>
        </div>
        <div className="flex gap-2">
          {/* Refetch Tasks */}
          <button
            className="w-full rounded-xl bg-amber-400 text-gray-900 font-semibold py-2.5 hover:bg-amber-300 active:scale-[0.98] transition px-5"
            onClick={() => {
              fetchTasks();
            }}
          >
            Refresh
          </button>

          {/* Logout Button */}
          <button
            className="w-full rounded-xl bg-amber-400 text-gray-900 font-semibold py-2.5 hover:bg-amber-300 active:scale-[0.98] transition px-5"
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
