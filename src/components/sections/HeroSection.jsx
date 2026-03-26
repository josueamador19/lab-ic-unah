import bgVideo from '../../assets/hero-video.mp4'
import pumaImg from '../../assets/puma_sin_fondo.png'

const BG_VIDEO_SRC = bgVideo
const PUMA_IMG_SRC = pumaImg

const STATS = [
  { num: '20+',              label: 'Tipos de Ensayo'     },
  { num: '5',                label: 'Categorías'          },
  { num: 'ASTM / AASHTO',   label: 'Normas Aplicadas'    },
  { num: 'UNAH / FUNDAUNAH', label: 'En Colaboración Con' },
]

const font = 'Helvetica Neue, Helvetica, Arial, sans-serif'

export default function HeroSection() {
  return (
    <div style={{ minHeight: '10vh', maxHeight:'90vh', background: '#0a1628', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* VIDEO BG */}
      <video
        src={BG_VIDEO_SRC}
        autoPlay muted loop playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.90, zIndex: 0 }}
      />

      {/* OVERLAY */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(105deg, rgba(10, 22, 50, 0.95) 0%, rgba(10, 22, 50, 0.85) 50%, rgb(0 30 120 / 24%) 100%)',
      }} />

      {/* FADE BOTTOM */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, zIndex: 2,
        background: 'linear-gradient(to top, #0a1628, transparent)',
      }} />

      {/* MAIN BODY */}
      <div style={{
        position: 'relative', zIndex: 3,
        display: 'flex', flex: 1,
        padding: '5rem 5vw', gap: '2rem',
      }}>

        {/* LEFT */}
        <div style={{ flex: '1 1 0', minWidth: 0 }}>

          <div style={{
            fontFamily: font, fontWeight: 700,
            fontSize: '0.65rem', letterSpacing: '3px',
            textTransform: 'uppercase', color: '#FFE033',
            marginBottom: 22,
          }}>
            PLAN DE REACTIVACIÓN — VENTA DE SERVICIOS 2026
          </div>

          <h1 style={{
            fontFamily: font, fontWeight: 900,
            fontSize: 'clamp(2rem, 3.8vw, 3.6rem)',
            lineHeight: 1.05, color: '#ffffff',
            margin: '0 0 24px', letterSpacing: '-0.5px',
          }}>
            Laboratorio de
            <span style={{ display: 'block' }}>Topografía</span>
            <span style={{ display: 'block' }}>
              Suelos y <em style={{ color: '#FFE033', fontStyle: 'normal' }}>Materiales</em>
            </span>
          </h1>

          <p style={{
            fontFamily: font, fontSize: '0.85rem', lineHeight: 1.75,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)',
            maxWidth: 460, marginBottom: 34,
          }}>
            Ensayos de suelos, concreto, agregados, acero y servicios de topografía
            para proyectos de construcción e infraestructura. Bajo normas ASTM y AASHTO.
            <br />UNAH / FUNDAUNAH.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a
              href="#cotizacion"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: font, fontWeight: 700, fontSize: '0.88rem',
                padding: '0.85rem 1.8rem', borderRadius: 8,
                background: '#FFE033', color: '#0a1628',
                textDecoration: 'none',
                transition: 'transform .15s, box-shadow .15s',
                boxShadow: '0 6px 20px rgba(255,224,51,0)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(255,224,51,0.45)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,224,51,0)'
              }}
            >
              ✉ Solicitar Cotización
            </a>

            <a
              href="#servicios"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: font, fontWeight: 600, fontSize: '0.88rem',
                padding: '0.85rem 1.8rem', borderRadius: 8,
                background: '#1A44A8', color: '#ffffff',
                textDecoration: 'none', border: '1px solid #1A44A8',
                transition: 'background .15s, border-color .15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1535A0'
                e.currentTarget.style.borderColor = '#1535A0'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#1A44A8'
                e.currentTarget.style.borderColor = '#1A44A8'
              }}
            >
              Conocer Servicios
            </a>
          </div>
        </div>

        {/* RIGHT: puma */}
        <div style={{
          flex: '0 0 auto',
          display: 'flex', alignItems: 'flex-end', alignSelf: 'stretch',
          justifyContent: 'flex-end',
        }}>
          <img
            src={PUMA_IMG_SRC}
            alt="Mascota Puma"
            style={{
              height: 'clamp(28px, 100%, 500px)',
              width: 'auto',
              maxWidth: '40vw',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 16px 36px rgba(0,0,0,0.6))',
              alignSelf: 'flex-start',
            }}
          />
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{
        position: 'relative', zIndex: 3,
        display: 'flex', background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -4px 20px rgba(10,22,50,0.1)',
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            flex: 1,
            padding: '1.3rem 1.5rem',
            paddingLeft: i === 0 ? '5vw' : '1.5rem',
            borderRight: i < STATS.length - 1 ? '1px solid #e2e8f0' : 'none',
          }}>
            <div style={{ fontFamily: font, fontWeight: 900, fontSize: '1.4rem', color: '#1A44A8' }}>
              {s.num}
            </div>
            <div style={{ fontFamily: font, fontSize: '0.6rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#6b7280', marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}