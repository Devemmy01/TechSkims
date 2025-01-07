import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useProfileData } from '../AdminSettings';
import { Link } from 'react-router-dom';
import NotificationModal from '../../../components/NotificationModal';

export default function Header() {
  const { profile } = useProfileData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 z-[9998] md:relative flex h-16 items-center gap-10 justify-end border-b bg-white px-4 lg:px-10">
      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 hover:bg-gray-100" onClick={() => setIsModalOpen(true)}>
          <Bell className="h-5 w-5 text-gray-500" />
        </button>
        <Link to="/admin/settings">
          <button className="flex items-center gap-2 w-12 h-12 p-1 rounded-full bg-purple-100">
            <img
              src={profile?.thumbnail || "/placeholder.svg"}
              alt="Admin"
              className="rounded-full"
            />
          </button>
        </Link>
      </div>
      <NotificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}