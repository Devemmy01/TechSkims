import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings, Users, UserCog, BarChart2, MessageSquare, User, LogOut } from 'lucide-react'

import logo from "../../../assets/techskims2.png"

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
  { icon: Settings, label: 'Services', path: '/admin/services' },
  { icon: Users, label: 'Clients', path: '/admin/clients' },
  { icon: UserCog, label: 'Technicians', path: '/admin/technicians' },
  { icon: BarChart2, label: 'Reports & Analytics', path: '/admin/reports' },
  { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
]

const accountItems = [
  { icon: User, label: 'Account', path: '/admin/account' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
]

export default function AdminSidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const location = useLocation();

  return (
    <>
      <aside
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z- w-64 transform border-r bg-white transition-transform duration-200 ease-in-out overflow-y-scroll lg:relative lg:translate-x-0`}
      >
        <div className="flex h-16 items-center border-b px-6">
          <img src={logo} alt="TechSkims" />
        </div>
        <nav className="flex overflow-y-scroll flex-col justify-between p-4">
          <div className="space-y-4">
            <div className="space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
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
            <Link
              to="/admin/logout"
              className="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Link>
          </div>
        </nav>
      </aside>
    </>
  )
}
