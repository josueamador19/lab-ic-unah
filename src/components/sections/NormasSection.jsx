import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h3 className="font-bold whitespace-nowrap text-[1.2rem]" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', color: 'var(--navy)' }}>
        {label}
      </h3>
      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
    </div>
  )
}

export default function NormasSection() {
  const [cards,   setCards]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/v1/normas`)
      .then(r => r.json())
      .then(({ data }) => setCards(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="normas">

      {/* HERO de sección */}
      <div className="relative overflow-hidden px-[5vw] py-16" style={{ background: 'linear-gradient(110deg,#000 0%,#002C9E 100%)' }}>
        <div className="absolute pointer-events-none rounded-full" style={{ top: -60, right: -80, width: 400, height: 400, background: 'rgba(255,255,255,.04)' }} />
        <div className="absolute pointer-events-none rounded-full" style={{ bottom: -100, left: '10%', width: 300, height: 300, background: 'rgba(255,255,0,.08)' }} />

        <div className="flex items-center gap-3 mb-4 text-[0.65rem] tracking-[3px] uppercase" style={{ color: '#FFFF00', fontFamily: 'JetBrains Mono,monospace' }}>
          <span className="inline-block w-6 h-[2px]" style={{ background: '#FFFF00' }} />
          Marco Normativo
        </div>

        <h2 className="font-black mb-4 text-white" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: 'clamp(2rem,4.5vw,3.5rem)', lineHeight: 1.1, letterSpacing: '-0.3px' }}>
          Normas <em style={{ color: '#FFFF00', fontStyle: 'normal' }}>Aplicadas</em>
        </h2>
        <p className="text-[0.92rem] max-w-[560px] leading-[1.8]" style={{ color: 'rgba(255,255,255,.72)' }}>
          Estándares técnicos internacionales y nacionales bajo los cuales se ejecutan todos los ensayos del Laboratorio IC — UNAH.
        </p>
      </div>

      {/* CONTENIDO */}
      <div className="px-[5vw] py-16">
        <div className="mb-10">
          <div className="text-[0.64rem] tracking-[3px] uppercase mb-1" style={{ color: 'var(--blue-soft)', fontFamily: 'JetBrains Mono,monospace' }}>
            // Organismos de Normalización
          </div>
          <h3 className="font-black mb-2" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: 'var(--navy)', letterSpacing: '-0.2px' }}>
            Normas de Referencia
          </h3>
          <p className="text-[0.88rem] leading-[1.75] max-w-[700px]" style={{ color: 'var(--gray-dk)' }}>
            El laboratorio opera bajo un conjunto de normas técnicas reconocidas internacionalmente, garantizando la validez y reproducibilidad de cada ensayo realizado.
          </p>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray)' }}>Cargando normas…</div>}

        <div className="grid gap-6 mb-14" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
          {cards.map((card) => (
            <div
              key={card.id}
              className="rounded-[16px] overflow-hidden transition-all duration-200 hover:-translate-y-[3px]"
              style={{ background: 'var(--white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-lg)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
            >
              <div className="flex items-center gap-4 px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
                <div
                  className="w-[52px] h-[52px] rounded-[12px] flex items-center justify-center font-bold text-center text-[0.72rem] flex-shrink-0 leading-[1.2]"
                  style={{ fontFamily: 'JetBrains Mono,monospace', ...card.icon.style }}
                >
                  {card.icon.text}
                </div>
                <div>
                  <div className="font-bold leading-[1.25] text-[1.05rem]" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', color: 'var(--navy)' }}>
                    {card.title}
                  </div>
                  <div className="mt-[0.2rem] text-[0.68rem] tracking-[0.5px]" style={{ color: 'var(--gray)', fontFamily: 'JetBrains Mono,monospace' }}>
                    {card.sub}
                  </div>
                </div>
              </div>

              <div className="px-6 py-5">
                <p className="text-[0.83rem] leading-[1.72] mb-5" style={{ color: 'var(--gray-dk)' }}>
                  {card.desc}
                </p>
                <div className="flex flex-wrap gap-[0.4rem]">
                  {card.tags.map((tag) => (
                    <span key={tag} className="norma-tag-green">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
