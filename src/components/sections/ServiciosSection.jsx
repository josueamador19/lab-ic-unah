import { useState, useRef } from 'react'
import { SERVICIOS, TOPOGRAFIA } from '../../data/labData'

const TABS = [
  { key: 'all',       label: 'Todos' },
  { key: 'suelos',    label: '⛏ Suelos' },
  { key: 'concreto',  label: '🏗 Concreto' },
  { key: 'agregados', label: '⚙ Agregados' },
  { key: 'acero',     label: '🔩 Acero' },
  { key: 'topografia',label: '🗺 Topografía' },
]

function SvcTable({ items, onSelect, selectedCodes }) {
  const [flashing, setFlashing] = useState({})

  const handleClick = (code) => {
    if (selectedCodes.includes(code)) return
    onSelect(code)
    setFlashing(prev => ({ ...prev, [code]: true }))
    setTimeout(() => setFlashing(prev => {
      const next = { ...prev }
      delete next[code]
      return next
    }), 1800)
  }

  return (
    <table className="svc-table">
      <thead>
        <tr>
          <th style={{ width: 88 }}>Código</th>
          <th>Ensayo</th>
          <th style={{ width: 200 }}>Norma Técnica</th>
          <th className="r" style={{ width: 88 }}>Cotizar</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => {
          const isAdded    = selectedCodes.includes(item.code)
          const isFlashing = flashing[item.code]
          return (
            <tr key={item.code}>
              <td>
                <span
                  className="text-[0.72rem] font-semibold whitespace-nowrap"
                  style={{ color: 'var(--blue)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}
                >
                  {item.code}
                </span>
              </td>
              <td>
                <div>{item.name}</div>
                {item.sub && (
                  <div className="text-[0.71rem] italic mt-[0.18rem]" style={{ color: 'var(--gray)' }}>
                    {item.sub}
                  </div>
                )}
              </td>
              <td><span className="norma-tag">{item.norma}</span></td>
              <td className="text-right">
                <button
                  className="text-white text-[0.68rem] tracking-[0.5px] uppercase font-semibold px-[0.85rem] py-[0.3rem] rounded-[6px] border-0"
                  style={{
                    background:  isAdded ? '#16a34a' : 'var(--blue)',
                    cursor:      isAdded ? 'default' : 'pointer',
                    transform:   isFlashing ? 'scale(1.1)' : 'scale(1)',
                    transition:  'background 0.25s, transform 0.15s',
                    fontFamily:  'Helvetica Neue,Helvetica,Arial,sans-serif',
                  }}
                  onClick={e => { e.stopPropagation(); handleClick(item.code) }}
                  onMouseEnter={e => { if (!isAdded) e.currentTarget.style.background = '#000' }}
                  onMouseLeave={e => { e.currentTarget.style.background = isAdded ? '#16a34a' : 'var(--blue)' }}
                >
                  {isAdded ? '✓ Agregado' : 'Cotizar'}
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default function ServiciosSection({ onSelectSvc, selectedCodes = [] }) {
  const [activeTab, setActiveTab]   = useState('all')
  const [toast, setToast]           = useState(null)   // nombre del servicio
  const [topoFlashing, setTopoFlashing] = useState({}) // { [code]: true }
  const toastTimer = useRef(null)

  const show = key => activeTab === 'all' || activeTab === key

  // Busca el nombre de cualquier servicio por código
  const findName = (code) => {
    for (const cat of Object.values(SERVICIOS)) {
      const found = cat.items.find(i => i.code === code)
      if (found) return found.name
    }
    for (const cat of Object.values(TOPOGRAFIA)) {
      const found = cat.items.find(i => i.code === code)
      if (found) return found.name
    }
    return code
  }

  const showToast = (name) => {
    setToast(name)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2800)
  }

  // Handler para servicios de laboratorio (SvcTable)
  const handleSelectSvc = (code) => {
    if (selectedCodes.includes(code)) return
    onSelectSvc(code)
    showToast(findName(code))
  }

  // Handler para topografía (con su propio flashing local)
  const handleSelectTopo = (code) => {
    if (selectedCodes.includes(code)) return
    onSelectSvc(code)
    showToast(findName(code))
    setTopoFlashing(prev => ({ ...prev, [code]: true }))
    setTimeout(() => setTopoFlashing(prev => {
      const next = { ...prev }
      delete next[code]
      return next
    }), 1800)
  }

  return (
    <section id="servicios" className="px-[5vw] py-8" style={{ background: 'var(--white)' }}>

      {/* ── Header ──────────────────────────────────────────────────────────*/}
      <div
        className="flex justify-between items-end mb-10 pb-7 flex-wrap gap-8"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div
            className="text-[0.64rem] tracking-[3px] uppercase mb-1"
            style={{ color: 'var(--blue-soft)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}
          >
            // Catálogo Oficial — 2026
          </div>
          <h2
            className="font-black"
            style={{
              fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
              fontSize: 'clamp(1.9rem,3.8vw,3rem)',
              color: 'var(--navy)',
              letterSpacing: '-0.3px',
            }}
          >
            Tarifario de Servicios
          </h2>
        </div>

        {/* Info box */}
        <div
          className="flex gap-5 items-start p-7 rounded-[12px] mt-4"
          style={{ background: 'var(--blue-pale)', border: '1px solid rgba(0,44,158,.2)' }}
        >
          <div className="text-[1.4rem] flex-shrink-0 mt-[0.1rem]">ℹ️</div>
          <p className="text-[0.83rem] leading-[1.75]" style={{ color: 'var(--navy)' }}>
            Los servicios ofrecidos por el laboratorio se encuentran en su primera fase de implementación.
            Si necesita saber si hay más servicios disponibles o si su ensayo de interés no aparece en el
            listado, contáctenos para consultas específicas sobre sus necesidades de ensayo.{' '}
            <strong style={{ color: 'var(--blue)' }}>
              <a
                href="mailto:laboratorio.ic@unah.edu.hn"
                style={{ color: 'var(--blue)', textDecoration: 'none' }}
              >
                laboratorio.ic@unah.edu.hn
              </a>
            </strong>
          </p>
        </div>


      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────*/}
      <div className="flex gap-2 mb-10 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`border-[1.5px] px-[1.1rem] py-[0.42rem] rounded-full text-[0.73rem] tracking-[0.5px] uppercase cursor-pointer transition-all duration-200 ${
              activeTab === t.key
                ? 'text-white border-[var(--blue)] font-semibold'
                : 'text-[var(--gray-dk)] border-[var(--border)]'
            }`}
            style={{
              background: activeTab === t.key ? 'var(--blue)' : 'transparent',
              fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Bloques de categoría (laboratorio) ──────────────────────────────*/}
      {Object.entries(SERVICIOS).map(([key, cat]) => show(key) && (
        <div key={key} className="mb-10">
          <div
            className="flex items-center gap-3 mb-4 font-bold uppercase flex-wrap"
            style={{ fontSize: '1.1rem', color: 'var(--navy)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}
          >
            {cat.label}
            <span className="cat-pill">{cat.pill}</span>
            <span className="norma-tag">{cat.norma}</span>
          </div>
          <SvcTable
            items={cat.items}
            onSelect={handleSelectSvc}
            selectedCodes={selectedCodes}
          />
        </div>
      ))}

      {/* ── Topografía ──────────────────────────────────────────────────────*/}
      {show('topografia') && Object.entries(TOPOGRAFIA).map(([key, topo]) => (
        <div key={key} className="mb-8">
          <div
            className="flex items-center gap-3 mb-4 font-bold uppercase flex-wrap"
            style={{ fontSize: '1.1rem', color: 'var(--navy)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}
          >
            {topo.label}
            <span className="cat-pill">{topo.pill}</span>
            <span className="norma-tag">Normas Propias</span>
          </div>
          <div className="topo-card">
            <div className="topo-hdr">
              <span style={{ minWidth: 70 }}>Código</span>
              <span>Zona / Descripción</span>
              <span className="r" style={{ minWidth: 78 }}>Cotizar</span>
            </div>
            {topo.items.map(item => {
              const isAdded    = selectedCodes.includes(item.code)
              const isFlashing = topoFlashing[item.code]
              return (
                <div key={item.code} className="topo-row">
                  <span
                    className="text-[0.72rem] font-semibold"
                    style={{ color: 'var(--blue)', minWidth: 88, fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}
                  >
                    {item.code}
                  </span>
                  <div className="flex-1">
                    <div className="text-[0.85rem] font-normal uppercase" style={{ color: 'var(--navy)' }}>
                      {item.name}
                    </div>
                    <div className="text-[0.71rem] italic mt-[0.18rem]" style={{ color: 'var(--gray)' }}>
                      {item.note}
                    </div>
                  </div>
                  <button
                    className="text-white text-[0.68rem] tracking-[0.5px] uppercase font-semibold px-[0.85rem] py-[0.3rem] rounded-[6px] border-0"
                    style={{
                      background: isAdded ? '#16a34a' : 'var(--blue)',
                      cursor:     isAdded ? 'default' : 'pointer',
                      transform:  isFlashing ? 'scale(1.1)' : 'scale(1)',
                      transition: 'background 0.25s, transform 0.15s',
                      fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
                    }}
                    onClick={e => { e.stopPropagation(); handleSelectTopo(item.code) }}
                    onMouseEnter={e => { if (!isAdded) e.currentTarget.style.background = '#000' }}
                    onMouseLeave={e => { e.currentTarget.style.background = isAdded ? '#16a34a' : 'var(--blue)' }}
                  >
                    {isAdded ? '✓ Agregado' : 'Cotizar'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* ── Toast de confirmación ────────────────────────────────────────────*/}
      {toast && (
        <div
          style={{
            position:   'fixed',
            bottom:     28,
            right:      28,
            zIndex:     9999,
            background: '#1e3a8a',
            color:      '#fff',
            padding:    '12px 20px',
            borderRadius: '12px',
            fontSize:   '13px',
            fontWeight: 600,
            display:    'flex',
            alignItems: 'center',
            gap:        '10px',
            boxShadow:  '0 4px 24px rgba(0,0,0,0.2)',
            animation:  'toastIn 0.25s ease',
            maxWidth:   '340px',
          }}
        >
          <span
            style={{
              width:          22,
              height:         22,
              background:     '#16a34a',
              borderRadius:   '50%',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       13,
              flexShrink:     0,
            }}
          >
            ✓
          </span>
          <span>
            <span style={{ opacity: 0.75, fontWeight: 400 }}>Agregado: </span>
            {toast}
          </span>
          <style>{`
            @keyframes toastIn {
              from { opacity: 0; transform: translateY(10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

    </section>
  )
}