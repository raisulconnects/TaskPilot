import Header from "../Header/Header";
import NewTask from "../Task Boxes/NewTask";
import TaskList from "../Task Boxes/TaskList";

export default function EmployeeDashboard() {
  return (
    // items-center justify-center
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white p-20">
      <Header />
      <NewTask />
      <TaskList />
    </div>
  );
}
