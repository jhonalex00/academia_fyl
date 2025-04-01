import Link from 'next/link';
import './globals.css';
import { IoCalendarNumber } from "react-icons/io5";
import { GiTeacher } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { FaSchoolFlag } from "react-icons/fa6";

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        <li><FaSchoolFlag size={100} /></li>
        <li><IoCalendarNumber size={100} /></li>
        <li><GiTeacher size={100} /></li>
        <li><PiStudentFill size={100} /></li>

        <li><Link href="/pages/dashboard">Dashboard</Link></li>
        <li><Link href="/pages/alumnos">Alumnos</Link></li>
        <li><Link href="/pages/contactos">Contactos</Link></li>
        <li><Link href="/pages/profesores">Profesores</Link></li>
        <li><Link href="/pages/asignaturas">Asignaturas</Link></li>
      </ul>
    </nav>
  );
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <Navigation />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
