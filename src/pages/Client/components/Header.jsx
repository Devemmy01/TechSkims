import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full flex h-16 items-center gap-10 justify-end border-b bg-white px-4 lg:px-10">
      <div className="flex md:w-80 items-end justify-end">
        <form className="w-full hidden md:block">
          <div className="relative">
            <input
              type="search"
              placeholder="Search"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
        </form>
      </div>
      <div className="flex items-center gap-4">
        <span className="md:hidden text-gray-400">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-500" />
        </button>
        <button className="flex items-center gap-2 rounded-full">
          <img
            src="/placeholder.svg"
            alt="User"
            className="h-8 w-8 rounded-full"
          />
        </button>
      </div>
    </header>
  );
}
