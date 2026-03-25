import { STATS } from '../../data/labData'

const MOSAIC_IMAGES = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&h=120&fit=crop',
  'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=200&h=120&fit=crop',
]

const strips = [
  { cls: 'mstrip-u1', imgs: [0, 1, 2, 0, 1, 2] },
  { cls: 'mstrip-u2', imgs: [3, 4, 5, 3, 4, 5] },
  { cls: 'mstrip-u3', imgs: [1, 3, 0, 1, 3, 0] },
  { cls: 'mstrip-d1', imgs: [2, 5, 4, 2, 5, 4] },
  { cls: 'mstrip-d2', imgs: [4, 0, 3, 4, 0, 3] },
]

export default function HeroSection() {
  return (
    <div className="min-h-[90vh] flex flex-col relative overflow-hidden">
      {/* Mosaic BG */}
      <div className="absolute inset-0 overflow-hidden z-0" style={{ background: '#091628' }}>
        <div className="flex h-full w-full" style={{ gap: '5px' }}>
          {strips.map((s, i) => (
            <div key={i} className="flex-1 overflow-hidden">
              <div className={`flex flex-col ${s.cls}`} style={{ gap: '5px' }}>
                {s.imgs.map((imgIdx, j) => (
                  <div key={j} className="flex-shrink-0 rounded-[9px] overflow-hidden" style={{ height: '140px', background: '#091628' }}>
                    <img src={MOSAIC_IMAGES[imgIdx]} alt="" className="w-full h-full object-cover opacity-60" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(110deg,rgba(27,45,80,.92) 0%,rgba(27,45,80,.78) 50%,rgba(0,44,158,.45) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-[180px] z-[2]" style={{ background: 'linear-gradient(to top,var(--bg),transparent)' }} />

      {/* Body */}
      <div className="relative z-[3] flex items-center flex-1 px-[5vw] py-[5rem] gap-12">
        <div className="flex-1 max-w-[620px]">
          <div className="flex items-center gap-3 mb-5 text-[0.65rem] tracking-[3px] uppercase" style={{ color: 'var(--gold-lt)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
            <span className="w-6 h-[2px]" style={{ background: 'var(--gold-lt)', display: 'inline-block' }} />
            Laboratorio de Ingeniería Civil · UNAH
          </div>

          <h1 className="font-black leading-[1.1] text-white mb-6" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: 'clamp(1.8rem,3.8vw,3.6rem)', letterSpacing: '-0.5px' }}>
            Ensayos de{' '}
            <em style={{ color: 'var(--gold-lt)', fontStyle: 'normal' }}>Materiales</em>
            {' '}&amp;{' '}
            <em style={{ color: 'var(--gold-lt)', fontStyle: 'normal' }}>Topografía</em>
          </h1>

          <p className="text-[0.95rem] leading-[1.8] max-w-[490px] mb-9 uppercase" style={{ color: 'rgba(255,255,255,.75)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
            Servicios técnicos especializados bajo normas ASTM, AASHTO y ACI para proyectos de infraestructura en Honduras.
          </p>

          <div className="flex gap-4 flex-wrap">
            <a
              href="#cotizacion"
              className="inline-flex items-center gap-2 font-bold text-[0.86rem] px-8 py-[0.9rem] rounded-[8px] no-underline transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'var(--gold)', color: 'var(--navy)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', boxShadow: '0 10px 24px rgba(255,255,0,0)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 24px rgba(255,255,0,.4)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 10px 24px rgba(255,255,0,0)'}
            >
              ✉ Solicitar Cotización
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center gap-2 font-medium text-[0.86rem] px-8 py-[0.9rem] rounded-[8px] no-underline text-white transition-all duration-200"
              style={{ background: 'var(--blue)', border: '1px solid var(--blue)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1A44A8'; e.currentTarget.style.borderColor = '#1A44A8' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue)'; e.currentTarget.style.borderColor = 'var(--blue)' }}
            >
              Ver Catálogo
            </a>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-[3] flex bg-white overflow-visible" style={{ borderTop: '1px solid var(--border)', boxShadow: '0 6px 20px rgba(27,45,80,.09)' }}>
        {STATS.map((s, i) => (
          <div
            key={i}
            className="flex-1 py-[1.35rem] pl-8"
            style={{ borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none', paddingLeft: i === 0 ? '5vw' : undefined }}
          >
            <div className="text-[1.45rem] font-black" style={{ color: 'var(--blue)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>{s.num}</div>
            <div className="text-[0.63rem] tracking-[1.5px] uppercase mt-[0.1rem]" style={{ color: 'var(--gray)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
