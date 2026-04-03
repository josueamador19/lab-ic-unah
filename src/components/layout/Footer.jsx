export default function Footer() {
  return (
    <footer
      style={{
        background: '#1a3a5c',
        borderTop: '3px solid #f5a623',
        fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
        padding: '2.5rem 5vw 1.5rem',
        color: '#c8d8e8',
      }}
    >
      {/* Fila principal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>

        {/* Logo UNAH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="28" cy="28" rx="27" ry="27" stroke="#c8d8e8" strokeWidth="1.5" fill="none"/>
            <ellipse cx="28" cy="28" rx="22" ry="22" stroke="#c8d8e8" strokeWidth="0.8" fill="none"/>
            <rect x="26.5" y="18" width="3" height="16" rx="1" fill="#c8d8e8"/>
            <ellipse cx="28" cy="17" rx="4" ry="5" fill="#f5a623" opacity="0.85"/>
            <rect x="24" y="34" width="8" height="2.5" rx="1" fill="#c8d8e8"/>
            <rect x="25.5" y="36.5" width="5" height="1.5" rx="0.5" fill="#c8d8e8"/>
            <text x="28" y="44.5" textAnchor="middle" fontSize="5" fill="#c8d8e8" fontFamily="serif" letterSpacing="0.5">1847</text>
          </svg>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.05em', lineHeight: 1 }}>UNAH</div>
            <div style={{ fontSize: '0.6rem', color: '#a0bcd0', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.3 }}>
              Universidad Nacional<br />Autónoma de Honduras
            </div>
          </div>
        </div>

        {/* Badges de acreditación */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          {/* QS */}
          <div style={{ border: '1.5px solid rgba(200,216,232,0.4)', borderRadius: '50%', width: 58, height: 58, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
            <div style={{ fontSize: '0.45rem', color: '#a0bcd0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>QS</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>20</div>
            <div style={{ fontSize: '0.38rem', color: '#f5a623', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2 }}>RANKED<br />2024</div>
          </div>
          {/* Acreditación */}
          <div style={{ border: '1.5px solid rgba(200,216,232,0.4)', borderRadius: '50%', width: 58, height: 58, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke="#c8d8e8" strokeWidth="1"/>
              <path d="M11 5 L13 9 L18 9.5 L14.5 13 L15.5 18 L11 15.5 L6.5 18 L7.5 13 L4 9.5 L9 9 Z" fill="#f5a623" opacity="0.7"/>
            </svg>
            <div style={{ fontSize: '0.38rem', color: '#a0bcd0', textAlign: 'center', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Acred.<br />Intl.</div>
          </div>
          {/* Scimago */}
          <div style={{ border: '1.5px solid rgba(200,216,232,0.4)', borderRadius: 6, width: 64, height: 58, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 4, gap: 1 }}>
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <rect x="0" y="8" width="3" height="6" rx="0.5" fill="#c8d8e8"/>
              <rect x="4.5" y="5" width="3" height="9" rx="0.5" fill="#c8d8e8"/>
              <rect x="9" y="2" width="3" height="12" rx="0.5" fill="#c8d8e8"/>
              <rect x="13.5" y="0" width="3" height="14" rx="0.5" fill="#c8d8e8"/>
            </svg>
            <div style={{ fontSize: '0.38rem', color: '#f5a623', textAlign: 'center', lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>Ranking<br />Mundial<br />Scimago</div>
            <div style={{ fontSize: '0.38rem', color: '#a0bcd0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>UNAH 2023</div>
          </div>
        </div>

        {/* Texto Lab IC */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
            Lab IC — <span style={{ color: '#f5a623' }}>UNAH</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#a0bcd0', lineHeight: 1.6, fontFamily: "'JetBrains Mono',monospace", marginTop: '0.25rem' }}>
            Laboratorio de Topografía, Suelos y Materiales<br />
            Depto. Ingeniería Civil
          </div>
        </div>
      </div>

      {/* Separador */}
      <div style={{ borderTop: '1px solid rgba(200,216,232,0.18)', marginBottom: '1rem' }} />

      {/* Pie de página */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.68rem', color: 'rgba(160,188,208,0.7)', fontFamily: "'JetBrains Mono',monospace" }}>
          Derechos reservados Universidad Nacional Autónoma de Honduras 2017<br />
          Desarrollado por la <span style={{ color: '#f5a623' }}>Dirección Ejecutiva de Gestión de Tecnología</span>
        </div>
        <div style={{ fontSize: '0.65rem', color: 'rgba(140,165,200,0.55)', fontFamily: "'JetBrains Mono',monospace", textAlign: 'right' }}>
          © {new Date().getFullYear()} Lab IC UNAH<br />Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
}