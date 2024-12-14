import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "../../../assets/techskims2.png"
import { Settings } from 'lucide-react';
import { toast } from 'react-toastify';

const navItems = [
  { 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 11.4527V16.8007C4 17.9208 4 18.4812 4.21799 18.909C4.40973 19.2854 4.71547 19.591 5.0918 19.7828C5.5192 20.0006 6.07899 20.0006 7.19691 20.0006H16.8031C17.921 20.0006 18.48 20.0006 18.9074 19.7828C19.2837 19.591 19.5905 19.2854 19.7822 18.909C20 18.4816 20 17.9221 20 16.8041V11.4527C20 10.9184 19.9995 10.6511 19.9346 10.4024C19.877 10.1821 19.7825 9.97356 19.6546 9.78513C19.5102 9.5725 19.3096 9.39618 18.9074 9.04431L14.1074 4.84431C13.3608 4.19103 12.9875 3.86455 12.5674 3.74031C12.1972 3.63083 11.8026 3.63083 11.4324 3.74031C11.0126 3.86446 10.6398 4.19063 9.89436 4.84292L5.09277 9.04432C4.69064 9.39618 4.49004 9.5725 4.3457 9.78513C4.21779 9.97356 4.12255 10.1821 4.06497 10.4024C4 10.6511 4 10.9184 4 11.4527Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

    ),
    label: 'Dashboard',
    path: '/client-dashboard'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 11V19.4C3 19.9601 3 20.2396 3.10899 20.4535C3.20487 20.6417 3.35774 20.7952 3.5459 20.8911C3.7596 21 4.03901 21 4.59797 21L15.4014 21C15.9603 21 16.2408 21 16.4545 20.8911C16.6427 20.7952 16.7948 20.6421 16.8906 20.4539C16.9996 20.24 16.9996 19.96 16.9996 19.3999L17.0011 15.0006M3 11H10M3 11L3 10.6001C3 10.0401 3 9.75979 3.10899 9.5459C3.20486 9.35774 3.35774 9.20486 3.5459 9.10898C3.75977 9.00001 4.03975 9.00001 4.59961 9.00001L7 9M10 11H15.4C15.96 11 16.242 11 16.456 11.109C16.6441 11.2049 16.7948 11.3577 16.8906 11.5459C16.9996 11.7598 16.9996 12.0398 16.9996 12.5999L17.0011 15.0006M10 11L8.9248 9.61768C8.74861 9.39115 8.66017 9.27743 8.5498 9.1958C8.45201 9.12347 8.34303 9.06979 8.2259 9.037C8.09373 9.00001 7.9488 9.00001 7.66191 9.00001L7 9M7 5H19.4C19.9601 5 20.242 5 20.4559 5.10899C20.6441 5.20487 20.7948 5.35774 20.8906 5.5459C20.9996 5.75981 20.9996 6.03984 20.9996 6.59989V13.3999C20.9996 13.96 20.9996 14.24 20.8906 14.4539C20.7948 14.6421 20.6432 14.7952 20.4551 14.8911C20.2414 15 19.9613 15 19.4023 15L17.0011 15.0006M7 5V9M7 5L7 4.6001C7 4.04014 7 3.75979 7.10899 3.5459C7.20486 3.35774 7.35774 3.20487 7.5459 3.10899C7.75981 3 8.03956 3 8.59961 3H11.6615C11.9487 3 12.0913 3 12.2236 3.03701C12.3407 3.0698 12.452 3.12347 12.5498 3.1958C12.6602 3.27743 12.7486 3.39115 12.9248 3.61768L13.9999 4.99998" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

    ),
    label: 'Projects',
    path: '/client-dashboard/projects'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 11V20M9 11H4.59961C4.03956 11 3.75981 11 3.5459 11.109C3.35774 11.2049 3.20487 11.3577 3.10899 11.5459C3 11.7598 3 12.04 3 12.6001V20H9M9 11V5.6001C9 5.04004 9 4.75981 9.10899 4.5459C9.20487 4.35774 9.35774 4.20487 9.5459 4.10899C9.75981 4 10.0396 4 10.5996 4H13.3996C13.9597 4 14.2403 4 14.4542 4.10899C14.6423 4.20487 14.7948 4.35774 14.8906 4.5459C14.9996 4.75981 15 5.04005 15 5.6001V8M9 20H15M15 20L21 20.0001V9.6001C21 9.04005 20.9996 8.75981 20.8906 8.5459C20.7948 8.35774 20.6429 8.20487 20.4548 8.10899C20.2409 8 19.9601 8 19.4 8H15M15 20V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

    ),
    label: 'Reports & Analytics',
    path: '/client-dashboard/reports'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.59961 19.9203L7.12357 18.7012L7.13478 18.6926C7.45249 18.4384 7.61281 18.3101 7.79168 18.2188C7.95216 18.1368 8.12328 18.0771 8.2998 18.0408C8.49877 18 8.70603 18 9.12207 18H17.8031C18.921 18 19.4806 18 19.908 17.7822C20.2843 17.5905 20.5905 17.2842 20.7822 16.9079C21 16.4805 21 15.9215 21 14.8036V7.19691C21 6.07899 21 5.5192 20.7822 5.0918C20.5905 4.71547 20.2837 4.40973 19.9074 4.21799C19.4796 4 18.9203 4 17.8002 4H6.2002C5.08009 4 4.51962 4 4.0918 4.21799C3.71547 4.40973 3.40973 4.71547 3.21799 5.0918C3 5.51962 3 6.08009 3 7.2002V18.6712C3 19.7369 3 20.2696 3.21846 20.5433C3.40845 20.7813 3.69644 20.9198 4.00098 20.9195C4.35115 20.9191 4.76744 20.5861 5.59961 19.9203Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

    ),
    label: 'Messages',
    path: '/client-dashboard/messages'
  },
]

const accountItems = [
  {
    icon: (
      <Settings />
    ),
    label: 'Settings',
    path: '/client-dashboard/settings'
  },
]

export default function ClientSidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
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
        } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-40 w-64 transform border-r bg-white transition-transform duration-200 ease-in-out`}
      >
        <div className="flex h-16 items-center border-b px-6">
          <img src={logo} alt="TechSkims" />
        </div>
        <nav className="flex h-[calc(100vh-4rem)] flex-col justify-between p-4">
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
                  <span className="mr-3">{item.icon}</span>
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
                    className={`flex items-center rounded-[8px] h-[50px] px-4 py-2 text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-[#00A8E8] text-white'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-[8px] h-[50px] px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              <span className="mr-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15L15 12M15 12L12 9M15 12H4M9 7.24859V7.2002C9 6.08009 9 5.51962 9.21799 5.0918C9.40973 4.71547 9.71547 4.40973 10.0918 4.21799C10.5196 4 11.0801 4 12.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V16.8036C20 17.9215 20 18.4805 19.7822 18.9079C19.5905 19.2842 19.2837 19.5905 18.9074 19.7822C18.48 20 17.921 20 16.8031 20H12.1969C11.079 20 10.5192 20 10.0918 19.7822C9.71547 19.5905 9.40973 19.2839 9.21799 18.9076C9 18.4798 9 17.9201 9 16.8V16.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  )
}
