import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav
      className="flex justify-between items-center px-[5vw] py-[0.9rem] bg-white/97 border-b border-[var(--border)] sticky top-0 z-[300] backdrop-blur-[16px]"
      style={{ boxShadow: '0 2px 14px rgba(27,45,80,.07)' }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-[0.85rem] no-underline">
      
          <img src="https://www.unah.edu.hn/themes/portalunah-new/assets/images/logo-unah.png" alt="" srcset="" />
      
        <div>
          <div className="text-[0.90rem] text-black font-bold leading-[1.25]" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
            Lab. Topografía, Suelos y Materiales
          </div>
          <div className="text-[0.60rem] text-[var(--gray)] uppercase tracking-[1px] mt-[0.1rem]" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
            Depto. Ingeniería Civil — UNAH
          </div>
        </div>
      </Link>

      {/* Links */}
      <ul className="hidden lg:flex gap-8 list-none items-center">
        <li>
          <NavLink
            to="/normas"
            className={({ isActive }) =>
              `text-[0.76rem] tracking-[0.5px] uppercase font-medium no-underline transition-colors duration-200 ${isActive ? 'text-[var(--blue)] font-bold' : 'text-[var(--gray-dk)] hover:text-[var(--blue)]'}`
            }
          >
            Normas Aplicadas
          </NavLink>
        </li>
        <li>
          <a href="/#servicios" className="text-[0.76rem] tracking-[0.5px] uppercase font-medium no-underline text-[var(--gray-dk)] hover:text-[var(--blue)] transition-colors duration-200">
            Servicios
          </a>
        </li>
        <li>
          <a href="/#equipos" className="text-[0.76rem] tracking-[0.5px] uppercase font-medium no-underline text-[var(--gray-dk)] hover:text-[var(--blue)] transition-colors duration-200">
            Equipos
          </a>
        </li>
        <li>
          <a href="/#proceso" className="text-[0.76rem] tracking-[0.5px] uppercase font-medium no-underline text-[var(--gray-dk)] hover:text-[var(--blue)] transition-colors duration-200">
            Proceso
          </a>
        </li>
        <li>
          <a
            href="/#cotizacion"
            className="text-[0.76rem] tracking-[0.5px] uppercase font-semibold no-underline text-white bg-[var(--blue)] px-[1.3rem] py-[0.55rem] rounded-[7px] transition-colors duration-200 hover:bg-black"
          >
            ✉ Cotizar
          </a>
        </li>
      </ul>
    </nav>
  )
}
