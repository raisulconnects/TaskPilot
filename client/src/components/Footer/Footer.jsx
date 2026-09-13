import { FaLinkedin, FaGithub, FaExternalLinkAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-8 bg-white rounded-3xl border border-mist shadow-card px-6 py-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-sm text-iron font-medium">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-monday-violet font-semibold">TaskPilot</span>.
          All rights reserved.
        </p>

        <div className="flex space-x-5">
          <a
            href="https://www.linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-iron hover:text-monday-violet transition-colors duration-200 text-sm font-medium"
          >
            <FaLinkedin size={16} />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
          <a
            href="https://github.com/your-github"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-iron hover:text-ink transition-colors duration-200 text-sm font-medium"
          >
            <FaGithub size={16} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href="https://raisulconnects.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-iron hover:text-monday-violet transition-colors duration-200 text-sm font-medium"
          >
            <FaExternalLinkAlt size={14} />
            <span className="hidden sm:inline">Portfolio</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
