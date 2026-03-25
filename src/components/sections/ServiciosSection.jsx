import { useState } from 'react'
import { SERVICIOS, TOPOGRAFIA } from '../../data/labData'

const TABS = [
  { key: 'all',       label: 'Todos' },
  { key: 'suelos',    label: '⛏ Suelos' },
  { key: 'concreto',  label: '🏗 Concreto' },
  { key: 'agregados', label: '⚙ Agregados' },
  { key: 'acero',     label: '🔩 Acero' },
  { key: 'topografia',label: '🗺 Topografía' },
]

function SvcTable({ items, onSelect }) {
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
        {items.map(item => (
          <tr key={item.code} onClick={() => onSelect(item.code)}>
            <td>
              <span className="text-[0.72rem] font-semibold whitespace-nowrap" style={{ color: 'var(--blue)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
                {item.code}
              </span>
            </td>
            <td>
              <div>{item.name}</div>
              {item.sub && <div className="text-[0.71rem] italic mt-[0.18rem]" style={{ color: 'var(--gray)' }}>{item.sub}</div>}
            </td>
            <td><span className="norma-tag">{item.norma}</span></td>
            <td className="text-right">
              <button
                className="text-white text-[0.68rem] tracking-[0.5px] uppercase font-semibold px-[0.85rem] py-[0.3rem] rounded-[6px] transition-all duration-200 cursor-pointer border-0"
                style={{ background: 'var(--blue)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}
                onClick={e => { e.stopPropagation(); onSelect(item.code) }}
                onMouseEnter={e => e.currentTarget.style.background = '#000'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--blue)'}
              >
                Cotizar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function ServiciosSection({ onSelectSvc }) {
  const [activeTab, setActiveTab] = useState('all')

  const show = key => activeTab === 'all' || activeTab === key

  return (
    <section id="servicios" className="px-[5vw] py-8" style={{ background: 'var(--white)' }}>
      {/* Header */}
      <div className="flex justify-between items-end mb-10 pb-7 flex-wrap gap-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <div className="text-[0.64rem] tracking-[3px] uppercase mb-1" style={{ color: 'var(--blue-soft)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
            // Catálogo Oficial — 2026
          </div>
          <h2 className="font-black" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: 'clamp(1.9rem,3.8vw,3rem)', color: 'var(--navy)', letterSpacing: '-0.3px' }}>
            Tarifario de Servicios
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-10 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`border-[1.5px] px-[1.1rem] py-[0.42rem] rounded-full text-[0.73rem] tracking-[0.5px] uppercase cursor-pointer transition-all duration-200 ${activeTab === t.key ? 'text-white border-[var(--blue)] font-semibold' : 'text-[var(--gray-dk)] border-[var(--border)]'}`}
            style={{ background: activeTab === t.key ? 'var(--blue)' : 'transparent', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Category blocks */}
      {Object.entries(SERVICIOS).map(([key, cat]) => show(key) && (
        <div key={key} className="mb-10">
          <div className="flex items-center gap-3 mb-4 font-bold uppercase flex-wrap" style={{ fontSize: '1.1rem', color: 'var(--navy)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
            {cat.label}
            <span className="cat-pill">{cat.pill}</span>
            <span className="norma-tag">{cat.norma}</span>
          </div>
          <SvcTable items={cat.items} onSelect={onSelectSvc} />
        </div>
      ))}

      {/* Topografía */}
      {show('topografia') && Object.entries(TOPOGRAFIA).map(([key, topo]) => (
        <div key={key} className="mb-8">
          <div className="flex items-center gap-3 mb-4 font-bold uppercase flex-wrap" style={{ fontSize: '1.1rem', color: 'var(--navy)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
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
            {topo.items.map(item => (
              <div key={item.code} className="topo-row" onClick={() => onSelectSvc(item.code)}>
                <span className="text-[0.72rem] font-semibold" style={{ color: 'var(--blue)', minWidth: 88, fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
                  {item.code}
                </span>
                <div className="flex-1">
                  <div className="text-[0.85rem] font-normal uppercase" style={{ color: 'var(--navy)' }}>{item.name}</div>
                  <div className="text-[0.71rem] italic mt-[0.18rem]" style={{ color: 'var(--gray)' }}>{item.note}</div>
                </div>
                <button
                  className="text-white text-[0.68rem] tracking-[0.5px] uppercase font-semibold px-[0.85rem] py-[0.3rem] rounded-[6px] cursor-pointer border-0 transition-all duration-200"
                  style={{ background: 'var(--blue)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}
                  onClick={e => { e.stopPropagation(); onSelectSvc(item.code) }}
                  onMouseEnter={e => e.currentTarget.style.background = '#000'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--blue)'}
                >
                  Cotizar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
