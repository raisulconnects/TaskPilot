import { FaLinkedin, FaGithub, FaExternalLinkAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 py-4 px-6 border-t border-gray-700 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm md:text-base">
          &copy; 2025 TaskPilot. All rights reserved.
        </p>

        <div className="flex space-x-6 mt-3 md:mt-0">
          <a
            href="https://www.linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-gray-300 hover:text-blue-500 transition-transform transform hover:scale-110 duration-300"
          >
            <FaLinkedin size={20} />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
          <a
            href="https://github.com/your-github"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-gray-300 hover:text-gray-100 transition-transform transform hover:scale-110 duration-300"
          >
            <FaGithub size={20} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href="https://raisulconnects.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-gray-300 hover:text-indigo-500 transition-transform transform hover:scale-110 duration-300"
          >
            <FaExternalLinkAlt size={20} />
            <span className="hidden sm:inline">Portfolio</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
