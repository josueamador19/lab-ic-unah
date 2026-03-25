import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { NORMAS_CARDS, ENSAYOS_NORMA } from '../data/labData'

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h3 className="font-bold whitespace-nowrap text-[1.2rem]"
        style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', color: 'var(--navy)' }}>
        {label}
      </h3>
      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
    </div>
  )
}

function EnsayoTable({ section }) {
  return (
    <div className="mb-10">
      <SectionDivider label={section.label} />
      <div className="rounded-[12px] overflow-hidden mb-8" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FFE800' }}>
              {section.cols.map((col, i) => (
                <th key={i}
                  className="text-left py-[0.8rem] px-[1.1rem] font-bold"
                  style={{
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: '0.6rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#1a2a10',
                    borderBottom: '2px solid #d4c400',
                    width: i === 0 ? 80 : undefined,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, i) => (
              <tr key={i} className="hover:bg-[var(--blue-lite)] transition-colors duration-150"
                style={{ borderBottom: i < section.rows.length - 1 ? '1px solid rgba(42,92,168,.06)' : 'none' }}>
                <td className="py-[0.85rem] px-[1.1rem] font-semibold whitespace-nowrap bg-white"
                  style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.72rem', color: 'var(--blue)' }}>
                  {row.code}
                </td>
                <td className="py-[0.85rem] px-[1.1rem] bg-white"
                  style={{ fontSize: '0.83rem', color: 'var(--navy)' }}>
                  {row.name}
                </td>
                <td className="py-[0.85rem] px-[1.1rem] bg-white">
                  {row.astm && <span className="norma-tag-green">{row.astm}</span>}
                </td>
                <td className="py-[0.85rem] px-[1.1rem] bg-white">
                  {row.aashto && <span className="norma-tag-green">{row.aashto}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function NormasPage() {
  return (
    <>
      <Navbar />

      {/* PAGE HERO */}
      <div className="relative overflow-hidden px-[5vw] py-16"
        style={{ background: 'linear-gradient(110deg,#000 0%,#002C9E 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute pointer-events-none rounded-full"
          style={{ top: -60, right: -80, width: 400, height: 400, background: 'rgba(255,255,255,.04)' }} />
        <div className="absolute pointer-events-none rounded-full"
          style={{ bottom: -100, left: '10%', width: 300, height: 300, background: 'rgba(255,255,0,.08)' }} />

        {/* Back link */}
        <Link to="/"
          className="inline-flex items-center gap-2 mb-6 no-underline transition-colors duration-200 text-[0.72rem] tracking-[1px] uppercase"
          style={{ color: 'rgba(255,255,255,.65)', fontFamily: 'JetBrains Mono,monospace' }}
          onMouseEnter={e => e.currentTarget.style.color = '#FFFF00'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.65)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver al Catálogo
        </Link>

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-4 text-[0.65rem] tracking-[3px] uppercase"
          style={{ color: '#FFFF00', fontFamily: 'JetBrains Mono,monospace' }}>
          <span className="inline-block w-6 h-[2px]" style={{ background: '#FFFF00' }} />
          Marco Normativo
        </div>

        <h1 className="font-black mb-4 text-white"
          style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: 'clamp(2rem,4.5vw,3.5rem)', lineHeight: 1.1, letterSpacing: '-0.3px' }}>
          Normas <em style={{ color: '#FFFF00', fontStyle: 'normal' }}>Aplicadas</em>
        </h1>
        <p className="text-[0.92rem] max-w-[560px] leading-[1.8]" style={{ color: 'rgba(255,255,255,.72)' }}>
          Estándares técnicos internacionales y nacionales bajo los cuales se ejecutan todos los ensayos del Laboratorio IC — UNAH.
        </p>
      </div>

      {/* PAGE CONTENT */}
      <div className="px-[5vw] py-16">

        {/* Section header */}
        <div className="mb-10">
          <div className="text-[0.64rem] tracking-[3px] uppercase mb-1"
            style={{ color: 'var(--blue-soft)', fontFamily: 'JetBrains Mono,monospace' }}>
            // Organismos de Normalización
          </div>
          <h2 className="font-black mb-2"
            style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: 'var(--navy)', letterSpacing: '-0.2px' }}>
            Normas de Referencia
          </h2>
          <p className="text-[0.88rem] leading-[1.75] max-w-[700px]" style={{ color: 'var(--gray-dk)' }}>
            El laboratorio opera bajo un conjunto de normas técnicas reconocidas internacionalmente, garantizando la validez y reproducibilidad de cada ensayo realizado.
          </p>
        </div>

        {/* Normas Grid */}
        <div className="grid gap-6 mb-14" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
          {NORMAS_CARDS.map(card => (
            <div key={card.id}
              className="rounded-[16px] overflow-hidden transition-all duration-200 hover:-translate-y-[3px]"
              style={{ background: 'var(--white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
            >
              {/* Header */}
              <div className="flex items-center gap-4 px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="w-[52px] h-[52px] rounded-[12px] flex items-center justify-center font-bold text-center text-[0.72rem] flex-shrink-0 leading-[1.2]"
                  style={{ fontFamily: 'JetBrains Mono,monospace', ...card.icon.style }}>
                  {card.icon.text}
                </div>
                <div>
                  <div className="font-bold leading-[1.25] text-[1.05rem]"
                    style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', color: 'var(--navy)' }}>
                    {card.title}
                  </div>
                  <div className="mt-[0.2rem] text-[0.68rem] tracking-[0.5px]"
                    style={{ color: 'var(--gray)', fontFamily: 'JetBrains Mono,monospace' }}>
                    {card.sub}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                <p className="text-[0.83rem] leading-[1.72] mb-5" style={{ color: 'var(--gray-dk)' }}>
                  {card.desc}
                </p>
                <div className="flex flex-wrap gap-[0.4rem]">
                  {card.tags.map(tag => (
                    <span key={tag} className="norma-tag-green">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ensayos por norma */}
        <div className="mt-12">
          <div className="text-[0.64rem] tracking-[3px] uppercase mb-1"
            style={{ color: 'var(--blue-soft)', fontFamily: 'JetBrains Mono,monospace' }}>
            // Relación Ensayo — Norma
          </div>
          <h2 className="font-black mb-2"
            style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: 'var(--navy)', letterSpacing: '-0.2px' }}>
            Ensayos y su Normativa
          </h2>
          <p className="text-[0.88rem] leading-[1.75] max-w-[700px] mb-10" style={{ color: 'var(--gray-dk)' }}>
            Tabla de referencia cruzada entre cada ensayo ofrecido y las normas técnicas bajo las que se ejecuta.
          </p>

          {Object.values(ENSAYOS_NORMA).map((section, i) => (
            <EnsayoTable key={i} section={section} />
          ))}
        </div>

        {/* Info box */}
        <div className="flex gap-5 items-start p-7 rounded-[12px] mt-4"
          style={{ background: 'var(--blue-pale)', border: '1px solid rgba(0,44,158,.2)' }}>
          <div className="text-[1.4rem] flex-shrink-0 mt-[0.1rem]">ℹ️</div>
          <p className="text-[0.83rem] leading-[1.75]" style={{ color: 'var(--navy)' }}>
            El laboratorio se encuentra en proceso de fortalecimiento de su sistema de calidad bajo los lineamientos de{' '}
            <strong style={{ color: 'var(--blue)' }}>ISO/IEC 17025</strong>.
            Para consultas sobre la validez técnica de los resultados o la aplicabilidad de una norma específica para su proyecto,
            contáctenos en{' '}
            <strong style={{ color: 'var(--blue)' }}>
              <a href="mailto:laboratorio.ic@unah.edu.hn" style={{ color: 'var(--blue)', textDecoration: 'none' }}>
                laboratorio.ic@unah.edu.hn
              </a>
            </strong>.
          </p>
        </div>
      </div>

      <Footer />
    </>
  )
}
