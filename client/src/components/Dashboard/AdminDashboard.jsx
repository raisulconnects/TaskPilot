import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import AllTask from "../Task Boxes/AllTask";
import CreateTask from "../Task Boxes/CreateTask";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white p-20">
      <Header />
      <CreateTask />
      <AllTask />
      {/* <Footer /> */}
    </div>
  );
}
