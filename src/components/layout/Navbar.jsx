import { Link, NavLink } from 'react-router-dom'

const LOGO_UNAH = 'https://www.unah.edu.hn/themes/portalunah-new/assets/images/logo-unah.png'
const LOGO_IC = 'https://dircom.unah.edu.hn/dmsdocument/13691-ingenieria-civil-color-png'

export default function Navbar() {
  return (
    <nav
      className="flex justify-between items-center px-[5vw] py-[0.9rem] bg-white/97 border-b border-[var(--border)] sticky top-0 z-[300] backdrop-blur-[16px]"
      style={{ boxShadow: '0 2px 14px rgba(27,45,80,.07)' }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center no-underline" style={{ gap: '0.75rem', padding: '0.6rem 0' }}>
        {/* Logo UNAH */}
        <img
          src={LOGO_UNAH}
          alt="UNAH"
          style={{ height: 56, width: 'auto', objectFit: 'contain' }}
        />
        {/* Logo Ingeniería Civil */}
        <img
          src={LOGO_IC}
          alt="Ingeniería Civil UNAH"
          style={{ height: 56, width: 'auto', objectFit: 'contain' }}
        />

    
        {/* Texto */}
        <div style={{ paddingLeft: '0.25rem' }}>
          <div
            style={{
              fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
              fontSize: '0.72rem',
              color: '#4a5e78',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              marginBottom: '0.2rem',
            }}
          >
            Laboratorio de
          </div>
          <div
            style={{
              fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
              fontSize: '1rem',
              color: '#000',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.2px',
              textTransform: 'uppercase',
            }}
          >
            Topografía, Suelos y Materiales
          </div>
        </div>
      </Link>

      {/* Links */}
      <ul className="hidden lg:flex gap-8 list-none items-center">
        <li>
          <a href="/#normas" className="text-[0.76rem] tracking-[0.5px] uppercase font-medium no-underline text-[var(--gray-dk)] hover:text-[var(--blue)] transition-colors duration-200">
            Normas Aplicadas
          </a>
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
