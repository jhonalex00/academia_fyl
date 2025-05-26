'use client';

import Link from 'next/link';
import { IoCalendarNumber } from "react-icons/io5";
import { MdMessage } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { useActiveRoute } from '../../hooks/useActiveRoute';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const FatherNavigation = () => {
  const { isActive } = useActiveRoute();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Si no hay usuario autenticado o no es padre, no mostrar la navegación
  if (!user || (user.role !== 'parent' && user.role !== 'contact')) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1 className="nav-title">Academia FyL</h1>
        <div className="text-sm text-gray-400 mt-1">
          {user?.name || 'Usuario'} (Padre/Tutor)
        </div>
      </div>
      <ul className="nav-links">
        <li>
          <Link 
            href="/father/horarios" 
            className={`nav-item ${pathname === '/father/horarios' ? 'active' : ''}`}
          >
            <IoCalendarNumber className="nav-icon" />
            <span>Horarios</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/father/mensajes" 
            className={`nav-item ${pathname === '/father/mensajes' ? 'active' : ''}`}
          >
            <MdMessage className="nav-icon" />
            <span>Mensajes</span>
          </Link>
        </li>
      </ul>
      <div className="nav-footer">
        <div className="flex flex-col space-y-2">
          <button onClick={handleLogout} className="nav-item text-red-500 hover:bg-red-50 w-full">
            <FiLogOut className="nav-icon" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default function FatherLayout({ children }) {
  return (
    <div className="layout">
      <FatherNavigation />
      <main>
        {children}
      </main>
    </div>
  );
} 