import { useState, useEffect, useRef } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// ── Helpers ──────────────────────────────────────────────────────────────────
const api = async (method, path, body, key, isForm = false) => {
  const opts = {
    method,
    headers: { Authorization: `Bearer ${key}`, ...(!isForm && { 'Content-Type': 'application/json' }) },
  }
  if (body) opts.body = isForm ? body : JSON.stringify(body)
  const r = await fetch(`${API_URL}/api/v1${path}`, opts)
  return r.json()
}

const inputSt = {
  width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db',
  fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#fff',
}
const btnPrimary = {
  padding: '9px 20px', borderRadius: 8, background: '#3b5bdb', color: '#fff',
  border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
}
const btnDanger = {
  padding: '6px 14px', borderRadius: 6, background: '#fee2e2', color: '#ef4444',
  border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12,
}
const btnSecondary = {
  padding: '6px 14px', borderRadius: 6, background: '#eef2fb', color: '#3b5bdb',
  border: '1px solid #c7d2fe', cursor: 'pointer', fontWeight: 600, fontSize: 12,
}
const labelSt = { fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#6b7280', lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Tab: Cotizaciones ────────────────────────────────────────────────────────
function CotizacionesTab({ adminKey }) {
  const [cots,     setCots]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [page,     setPage]     = useState(1)
  const [pages,    setPages]    = useState(1)
  const [total,    setTotal]    = useState(0)
  const [syncing,  setSyncing]  = useState({})
  const [msg,      setMsg]      = useState(null)
  const [detalle,  setDetalle]  = useState(null)   // cotización abierta en modal
  const [loadDet,  setLoadDet]  = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const load = (p = 1) => {
    setLoading(true)
    api('GET', `/admin/cotizaciones?page=${p}&limit=20`, null, adminKey)
      .then(d => { setCots(d.data ?? []); setPages(d.pages ?? 1); setTotal(d.total ?? 0); setPage(p) })
      .finally(() => setLoading(false))
  }
  useEffect(() => load(1), [])

  const openDetalle = async (id) => {
    setLoadDet(true)
    const r = await api('GET', `/admin/cotizaciones/${id}`, null, adminKey)
    setDetalle(r.ok ? r.data : null)
    setLoadDet(false)
  }

  const retrySync = async (id) => {
    setSyncing(s => ({ ...s, [id]: true }))
    const r = await api('POST', `/admin/cotizaciones/${id}/sync-sheets`, {}, adminKey)
    if (r.ok) setMsg({ ok: true, text: `Sincronizada — fila ${r.fila}` })
    else      setMsg({ ok: false, text: r.message })
    setSyncing(s => ({ ...s, [id]: false }))
    load(page)
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta cotización permanentemente? No se puede deshacer.')) return
    const r = await api('DELETE', `/admin/cotizaciones/${id}`, null, adminKey)
    if (r.ok) { setMsg({ ok: true, text: 'Cotización eliminada.' }); load(page) }
    else      setMsg({ ok: false, text: r.message })
  }

  const filtered = busqueda
    ? cots.filter(c =>
        c.numero_cotizacion?.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.empresa?.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.correo?.toLowerCase().includes(busqueda.toLowerCase())
      )
    : cots

  const unsyncedCount = cots.filter(c => !c.sheets_synced).length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Cotizaciones recibidas</span>
          <span style={{ fontSize: 12, color: '#6b7280' }}>{total} total</span>
          {unsyncedCount > 0 && (
            <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
              ⚠ {unsyncedCount} sin sync Sheets
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Buscar por número, nombre, empresa…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ ...inputSt, width: 260, fontSize: 13 }}
          />
          <button style={btnSecondary} onClick={() => load(page)}>↻</button>
        </div>
      </div>

      {msg && (
        <div style={{ marginBottom: 12, padding: '10px 16px', borderRadius: 8, background: msg.ok ? '#f0fdf4' : '#fef2f2', color: msg.ok ? '#166534' : '#991b1b', fontSize: 13 }}>
          {msg.text}
        </div>
      )}

      {loading ? <p style={{ color: '#9ca3af' }}>Cargando…</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                {['N° Cotización', 'Fecha', 'Cliente', 'Empresa', 'Proyecto', 'Subtotal', 'Sheets', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <button
                      onClick={() => openDetalle(c.id)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700, textDecoration: 'underline' }}>
                        {c.numero_cotizacion}
                      </span>
                    </button>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#6b7280', whiteSpace: 'nowrap', fontSize: 12 }}>
                    {new Date(c.created_at).toLocaleDateString('es-HN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 600, color: '#1e3a8a' }}>{c.nombre}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{c.correo}</div>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.empresa}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#374151', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nombre_proyecto}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1e3a8a', whiteSpace: 'nowrap' }}>
                    L {parseFloat(c.subtotal || 0).toLocaleString('es-HN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {c.sheets_synced
                      ? <span style={{ background: '#f0fdf4', color: '#166534', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>✓ {c.sheets_fila}</span>
                      : <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>⚠ Pendiente</span>
                    }
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'nowrap' }}>
                      <button style={{ ...btnSecondary, fontSize: 11, padding: '5px 10px' }} onClick={() => openDetalle(c.id)}>
                        Ver
                      </button>
                      <a href={`${API_URL}/api/v1/cotizacion/${c.id}/docx`} target="_blank" rel="noreferrer"
                        style={{ ...btnSecondary, fontSize: 11, padding: '5px 10px', textDecoration: 'none' }}>
                        .docx
                      </a>
                      {!c.sheets_synced && (
                        <button style={{ ...btnPrimary, fontSize: 11, padding: '5px 10px' }} onClick={() => retrySync(c.id)} disabled={syncing[c.id]}>
                          {syncing[c.id] ? '…' : 'Sheets'}
                        </button>
                      )}
                      <button style={{ ...btnDanger, fontSize: 11, padding: '5px 10px' }} onClick={() => eliminar(c.id)}>
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {pages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
          <button style={btnSecondary} onClick={() => load(page - 1)} disabled={page <= 1}>← Anterior</button>
          <span style={{ padding: '6px 14px', fontSize: 13, color: '#6b7280' }}>Página {page} de {pages}</span>
          <button style={btnSecondary} onClick={() => load(page + 1)} disabled={page >= pages}>Siguiente →</button>
        </div>
      )}

      {/* Modal detalle */}
      {(loadDet || detalle) && (
        <Modal title={detalle ? `Cotización ${detalle.numero_cotizacion}` : 'Cargando…'} onClose={() => setDetalle(null)}>
          {loadDet
            ? <p style={{ color: '#9ca3af', textAlign: 'center', padding: 20 }}>Cargando detalle…</p>
            : <CotizacionDetalle cot={detalle} adminKey={adminKey} onSync={() => { load(page); setDetalle(null) }} onDelete={() => { load(page); setDetalle(null) }} />
          }
        </Modal>
      )}
    </div>
  )
}

function CotizacionDetalle({ cot, adminKey, onSync, onDelete }) {
  const [syncing,  setSyncing]  = useState(false)
  const [syncMsg,  setSyncMsg]  = useState(null)

  if (!cot) return null

  const fmt = v => parseFloat(v || 0).toLocaleString('es-HN', { minimumFractionDigits: 2 })

  const handleSync = async () => {
    setSyncing(true)
    const r = await api('POST', `/admin/cotizaciones/${cot.id}/sync-sheets`, {}, adminKey)
    setSyncMsg(r.ok ? { ok: true, text: `Sincronizada en fila ${r.fila}` } : { ok: false, text: r.message })
    setSyncing(false)
    if (r.ok) onSync()
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta cotización? No se puede deshacer.')) return
    await api('DELETE', `/admin/cotizaciones/${cot.id}`, null, adminKey)
    onDelete()
  }

  const infoRow = (label, value) => value ? (
    <div style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 13 }}>
      <span style={{ fontWeight: 700, color: '#6b7280', minWidth: 140, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#111827' }}>{value}</span>
    </div>
  ) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Estado Sheets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {cot.sheets_synced
          ? <span style={{ background: '#f0fdf4', color: '#166534', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>✓ Google Sheets — fila {cot.sheets_fila}</span>
          : <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>⚠ No sincronizado con Sheets</span>
        }
        <span style={{ background: '#f3f4f6', color: '#6b7280', borderRadius: 6, padding: '4px 12px', fontSize: 12 }}>
          {new Date(cot.created_at).toLocaleString('es-HN')}
        </span>
      </div>

      {/* Datos del cliente */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#1e3a8a', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Datos del solicitante</div>
        <div style={{ background: '#f9fafb', borderRadius: 10, padding: '14px 18px' }}>
          {infoRow('Nombre',    cot.nombre)}
          {infoRow('Correo',    cot.correo)}
          {infoRow('Empresa',   cot.empresa)}
          {infoRow('Teléfono',  cot.telefono)}
          {infoRow('RTN',       cot.rtn)}
        </div>
      </div>

      {/* Datos del proyecto */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#1e3a8a', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Proyecto</div>
        <div style={{ background: '#f9fafb', borderRadius: 10, padding: '14px 18px' }}>
          {infoRow('Nombre proyecto',    cot.nombre_proyecto)}
          {infoRow('Dirección proyecto', cot.direccion_proyecto)}
          {infoRow('Descripción',        cot.descripcion)}
          {cot.lat && infoRow('Coordenadas', `${cot.lat}, ${cot.lng}`)}
          {infoRow('Dirección mapa',     cot.direccion_mapa)}
        </div>
      </div>

      {/* Servicios solicitados */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#1e3a8a', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Servicios solicitados</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#eef2fb' }}>
                {['Código', 'Servicio', 'Norma', 'Muestras', 'Precio unit.', 'Total'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(cot.items || []).map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '8px 10px' }}>
                    <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>{item.code}</span>
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    {item.sub && <div style={{ fontSize: 11, color: '#6b7280', fontStyle: 'italic' }}>{item.sub}</div>}
                  </td>
                  <td style={{ padding: '8px 10px', color: '#6b7280', fontSize: 11 }}>{item.norma || '—'}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#1e3a8a' }}>{item.muestras ?? '—'}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>L {fmt(item.precio)}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#1e3a8a' }}>L {fmt(item.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f9fafb', borderTop: '2px solid #e5e7eb' }}>
                <td colSpan={5} style={{ padding: '10px', textAlign: 'right', fontWeight: 700, fontSize: 14 }}>SUBTOTAL</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, fontSize: 15, color: '#1e3a8a' }}>
                  L {fmt(cot.subtotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Acciones */}
      {syncMsg && (
        <div style={{ padding: '10px 16px', borderRadius: 8, background: syncMsg.ok ? '#f0fdf4' : '#fef2f2', color: syncMsg.ok ? '#166534' : '#991b1b', fontSize: 13 }}>
          {syncMsg.text}
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a href={`${API_URL}/api/v1/cotizacion/${cot.id}/docx`} target="_blank" rel="noreferrer"
          style={{ ...btnPrimary, textDecoration: 'none' }}>
          ⬇ Descargar .docx
        </a>
        {!cot.sheets_synced && (
          <button style={btnSecondary} onClick={handleSync} disabled={syncing}>
            {syncing ? 'Sincronizando…' : '↑ Sincronizar con Sheets'}
          </button>
        )}
        <button style={{ ...btnDanger, marginLeft: 'auto' }} onClick={handleDelete}>
          Eliminar cotización
        </button>
      </div>
    </div>
  )
}

// ── Tab: Servicios ────────────────────────────────────────────────────────────
function ServiciosTab({ adminKey }) {
  const [servicios, setServicios] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [editando,  setEditando]  = useState(null)
  const [creando,   setCreando]   = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [msg,       setMsg]       = useState(null)
  const [filtro,    setFiltro]    = useState('')
  const [catActiva, setCatActiva] = useState('all')

  const load = () => {
    setLoading(true)
    api('GET', '/admin/servicios', null, adminKey)
      .then(d => setServicios(d.data ?? []))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const save = async (data) => {
    setSaving(true)
    try {
      let r
      if (data.id) {
        r = await api('PUT', `/admin/servicios/${data.id}`, data, adminKey)
      } else {
        r = await api('POST', '/admin/servicios', data, adminKey)
      }
      if (r.ok) { setMsg({ ok: true, text: 'Guardado.' }); setEditando(null); setCreando(false); load() }
      else       { setMsg({ ok: false, text: r.message }) }
    } finally { setSaving(false) }
  }

  const toggleActivo = async (svc) => {
    await api('PUT', `/admin/servicios/${svc.id}`, { ...svc, activo: svc.activo ? 0 : 1 }, adminKey)
    load()
  }

  const del = async (id) => {
    if (!confirm('¿Eliminar permanentemente este servicio? Esta acción no se puede deshacer.')) return
    await api('DELETE', `/admin/servicios/${id}`, null, adminKey)
    setMsg({ ok: true, text: 'Servicio eliminado.' })
    load()
  }

  const CATS = ['suelos', 'concreto', 'agregados', 'acero', 'topografia']
  const CAT_LABELS = { all: 'Todos', suelos: '⛏ Suelos', concreto: '🏗 Concreto', agregados: '⚙ Agregados', acero: '🔩 Acero', topografia: '🗺 Topografía' }

  const filtered = servicios.filter(s => {
    const matchCat  = catActiva === 'all' || s.categoria === catActiva
    const matchText = !filtro || s.name.toLowerCase().includes(filtro.toLowerCase()) || s.code.toLowerCase().includes(filtro.toLowerCase())
    return matchCat && matchText
  })

  return (
    <div>
      {/* Filtros de categoría */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', ...CATS].map(cat => (
          <button
            key={cat}
            onClick={() => setCatActiva(cat)}
            style={{
              padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
              background:   catActiva === cat ? '#3b5bdb' : 'transparent',
              color:        catActiva === cat ? '#fff'    : '#6b7280',
              borderColor:  catActiva === cat ? '#3b5bdb' : '#d1d5db',
              transition: 'all 0.15s',
            }}
          >
            {CAT_LABELS[cat]}
            {cat !== 'all' && (
              <span style={{ marginLeft: 6, background: catActiva === cat ? 'rgba(255,255,255,0.25)' : '#f3f4f6', color: catActiva === cat ? '#fff' : '#6b7280', borderRadius: 999, padding: '1px 6px', fontSize: 10 }}>
                {servicios.filter(s => s.categoria === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Búsqueda y botón nuevo */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Buscar por nombre o código…" value={filtro} onChange={e => setFiltro(e.target.value)} style={{ ...inputSt, flex: 1, minWidth: 200 }} />
        <button style={btnPrimary} onClick={() => { setCreando(true); setEditando(null) }}>+ Nuevo servicio</button>
      </div>

      {msg && <div style={{ marginBottom: 12, padding: '10px 16px', borderRadius: 8, background: msg.ok ? '#f0fdf4' : '#fef2f2', color: msg.ok ? '#166534' : '#991b1b', fontSize: 13 }}>{msg.text}</div>}

      {loading ? <p style={{ color: '#9ca3af' }}>Cargando…</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Código', 'Categoría', 'Nombre', 'Precio (L)', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(svc => (
                <tr key={svc.id} style={{ borderBottom: '1px solid #f3f4f6', background: svc.activo ? '#fff' : '#fafafa', opacity: svc.activo ? 1 : 0.55 }}>
                  <td style={{ padding: '10px 12px' }}><span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{svc.code}</span></td>
                  <td style={{ padding: '10px 12px', color: '#6b7280' }}>{svc.categoria}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{svc.name}{svc.sub && <span style={{ display: 'block', fontSize: 11, color: '#9ca3af', fontStyle: 'italic' }}>{svc.sub}</span>}</td>
                  <td style={{ padding: '10px 12px' }}>{svc.precio != null ? `L ${parseFloat(svc.precio).toLocaleString()}` : '—'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <button onClick={() => toggleActivo(svc)} style={{ ...btnSecondary, background: svc.activo ? '#f0fdf4' : '#fef2f2', color: svc.activo ? '#166534' : '#ef4444', border: 'none' }}>
                      {svc.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={btnSecondary} onClick={() => { setEditando({ ...svc }); setCreando(false) }}>Editar</button>
                      <button style={btnDanger}    onClick={() => del(svc.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal editar / crear */}
      {(editando || creando) && (
        <Modal title={editando ? 'Editar servicio' : 'Nuevo servicio'} onClose={() => { setEditando(null); setCreando(false) }}>
          <ServiceForm
            initial={editando ?? { code: '', categoria: 'suelos', name: '', norma: '', sub: '', note: '', precio: '', activo: 1 }}
            cats={CATS}
            saving={saving}
            onSave={save}
            onCancel={() => { setEditando(null); setCreando(false) }}
            isNew={!editando}
          />
        </Modal>
      )}
    </div>
  )
}

function ServiceForm({ initial, cats, saving, onSave, onCancel, isNew }) {
  const [d, setD] = useState(initial)
  const set = (k) => (e) => setD(p => ({ ...p, [k]: e.target.value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelSt}>Código {isNew && '*'}</label>
          <input style={inputSt} value={d.code} onChange={set('code')} disabled={!isNew} placeholder="SU-01" />
        </div>
        <div>
          <label style={labelSt}>Categoría *</label>
          <select style={inputSt} value={d.categoria} onChange={set('categoria')}>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={labelSt}>Nombre *</label>
        <input style={inputSt} value={d.name} onChange={set('name')} placeholder="Nombre del ensayo" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelSt}>Norma técnica</label>
          <input style={inputSt} value={d.norma ?? ''} onChange={set('norma')} placeholder="ASTM D2216" />
        </div>
        <div>
          <label style={labelSt}>Precio (Lempiras)</label>
          <input style={inputSt} type="number" value={d.precio ?? ''} onChange={set('precio')} placeholder="0.00" />
        </div>
      </div>
      <div>
        <label style={labelSt}>Subclasificación</label>
        <input style={inputSt} value={d.sub ?? ''} onChange={set('sub')} placeholder="Ej. No. 4 y 3" />
      </div>
      <div>
        <label style={labelSt}>Nota adicional</label>
        <input style={inputSt} value={d.note ?? ''} onChange={set('note')} placeholder="Ej. Tarifa por día" />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button style={{ ...btnSecondary, padding: '9px 20px' }} onClick={onCancel}>Cancelar</button>
        <button style={btnPrimary} onClick={() => onSave(d)} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </div>
  )
}

// ── Tab: Equipos ──────────────────────────────────────────────────────────────
function EquiposTab({ adminKey }) {
  const [equipos,  setEquipos]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [editando, setEditando] = useState(null)
  const [creando,  setCreando]  = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState(null)

  const load = () => {
    setLoading(true)
    api('GET', '/admin/equipos', null, adminKey)
      .then(d => setEquipos(d.data ?? []))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const save = async (data, file) => {
    setSaving(true)
    try {
      const form = new FormData()
      form.append('title',       data.title)
      form.append('descripcion', data.descripcion)
      form.append('badge',       data.badge ?? '')
      form.append('orden',       data.orden ?? 0)
      form.append('activo',      data.activo ?? 1)
      if (file) form.append('imagen', file)

      let r
      if (data.id) r = await api('PUT', `/admin/equipos/${data.id}`, form, adminKey, true)
      else         r = await api('POST', '/admin/equipos', form, adminKey, true)

      if (r.ok) { setMsg({ ok: true, text: 'Guardado.' }); setEditando(null); setCreando(false); load() }
      else       { setMsg({ ok: false, text: r.message }) }
    } finally { setSaving(false) }
  }

  const del = async (id) => {
    if (!confirm('¿Eliminar este equipo?')) return
    await api('DELETE', `/admin/equipos/${id}`, null, adminKey)
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button style={btnPrimary} onClick={() => { setCreando(true); setEditando(null) }}>+ Nuevo equipo</button>
      </div>

      {msg && <div style={{ marginBottom: 12, padding: '10px 16px', borderRadius: 8, background: msg.ok ? '#f0fdf4' : '#fef2f2', color: msg.ok ? '#166534' : '#991b1b', fontSize: 13 }}>{msg.text}</div>}

      {loading ? <p style={{ color: '#9ca3af' }}>Cargando…</p> : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
          {equipos.map(eq => (
            <div key={eq.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff', opacity: eq.activo ? 1 : 0.55 }}>
              {eq.img_url ? (
                <img src={`${API_URL}${eq.img_url}`} alt={eq.title} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ height: 140, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 13 }}>Sin imagen</div>
              )}
              <div style={{ padding: '14px 16px' }}>
                {eq.badge && <span style={{ background: '#eef2fb', color: '#3b5bdb', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 600, marginBottom: 6, display: 'inline-block' }}>{eq.badge}</span>}
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1e3a8a', marginBottom: 4 }}>{eq.title}</div>
                <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{eq.descripcion}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={btnSecondary} onClick={() => { setEditando({ ...eq }); setCreando(false) }}>Editar</button>
                  <button style={btnDanger}    onClick={() => del(eq.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editando || creando) && (
        <Modal title={editando ? 'Editar equipo' : 'Nuevo equipo'} onClose={() => { setEditando(null); setCreando(false) }}>
          <EquipoForm
            initial={editando ?? { title: '', descripcion: '', badge: '', orden: equipos.length + 1, activo: 1 }}
            saving={saving}
            onSave={save}
            onCancel={() => { setEditando(null); setCreando(false) }}
          />
        </Modal>
      )}
    </div>
  )
}

function EquipoForm({ initial, saving, onSave, onCancel }) {
  const [d, setD]     = useState(initial)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(initial.img_url ? `${API_URL}${initial.img_url}` : null)
  const fileRef = useRef()
  const set = (k) => (e) => setD(p => ({ ...p, [k]: e.target.value }))

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={labelSt}>Nombre del equipo *</label>
        <input style={inputSt} value={d.title} onChange={set('title')} placeholder="Ej. Máquina de Desgaste L.A" />
      </div>
      <div>
        <label style={labelSt}>Descripción *</label>
        <textarea style={{ ...inputSt, height: 100, resize: 'vertical' }} value={d.descripcion} onChange={set('descripcion')} placeholder="Descripción técnica del equipo…" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelSt}>Badge / Etiqueta</label>
          <input style={inputSt} value={d.badge ?? ''} onChange={set('badge')} placeholder="Ej. Suelos · SU-22" />
        </div>
        <div>
          <label style={labelSt}>Orden</label>
          <input style={inputSt} type="number" value={d.orden ?? ''} onChange={set('orden')} placeholder="1" />
        </div>
      </div>

      <div>
        <label style={labelSt}>Imagen</label>
        {preview && <img src={preview} alt="preview" style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8, marginBottom: 8, display: 'block' }} />}
        <button type="button" style={{ ...btnSecondary, marginBottom: 4 }} onClick={() => fileRef.current.click()}>
          {preview ? '📷 Cambiar imagen' : '📷 Subir imagen'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        {file && <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 8 }}>{file.name}</span>}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button style={{ ...btnSecondary, padding: '9px 20px' }} onClick={onCancel}>Cancelar</button>
        <button style={btnPrimary} onClick={() => onSave(d, file)} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </div>
  )
}

// ── Tab: Configuración ────────────────────────────────────────────────────────
function ConfiguracionTab({ adminKey }) {
  const [campos,  setCampos]  = useState([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState(null)

  useEffect(() => {
    api('GET', '/admin/configuracion', null, adminKey)
      .then(d => setCampos(d.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (clave, valor) => {
    setCampos(prev => prev.map(c => c.clave === clave ? { ...c, valor } : c))
  }

  const save = async () => {
    setSaving(true)
    const updates = Object.fromEntries(campos.map(c => [c.clave, c.valor]))
    const r = await api('PUT', '/admin/configuracion', updates, adminKey)
    setMsg(r.ok ? { ok: true, text: 'Configuración guardada.' } : { ok: false, text: r.message })
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: 600 }}>
      {loading ? <p style={{ color: '#9ca3af' }}>Cargando…</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {campos.map(c => (
            <div key={c.clave}>
              <label style={labelSt}>{c.label}</label>
              <input
                style={inputSt}
                value={c.valor}
                onChange={e => handleChange(c.clave, e.target.value)}
              />
            </div>
          ))}

          {msg && <div style={{ padding: '10px 16px', borderRadius: 8, background: msg.ok ? '#f0fdf4' : '#fef2f2', color: msg.ok ? '#166534' : '#991b1b', fontSize: 13 }}>{msg.text}</div>}

          <button style={{ ...btnPrimary, alignSelf: 'flex-start' }} onClick={save} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Login ─────────────────────────────────────────────────────────────────────
// ── Tab: Normas ───────────────────────────────────────────────────────────────
function NormasTab({ adminKey }) {
  const [cards,    setCards]   = useState([])
  const [loading,  setLoading] = useState(true)
  const [editando, setEditando] = useState(null)
  const [creando,  setCreando] = useState(false)
  const [saving,   setSaving]  = useState(false)
  const [msg,      setMsg]     = useState(null)
  const [overIdx,  setOverIdx] = useState(null)
  const dragIdxRef = useRef(null)

  const load = () => {
    setLoading(true)
    api('GET', '/admin/normas', null, adminKey)
      .then(d => setCards(d.data ?? []))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const save = async (data, isNew) => {
    setSaving(true)
    const tags = data.tags_raw.split(',').map(t => t.trim()).filter(Boolean)
    const payload = { ...data, tags }
    if (isNew) {
      const word    = data.title.split(/[\s—\-]+/)[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 6)
      payload.id         = (word.toLowerCase() || `norma-${Date.now()}`)
      payload.icon_text  = word.toUpperCase() || 'NORMA'
      payload.icon_style = '{"background":"linear-gradient(135deg,#1a3a6e,#0d2045)","color":"#90c8f8"}'
    }
    let r
    if (isNew) r = await api('POST', '/admin/normas', payload, adminKey)
    else       r = await api('PUT', `/admin/normas/${data.id}`, payload, adminKey)
    if (r.ok) { setMsg({ ok: true, text: 'Guardado.' }); setEditando(null); setCreando(false); load() }
    else       { setMsg({ ok: false, text: r.message }) }
    setSaving(false)
  }

  const del = async (id) => {
    if (!confirm('¿Eliminar este organismo normativo?')) return
    await api('DELETE', `/admin/normas/${id}`, null, adminKey)
    load()
  }

  const saveOrder = async (newList) => {
    const items = newList.map((c, i) => ({ id: c.id, orden: i + 1 }))
    const r = await api('PUT', '/admin/normas/reorder', { items }, adminKey)
    if (!r.ok) setMsg({ ok: false, text: 'Error al guardar el orden.' })
    else load()
  }

  const handleDrop = (i) => {
    const from = dragIdxRef.current
    dragIdxRef.current = null
    setOverIdx(null)
    if (from === null || from === i) return
    const next = [...cards]
    const [moved] = next.splice(from, 1)
    next.splice(i, 0, moved)
    setCards(next)
    saveOrder(next)
  }

  const EMPTY_NORMA = { title: '', sub: '', descripcion: '', tags_raw: '' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button style={btnPrimary} onClick={() => { setCreando(true); setEditando(null) }}>+ Nueva norma</button>
      </div>
      {msg && <div style={{ marginBottom: 12, padding: '10px 16px', borderRadius: 8, background: msg.ok ? '#f0fdf4' : '#fef2f2', color: msg.ok ? '#166534' : '#991b1b', fontSize: 13 }}>{msg.text}</div>}
      {loading ? <p style={{ color: '#9ca3af' }}>Cargando…</p> : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))' }}>
          {cards.map((card, i) => (
            <div
              key={card.id}
              draggable
              onDragStart={e => { e.dataTransfer.setData('text/plain', ''); dragIdxRef.current = i }}
              onDragOver={e => { e.preventDefault(); if (overIdx !== i) setOverIdx(i) }}
              onDrop={e => { e.preventDefault(); handleDrop(i) }}
              onDragEnd={() => { dragIdxRef.current = null; setOverIdx(null) }}
              style={{
                border: overIdx === i ? '2px solid #1d4ed8' : '1px solid #e5e7eb',
                borderRadius: 12, padding: 20, background: '#fff',
                opacity: card.activo ? 1 : 0.55,
                cursor: 'grab', userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: '#d1d5db', fontSize: 18, lineHeight: 1, paddingTop: 2 }}>⠿</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#1e3a8a' }}>{card.title}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{card.sub}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={btnSecondary} onClick={() => { setEditando({ ...card, tags_raw: (typeof card.tags === 'string' ? JSON.parse(card.tags) : card.tags).join(', ') }); setCreando(false) }}>
                    Editar
                  </button>
                  <button style={btnDanger} onClick={() => del(card.id)}>Eliminar</button>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.55, marginBottom: 10 }}>{card.descripcion}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {(typeof card.tags === 'string' ? JSON.parse(card.tags) : card.tags).map(t => (
                  <span key={t} style={{ background: '#f0fdf4', color: '#166534', borderRadius: 4, padding: '2px 7px', fontSize: 11, fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editando && (
        <Modal title={`Editar — ${editando.title}`} onClose={() => setEditando(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelSt}>Título</label>
              <input style={inputSt} value={editando.title} onChange={e => setEditando(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label style={labelSt}>Subtítulo</label>
              <input style={inputSt} value={editando.sub} onChange={e => setEditando(p => ({ ...p, sub: e.target.value }))} />
            </div>
            <div>
              <label style={labelSt}>Descripción</label>
              <textarea style={{ ...inputSt, height: 100, resize: 'vertical' }} value={editando.descripcion} onChange={e => setEditando(p => ({ ...p, descripcion: e.target.value }))} />
            </div>
            <div>
              <label style={labelSt}>Etiquetas (separadas por coma)</label>
              <input style={inputSt} value={editando.tags_raw} onChange={e => setEditando(p => ({ ...p, tags_raw: e.target.value }))} placeholder="ASTM D698, ASTM D1557, …" />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button style={{ ...btnSecondary, padding: '9px 20px' }} onClick={() => setEditando(null)}>Cancelar</button>
              <button style={btnPrimary} onClick={() => save(editando, false)} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </div>
        </Modal>
      )}

      {creando && (
        <Modal title="Nueva norma" onClose={() => setCreando(false)}>
          <NormaForm
            initial={EMPTY_NORMA}
            saving={saving}
            onSave={data => save(data, true)}
            onCancel={() => setCreando(false)}
          />
        </Modal>
      )}
    </div>
  )
}

function NormaForm({ initial, saving, onSave, onCancel }) {
  const [d, setD] = useState(initial)
  const set = k => e => setD(p => ({ ...p, [k]: e.target.value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={labelSt}>Título</label>
        <input style={inputSt} value={d.title} onChange={set('title')} placeholder="Nombre del organismo normativo" />
      </div>
      <div>
        <label style={labelSt}>Subtítulo</label>
        <input style={inputSt} value={d.sub} onChange={set('sub')} placeholder="Nombre completo en inglés/español" />
      </div>
      <div>
        <label style={labelSt}>Descripción</label>
        <textarea style={{ ...inputSt, height: 100, resize: 'vertical' }} value={d.descripcion} onChange={set('descripcion')} placeholder="Descripción del organismo…" />
      </div>
      <div>
        <label style={labelSt}>Etiquetas (separadas por coma)</label>
        <input style={inputSt} value={d.tags_raw} onChange={set('tags_raw')} placeholder="ASTM D698, ASTM D1557, …" />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button style={{ ...btnSecondary, padding: '9px 20px' }} onClick={onCancel}>Cancelar</button>
        <button style={btnPrimary} onClick={() => onSave(d)} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </div>
  )
}

// ── Tab: Proceso ──────────────────────────────────────────────────────────────
function ProcesoTab({ adminKey }) {
  const [pasos,    setPasos]   = useState([])
  const [loading,  setLoading] = useState(true)
  const [editando, setEditando] = useState(null)
  const [creando,  setCreando] = useState(false)
  const [saving,   setSaving]  = useState(false)
  const [msg,      setMsg]     = useState(null)
  const [overIdx,  setOverIdx] = useState(null)
  const dragIdxRef = useRef(null)

  const load = () => {
    setLoading(true)
    api('GET', '/admin/proceso', null, adminKey)
      .then(d => setPasos(d.data ?? []))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const save = async (data, isNew) => {
    setSaving(true)
    let r
    if (isNew) r = await api('POST', '/admin/proceso', data, adminKey)
    else       r = await api('PUT', `/admin/proceso/${data.id}`, data, adminKey)
    if (r.ok) { setMsg({ ok: true, text: 'Guardado.' }); setEditando(null); setCreando(false); load() }
    else       { setMsg({ ok: false, text: r.message }) }
    setSaving(false)
  }

  const saveOrder = async (newList) => {
    const items = newList.map((p, i) => ({ id: p.id, orden: i + 1 }))
    const r = await api('PUT', '/admin/proceso/reorder', { items }, adminKey)
    if (!r.ok) setMsg({ ok: false, text: 'Error al guardar el orden.' })
    else load()
  }

  const handleDrop = (i) => {
    const from = dragIdxRef.current
    dragIdxRef.current = null
    setOverIdx(null)
    if (from === null || from === i) return
    const next = [...pasos]
    const [moved] = next.splice(from, 1)
    next.splice(i, 0, moved)
    setPasos(next)
    saveOrder(next)
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button style={btnPrimary} onClick={() => { setCreando(true); setEditando(null) }}>+ Nuevo paso</button>
      </div>
      {msg && <div style={{ marginBottom: 12, padding: '10px 16px', borderRadius: 8, background: msg.ok ? '#f0fdf4' : '#fef2f2', color: msg.ok ? '#166534' : '#991b1b', fontSize: 13 }}>{msg.text}</div>}
      {loading ? <p style={{ color: '#9ca3af' }}>Cargando…</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pasos.map((paso, i) => (
            <div
              key={paso.id}
              draggable
              onDragStart={e => { e.dataTransfer.setData('text/plain', ''); dragIdxRef.current = i }}
              onDragOver={e => { e.preventDefault(); if (overIdx !== i) setOverIdx(i) }}
              onDrop={e => { e.preventDefault(); handleDrop(i) }}
              onDragEnd={() => { dragIdxRef.current = null; setOverIdx(null) }}
              style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
                border: overIdx === i ? '2px solid #1d4ed8' : '1px solid #e5e7eb',
                borderRadius: 12, padding: '16px 20px', background: '#fff',
                opacity: paso.activo ? 1 : 0.55,
                cursor: 'grab', userSelect: 'none',
              }}
            >
              <span style={{ color: '#d1d5db', fontSize: 18, flexShrink: 0, paddingTop: 4 }}>⠿</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#dbeafe', fontFamily: 'Helvetica Neue,sans-serif', minWidth: 40, lineHeight: 1 }}>{paso.numero}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1e3a8a', marginBottom: 4 }}>{paso.titulo}</div>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.55, margin: 0 }}>{paso.descripcion}</p>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button style={btnSecondary} onClick={() => { setEditando({ ...paso }); setCreando(false) }}>Editar</button>
                <button style={btnDanger} onClick={async () => { if (!confirm('¿Eliminar este paso?')) return; await api('DELETE', `/admin/proceso/${paso.id}`, null, adminKey); load() }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editando && (
        <Modal title={`Editar — ${editando.titulo}`} onClose={() => setEditando(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelSt}>Título</label>
              <input style={inputSt} value={editando.titulo} onChange={e => setEditando(p => ({ ...p, titulo: e.target.value }))} />
            </div>
            <div>
              <label style={labelSt}>Descripción</label>
              <textarea style={{ ...inputSt, height: 100, resize: 'vertical' }} value={editando.descripcion} onChange={e => setEditando(p => ({ ...p, descripcion: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button style={{ ...btnSecondary, padding: '9px 20px' }} onClick={() => setEditando(null)}>Cancelar</button>
              <button style={btnPrimary} onClick={() => save(editando, false)} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </div>
        </Modal>
      )}

      {creando && (
        <Modal title="Nuevo paso" onClose={() => setCreando(false)}>
          <PasoForm
            saving={saving}
            onSave={data => save(data, true)}
            onCancel={() => setCreando(false)}
          />
        </Modal>
      )}
    </div>
  )
}

function PasoForm({ saving, onSave, onCancel }) {
  const [d, setD] = useState({ titulo: '', descripcion: '' })
  const set = k => e => setD(p => ({ ...p, [k]: e.target.value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={labelSt}>Título</label>
        <input style={inputSt} value={d.titulo} onChange={set('titulo')} placeholder="Nombre del paso…" />
      </div>
      <div>
        <label style={labelSt}>Descripción</label>
        <textarea style={{ ...inputSt, height: 100, resize: 'vertical' }} value={d.descripcion} onChange={set('descripcion')} placeholder="Descripción del paso…" />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button style={{ ...btnSecondary, padding: '9px 20px' }} onClick={onCancel}>Cancelar</button>
        <button style={btnPrimary} onClick={() => onSave(d)} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </div>
  )
}

// ── Tab: FAQ ──────────────────────────────────────────────────────────────────
function FaqTab({ adminKey }) {
  const [faqs,     setFaqs]    = useState([])
  const [loading,  setLoading] = useState(true)
  const [editando, setEditando] = useState(null)
  const [creando,  setCreando] = useState(false)
  const [saving,   setSaving]  = useState(false)
  const [msg,      setMsg]     = useState(null)

  const load = () => {
    setLoading(true)
    api('GET', '/admin/faq', null, adminKey)
      .then(d => setFaqs(d.data ?? []))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const save = async (data) => {
    setSaving(true)
    let r
    if (data.id) r = await api('PUT',  `/admin/faq/${data.id}`, data, adminKey)
    else         r = await api('POST', '/admin/faq', data, adminKey)
    if (r.ok) { setMsg({ ok: true, text: 'Guardado.' }); setEditando(null); setCreando(false); load() }
    else       { setMsg({ ok: false, text: r.message }) }
    setSaving(false)
  }

  const del = async (id) => {
    if (!confirm('¿Eliminar esta pregunta?')) return
    await api('DELETE', `/admin/faq/${id}`, null, adminKey)
    load()
  }

  const EMPTY = { pregunta: '', respuesta: '', orden: faqs.length + 1, activo: 1 }

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button style={btnPrimary} onClick={() => { setCreando(true); setEditando(null) }}>+ Nueva pregunta</button>
      </div>

      {msg && <div style={{ marginBottom: 12, padding: '10px 16px', borderRadius: 8, background: msg.ok ? '#f0fdf4' : '#fef2f2', color: msg.ok ? '#166534' : '#991b1b', fontSize: 13 }}>{msg.text}</div>}

      {loading ? <p style={{ color: '#9ca3af' }}>Cargando…</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, i) => (
            <div key={faq.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 20px', background: '#fff', opacity: faq.activo ? 1 : 0.5 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ minWidth: 24, height: 24, background: '#dbeafe', color: '#1d4ed8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1e3a8a', marginBottom: 6 }}>{faq.pregunta}</div>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {faq.respuesta}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button style={btnSecondary} onClick={() => { setEditando({ ...faq }); setCreando(false) }}>Editar</button>
                  <button style={btnDanger}    onClick={() => del(faq.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editando || creando) && (
        <Modal title={editando ? 'Editar pregunta' : 'Nueva pregunta'} onClose={() => { setEditando(null); setCreando(false) }}>
          <FaqForm
            initial={editando ?? EMPTY}
            saving={saving}
            onSave={save}
            onCancel={() => { setEditando(null); setCreando(false) }}
          />
        </Modal>
      )}
    </div>
  )
}

function FaqForm({ initial, saving, onSave, onCancel }) {
  const [d, setD] = useState(initial)
  const set = k => e => setD(p => ({ ...p, [k]: e.target.value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={labelSt}>Pregunta *</label>
        <input style={inputSt} value={d.pregunta} onChange={set('pregunta')} placeholder="¿…?" />
      </div>
      <div>
        <label style={labelSt}>Respuesta *</label>
        <textarea style={{ ...inputSt, height: 130, resize: 'vertical' }} value={d.respuesta} onChange={set('respuesta')} placeholder="Escribe la respuesta…" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'end' }}>
        <div>
          <label style={labelSt}>Orden</label>
          <input style={inputSt} type="number" value={d.orden} onChange={set('orden')} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 2 }}>
          <input type="checkbox" id="faq-activo" checked={!!d.activo} onChange={e => setD(p => ({ ...p, activo: e.target.checked ? 1 : 0 }))} style={{ width: 16, height: 16, cursor: 'pointer' }} />
          <label htmlFor="faq-activo" style={{ ...labelSt, marginBottom: 0, cursor: 'pointer' }}>Visible en el sitio</label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button style={{ ...btnSecondary, padding: '9px 20px' }} onClick={onCancel}>Cancelar</button>
        <button style={btnPrimary} onClick={() => onSave(d)} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [pass,  setPass]  = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const r = await fetch(`${API_URL}/api/v1/admin/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass }),
      })
      const data = await r.json()
      if (data.ok) {
        sessionStorage.setItem('adminKey', pass)
        onLogin(pass)
      } else {
        setError('Contraseña incorrecta.')
      }
    } catch {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, width: '100%', maxWidth: 380, boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔬</div>
          <h1 style={{ fontWeight: 800, fontSize: 20, color: '#1e3a8a', margin: '0 0 4px' }}>Panel Administrativo</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Laboratorios de Ingeniería Civil — UNAH</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelSt}>Contraseña</label>
            <input
              type="password"
              style={inputSt}
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="••••••••"
              autoFocus
            />
          </div>
          {error && <div style={{ fontSize: 13, color: '#ef4444', background: '#fef2f2', padding: '8px 12px', borderRadius: 8 }}>{error}</div>}
          <button type="submit" style={{ ...btnPrimary, padding: '12px', width: '100%' }} disabled={loading}>
            {loading ? 'Verificando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ adminKey, onLogout }) {
  const [tab, setTab] = useState('servicios')

  const TABS = [
    { key: 'cotizaciones',  label: '📩 Cotizaciones' },
    { key: 'servicios',     label: '📋 Servicios' },
    { key: 'equipos',       label: '🔬 Equipos' },
    { key: 'normas',        label: '📐 Normas' },
    { key: 'proceso',       label: '🔄 Proceso' },
    { key: 'faq',           label: '❓ FAQ' },
    { key: 'configuracion', label: '⚙️ Configuración' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: '#1e3a8a', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ color: '#fff' }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Panel Administrativo</div>
          <div style={{ fontSize: 12, color: '#93c5fd', marginTop: 2 }}>Laboratorios de Ingeniería Civil — UNAH</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ color: '#93c5fd', fontSize: 12, textDecoration: 'none' }}>← Ver sitio</a>
          <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '14px 20px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
              background: 'none', borderBottom: tab === t.key ? '2px solid #3b5bdb' : '2px solid transparent',
              color: tab === t.key ? '#3b5bdb' : '#6b7280',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {tab === 'cotizaciones'  && <CotizacionesTab  adminKey={adminKey} />}
        {tab === 'servicios'     && <ServiciosTab     adminKey={adminKey} />}
        {tab === 'equipos'       && <EquiposTab       adminKey={adminKey} />}
        {tab === 'normas'        && <NormasTab        adminKey={adminKey} />}
        {tab === 'proceso'       && <ProcesoTab       adminKey={adminKey} />}
        {tab === 'faq'           && <FaqTab           adminKey={adminKey} />}
        {tab === 'configuracion' && <ConfiguracionTab adminKey={adminKey} />}
      </div>
    </div>
  )
}

// ── AdminPage ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('adminKey') ?? null)

  const handleLogin  = (key) => setAdminKey(key)
  const handleLogout = () => { sessionStorage.removeItem('adminKey'); setAdminKey(null) }

  if (!adminKey) return <LoginForm onLogin={handleLogin} />
  return <Dashboard adminKey={adminKey} onLogout={handleLogout} />
}
