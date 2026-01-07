import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import NewTask from "../Task Boxes/NewTask";
import TaskList from "../Task Boxes/TaskList";

export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white p-4 sm:p-6 md:p-8 lg:p-12 xl:p-20">
      <Header />
      <NewTask />
      <TaskList />
      <Footer />
    </div>
  );
}
