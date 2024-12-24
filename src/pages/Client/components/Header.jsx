import { Bell } from "lucide-react";
import { useProfileData } from "../Settings";

export default function Header() {
  const { profile } = useProfileData();

  return (
    <header className="w-full fixed top-0 z-[9998] md:relative flex h-16 items-center gap-10 justify-end border-b bg-white px-4 lg:px-10">
      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-500" />
        </button>
        <button className="flex items-center gap-2 w-11 h-11 rounded-full border-2">
          <img
            src={profile?.thumbnail || "/placeholder.svg"}
            alt="User"
            className="rounded-full"
          />
        </button>
      </div>
    </header>
  );
}
