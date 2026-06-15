import { useState } from 'react'
import { Link } from 'react-router-dom'


const LOGO_UNAH = 'https://www.unah.edu.hn/themes/portalunah-new/assets/images/logo-unah.png'
const LOGO_IC   = 'https://dircom.unah.edu.hn/dmsdocument/13691-ingenieria-civil-color-png'

const LINKS = [
  { href: '/#normas',    label: 'Normas' },
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#equipos',   label: 'Equipos' },
  { href: '/#proceso',   label: 'Proceso' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav
      className="sticky top-0 z-[300] bg-white/97 border-b border-[var(--border)]"
      style={{ boxShadow: '0 2px 14px rgba(27,45,80,.07)', backdropFilter: 'blur(16px)' }}
    >
      <div className="flex justify-between items-center px-[5vw] py-[0.9rem]">

        {/* Logo */}
        <Link to="/" className="flex items-center no-underline" style={{ gap: '0.75rem', padding: '0.6rem 0' }} onClick={() => setOpen(false)}>
          <img src={LOGO_UNAH} alt="UNAH" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
          <img src={LOGO_IC}   alt="Ingeniería Civil UNAH" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
          <div style={{ paddingLeft: '0.25rem' }} className="hidden sm:block">
            <div style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: '0.72rem', color: '#4a5e78', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              Laboratorio de
            </div>
            <div style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: '1rem', color: '#000', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.2px', textTransform: 'uppercase' }}>
              Topografía, Suelos y Materiales
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex gap-8 list-none items-center">
          {LINKS.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-[0.76rem] tracking-[0.5px] uppercase font-medium no-underline text-[var(--gray-dk)] hover:text-[var(--blue)] transition-colors duration-200">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/#cotizacion" className="text-[0.76rem] tracking-[0.5px] uppercase font-semibold no-underline text-white bg-[var(--blue)] px-[1.3rem] py-[0.55rem] rounded-[7px] transition-colors duration-200 hover:bg-black">
              ✉ Cotizar
            </a>
          </li>
          <li>
            <Link to="/admin" className="text-[0.72rem] tracking-[0.5px] uppercase font-medium no-underline text-[var(--gray-dk)] border border-[var(--border)] px-[0.9rem] py-[0.45rem] rounded-[7px] transition-colors duration-200 hover:border-[var(--blue)] hover:text-[var(--blue)]">
              ⚙ Admin
            </Link>
          </li>
        </ul>

        {/* Hamburger button */}
        <button
          className="lg:hidden flex flex-col justify-center items-center gap-[5px] p-2 rounded-[8px] border-0 bg-transparent cursor-pointer"
          onClick={() => setOpen(o => !o)}
          aria-label="Menú"
        >
          <span style={{ display: 'block', width: 24, height: 2, background: open ? 'transparent' : '#1e3a8a', transition: 'all 0.2s', transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 24, height: 2, background: '#1e3a8a', transition: 'opacity 0.2s', opacity: open ? 0 : 1 }} />
          <span style={{ display: 'block', width: 24, height: 2, background: open ? 'transparent' : '#1e3a8a', transition: 'all 0.2s', transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-[var(--border)] px-[5vw] py-4" style={{ background: '#fff' }}>
          <ul className="list-none flex flex-col gap-2">
            {LINKS.map(l => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block text-[0.85rem] tracking-[0.5px] uppercase font-medium no-underline text-[var(--gray-dk)] py-3 border-b border-[var(--border)]"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="/#cotizacion"
                className="block text-center text-[0.85rem] tracking-[0.5px] uppercase font-semibold no-underline text-white bg-[var(--blue)] px-4 py-3 rounded-[8px]"
                onClick={() => setOpen(false)}
              >
                ✉ Cotizar
              </a>
            </li>
            <li>
              <Link
                to="/admin"
                className="block text-center text-[0.85rem] tracking-[0.5px] uppercase font-medium no-underline text-[var(--gray-dk)] border border-[var(--border)] px-4 py-3 rounded-[8px]"
                onClick={() => setOpen(false)}
              >
                ⚙ Admin
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
