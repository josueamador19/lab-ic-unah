import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const BG_GRADIENTS = [
  'linear-gradient(135deg,#0d1b35,#002C9E)',
  'linear-gradient(135deg,#1a2a10,#003a00)',
  'linear-gradient(135deg,#3a1a00,#6b2a00)',
  'linear-gradient(135deg,#1a0030,#3d0070)',
]

export default function EquiposSection() {
  const [equipos,  setEquipos]  = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/v1/equipos`)
      .then(r => r.json())
      .then(({ data }) => setEquipos(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="equipos" className="px-[5vw] py-20">
      <div className="flex justify-between items-end mb-10 pb-7 flex-wrap gap-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <div className="text-[0.64rem] tracking-[3px] uppercase mb-1" style={{ color: 'var(--blue-soft)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
            // Infraestructura Técnica
          </div>
          <h2 className="font-black" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: 'clamp(1.9rem,3.8vw,3rem)', color: 'var(--navy)', letterSpacing: '-0.3px' }}>
            Equipos y Capacidades
          </h2>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray)' }}>
          Cargando equipos…
        </div>
      )}

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
        {equipos.map((eq, i) => (
          <div key={eq.id} className="rounded-[16px] overflow-hidden" style={{ background: 'var(--white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>

            <div className="h-[180px] overflow-hidden" style={{ background: BG_GRADIENTS[i % BG_GRADIENTS.length] }}>
              {eq.img_url ? (
                <img
                  src={eq.img_url.startsWith('http') ? eq.img_url : `${API_URL}${eq.img_url}`}
                  alt={eq.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: BG_GRADIENTS[i % BG_GRADIENTS.length] }}>
                  <span style={{ fontSize: '2.4rem', opacity: 0.5 }}>{['🌐', '🏗', '⚙', '🔧'][i % 4]}</span>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    Imagen próximamente
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              {eq.badge && <span className="norma-tag mb-3 inline-block">{eq.badge}</span>}
              <h3 className="font-bold mb-2" style={{ fontSize: '1rem', color: 'var(--navy)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
                {eq.title}
              </h3>
              <p className="text-[0.83rem] leading-[1.7] mb-4" style={{ color: 'var(--gray-dk)' }}>
                {eq.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
