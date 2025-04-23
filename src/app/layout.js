'use client';

import Link from 'next/link';
import Head from 'next/head';
import './globals.css';
import { IoCalendarNumber } from "react-icons/io5";
import { GiTeacher } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { FaSchoolFlag } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { MdContactPhone } from "react-icons/md";
import { IoBook } from "react-icons/io5";
import { useActiveRoute } from '../hooks/useActiveRoute';

const Navigation = () => {
  const { isActive } = useActiveRoute();

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1 className="nav-title">Academia FyL</h1>
      </div>
      <ul className="nav-links">
        <li>
          <Link href="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
            <MdDashboard className="nav-icon" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/academias" className={`nav-item ${isActive('/academias') ? 'active' : ''}`}>
            <FaSchoolFlag className="nav-icon" />
            <span>Academias</span>
          </Link>
        </li>
        <li>
          <Link href="/alumnos" className={`nav-item ${isActive('/alumnos') ? 'active' : ''}`}>
            <PiStudentFill className="nav-icon" />
            <span>Alumnos</span>
          </Link>
        </li>
        <li>
          <Link href="/profesores" className={`nav-item ${isActive('/profesores') ? 'active' : ''}`}>
            <GiTeacher className="nav-icon" />
            <span>Profesores</span>
          </Link>
        </li>
        <li>
          <Link href="/asignaturas" className={`nav-item ${isActive('/asignaturas') ? 'active' : ''}`}>
            <IoBook className="nav-icon" />
            <span>Asignaturas</span>
          </Link>
        </li>
        <li>
          <Link href="/contactos" className={`nav-item ${isActive('/contactos') ? 'active' : ''}`}>
            <MdContactPhone className="nav-icon" />
            <span>Contactos</span>
          </Link>
        </li>
        <li>
          <Link href="/horarios" className={`nav-item ${isActive('/horarios') ? 'active' : ''}`}>
            <IoCalendarNumber className="nav-icon" />
            <span>Horarios</span>
          </Link>
        </li>
      </ul>
      <div className="nav-footer">
        <Link href="/configuracion" className={`nav-item ${isActive('/configuracion') ? 'active' : ''}`}>
          <IoMdSettings className="nav-icon" />
          <span>Configuración</span>
        </Link>
      </div>
    </nav>
  );
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <div className="layout">
          <Navigation />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
