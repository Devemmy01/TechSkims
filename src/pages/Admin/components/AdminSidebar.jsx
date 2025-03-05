import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings, Users, UserCog, BarChart2, MessageSquare, User, LogOut } from 'lucide-react'
import { toast } from 'react-toastify';

import logo from "../../../assets/techskims2.png"
import { FolderKanbanIcon } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
  { icon: Settings, label: 'Services', path: '/admin/services' },
  { icon: FolderKanbanIcon, label: 'Gallery', path: '/admin/gallery' },
  { icon: Users, label: 'Clients', path: '/admin/clients' },
  { icon: UserCog, label: 'Technicians', path: '/admin/technicians' },
  { icon: BarChart2, label: 'Reports & Analytics', path: '/admin/reports' },
]

const accountItems = [
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
]

function AdminSidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  return (
    <>
      <aside
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 w-64 transform border-r bg-white transition-transform duration-200 ease-in-out overflow-y-auto scrollbar-custom lg:relative lg:translate-x-0 h-screen z-[9999]`}
      >
        <style jsx>{`
          .scrollbar-custom::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
          .scrollbar-custom::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>

        <div className="flex h-16 items-center border-b px-6">
          <img src={logo} alt="TechSkims" />
        </div>
        <nav className="flex flex-col justify-between p-4">
          <div className="space-y-4">
            <div className="space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center rounded-[8px] h-[50px] px-4 py-2 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-[#00A8E8] text-white'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-4">
              <div className="space-y-1 border-t pt-4">
                <p className="px-4 text-xs font-semibold uppercase text-gray-400">
                  Manage Account
                </p>
                {accountItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-[#00a6e8] text-white'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  )
}

export default AdminSidebar;