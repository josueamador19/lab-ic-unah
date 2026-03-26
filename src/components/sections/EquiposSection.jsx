import { EQUIPOS } from '../../data/labData'

const BG_GRADIENTS = [
  'linear-gradient(135deg,#0d1b35,#002C9E)',
  'linear-gradient(135deg,#1a2a10,#003a00)',
  'linear-gradient(135deg,#3a1a00,#6b2a00)',
  'linear-gradient(135deg,#1a0030,#3d0070)',
]

export default function EquiposSection() {
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

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
        {EQUIPOS.map((eq, i) => (
          <div key={i} className="rounded-[16px] overflow-hidden" style={{ background: 'var(--white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>

            {/* Visual: imagen si existe, gradiente de fallback si no */}
            <div className="h-[180px] overflow-hidden" style={{ background: BG_GRADIENTS[i % BG_GRADIENTS.length] }}>
              {eq.img ? (
                <img
                  src={eq.img}
                  alt={eq.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />
              ) : (
                // Placeholder hasta que lleguen las imágenes
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    background: BG_GRADIENTS[i % BG_GRADIENTS.length],
                  }}
                >
                  <span style={{ fontSize: '2.4rem', opacity: 0.5 }}>
                    {['🌐', '🏗', '⚙', '🔧'][i]}
                  </span>
                  <span style={{
                    fontSize: '0.6rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  }}>
                    Imagen próximamente
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {eq.badge && (
                <span className="norma-tag mb-3 inline-block">{eq.badge}</span>
              )}
              <h3 className="font-bold mb-2" style={{ fontSize: '1rem', color: 'var(--navy)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
                {eq.title}
              </h3>
              <p className="text-[0.83rem] leading-[1.7] mb-4" style={{ color: 'var(--gray-dk)' }}>
                {eq.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {eq.specs && eq.specs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {eq.specs.map((spec, j) => (
                      <span key={j} className="text-[0.65rem] px-2 py-1 rounded-[4px]" style={{ background: 'var(--blue-pale)', color: 'var(--blue)', fontFamily: 'JetBrains Mono,monospace' }}>
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  )
}