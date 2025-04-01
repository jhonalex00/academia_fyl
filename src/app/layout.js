import Link from 'next/link';
import './globals.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
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
