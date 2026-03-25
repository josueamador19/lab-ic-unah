export default function Footer() {
  return (
    <footer
      className="flex justify-between items-center flex-wrap gap-6 px-[5vw] py-10"
      style={{ background: 'var(--navy)', borderTop: '3px solid var(--gold)' }}
    >
      <div className="text-[var(--gray-lt)] font-bold text-base" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
        Lab IC — <span style={{ color: 'var(--gold-lt)' }}>UNAH</span>
      </div>
      <div className="text-[0.75rem] text-[var(--gray)] text-center leading-[1.7]" style={{ fontFamily: 'JetBrains Mono,monospace' }}>
        Laboratorio de Topografía, Suelos y Materiales<br />
        Depto. Ingeniería Civil — Universidad Nacional Autónoma de Honduras
      </div>
      <div className="text-[0.66rem] text-right leading-[1.6]" style={{ color: 'rgba(140,165,200,.55)', fontFamily: 'JetBrains Mono,monospace' }}>
        © {new Date().getFullYear()} Lab IC UNAH<br />
        Todos los derechos reservados
      </div>
    </footer>
  )
}
