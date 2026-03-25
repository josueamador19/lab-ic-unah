import { useState, useEffect, useRef } from 'react'

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxe9NpARjF_qtr-R-PBvqO7fgltOyXPNbYU6KNDijF4UuBvYFGxFn8na8RKlAnboKQxJQ/exec'

export default function CotizacionSection({ selectedCodes = [], onClear }) {
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', telefono: '', normas: '', tiposervicio: '', descripcion: '' })
  const [ubicacion, setUbicacion] = useState('')
  const [mapLat, setMapLat] = useState('')
  const [mapLng, setMapLng] = useState('')
  const [mapAddr, setMapAddr] = useState('')
  const [mapConfirmed, setMapConfirmed] = useState(false)
  const [pendingAddr, setPendingAddr] = useState('')
  const [pendingLatLng, setPendingLatLng] = useState(null)
  const [toast, setToast] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const mapRef = useRef(null)
  const leafletMapRef = useRef(null)
  const markerRef = useRef(null)
  const mapContainerRef = useRef(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  // Init leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || leafletMapRef.current) return
    let L
    try {
      L = window.L
      if (!L) return
      leafletMapRef.current = L.map(mapContainerRef.current).setView([14.0818, -87.2068], 10)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors', maxZoom: 19
      }).addTo(leafletMapRef.current)
      leafletMapRef.current.on('click', (e) => setMapPin(e.latlng.lat, e.latlng.lng))
    } catch (e) {
      console.warn('Leaflet no disponible')
    }
  }, [])

  const reverseGeocode = (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=es`
    fetch(url).then(r => r.json()).then(d => {
      const addr = d.display_name || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`
      setPendingAddr(addr)
      setPendingLatLng({ lat, lng })
    }).catch(() => {
      const addr = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`
      setPendingAddr(addr)
      setPendingLatLng({ lat, lng })
    })
  }

  const setMapPin = (lat, lng) => {
    const L = window.L
    if (!L || !leafletMapRef.current) return
    if (markerRef.current) leafletMapRef.current.removeLayer(markerRef.current)
    markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(leafletMapRef.current)
    markerRef.current.on('dragend', (ev) => {
      const pos = ev.target.getLatLng()
      reverseGeocode(pos.lat, pos.lng)
    })
    reverseGeocode(lat, lng)
    leafletMapRef.current.setView([lat, lng], 14)
  }

  const confirmMapLocation = () => {
    if (!pendingLatLng) return
    const full = `${pendingAddr} (Lat:${pendingLatLng.lat.toFixed(6)}, Lng:${pendingLatLng.lng.toFixed(6)})`
    setUbicacion(full)
    setMapLat(pendingLatLng.lat.toFixed(6))
    setMapLng(pendingLatLng.lng.toFixed(6))
    setMapAddr(pendingAddr)
    setMapConfirmed(true)
    setPendingAddr('')
  }

  const resetMapLocation = () => {
    setUbicacion(''); setMapLat(''); setMapLng(''); setMapAddr(''); setMapConfirmed(false)
    if (markerRef.current && leafletMapRef.current) { leafletMapRef.current.removeLayer(markerRef.current); markerRef.current = null }
  }

  const searchMap = () => {
    const q = mapRef.current?.value?.trim()
    if (!q) return
    fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&limit=1&accept-language=es`)
      .then(r => r.json()).then(data => {
        if (data && data.length > 0) setMapPin(parseFloat(data[0].lat), parseFloat(data[0].lon))
        else alert('No se encontró la ubicación.')
      }).catch(() => alert('Error al buscar la ubicación.'))
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) { alert('Geolocalización no disponible'); return }
    navigator.geolocation.getCurrentPosition(
      pos => setMapPin(pos.coords.latitude, pos.coords.longitude),
      () => alert('No se pudo obtener su ubicación.')
    )
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedCodes.length === 0 && !form.tiposervicio) {
      alert('Seleccione al menos un ensayo o tipo de servicio.'); return
    }
    const fecha = new Date().toLocaleString('es-HN', { timeZone: 'America/Tegucigalpa' })
    const sol = {
      fecha, nombre: form.nombre, email: form.email, telefono: form.telefono,
      empresa: form.empresa || 'No especificada',
      ubicacion: ubicacion || 'No especificada',
      lat: mapLat, lng: mapLng,
      normas: form.normas || 'No especificada',
      tipoServicio: form.tiposervicio,
      servicios: selectedCodes.length > 0 ? selectedCodes.join(' | ') : form.tiposervicio,
      descripcion: form.descripcion,
      estado: 'Pendiente proceso de pago',
    }
    try {
      await fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(sol) })
    } catch (err) { console.error(err) }
    setSubmitted(true)
    showToast('✅ Solicitud enviada exitosamente.')
    setForm({ nombre: '', empresa: '', email: '', telefono: '', normas: '', tiposervicio: '', descripcion: '' })
    resetMapLocation()
    onClear?.()
    setTimeout(() => setSubmitted(false), 5000)
  }

  const inputCls = 'w-full border rounded-[8px] px-4 py-[0.75rem] text-[0.85rem] outline-none transition-all duration-200 focus:border-[var(--blue)]'
  const inputStyle = { borderColor: 'var(--border)', background: '#fff', color: 'var(--navy)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }
  const labelCls = 'block text-[0.72rem] font-semibold uppercase tracking-[1px] mb-2'
  const labelStyle = { color: 'var(--gray-dk)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }

  return (
    <section id="cotizacion" className="px-[5vw] py-20" style={{ background: 'var(--white)' }}>
      <div className="mb-10 pb-7" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="text-[0.64rem] tracking-[3px] uppercase mb-1" style={{ color: 'var(--blue-soft)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
          // Solicitud en Línea
        </div>
        <h2 className="font-black" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: 'clamp(1.9rem,3.8vw,3rem)', color: 'var(--navy)', letterSpacing: '-0.3px' }}>
          Solicitar Cotización
        </h2>
      </div>

      {/* Selected services */}
      {selectedCodes.length > 0 && (
        <div className="mb-8 p-5 rounded-[12px] flex items-start gap-4 flex-wrap" style={{ background: 'var(--blue-pale)', border: '1px solid rgba(0,44,158,.2)' }}>
          <div className="flex-1">
            <div className="text-[0.72rem] font-bold uppercase tracking-[1px] mb-2" style={{ color: 'var(--blue)' }}>Ensayos seleccionados:</div>
            <div className="flex flex-wrap gap-2">
              {selectedCodes.map(c => (
                <span key={c} className="norma-tag">{c}</span>
              ))}
            </div>
          </div>
          <button onClick={onClear} className="text-[0.68rem] uppercase tracking-[0.5px] font-semibold px-3 py-1.5 rounded-[6px] border-0 cursor-pointer transition-colors duration-200" style={{ background: 'rgba(0,44,158,.15)', color: 'var(--blue)' }}>
            Limpiar
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
        {/* Nombre */}
        <div>
          <label className={labelCls} style={labelStyle}>Nombre Completo *</label>
          <input required name="nombre" value={form.nombre} onChange={handleChange} className={inputCls} style={inputStyle} placeholder="Ej. Juan Pérez" />
        </div>
        {/* Empresa */}
        <div>
          <label className={labelCls} style={labelStyle}>Empresa / Institución</label>
          <input name="empresa" value={form.empresa} onChange={handleChange} className={inputCls} style={inputStyle} placeholder="Opcional" />
        </div>
        {/* Correo */}
        <div>
          <label className={labelCls} style={labelStyle}>Correo Electrónico *</label>
          <input required type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} style={inputStyle} placeholder="correo@ejemplo.com" />
        </div>
        {/* Teléfono */}
        <div>
          <label className={labelCls} style={labelStyle}>Teléfono *</label>
          <input required name="telefono" value={form.telefono} onChange={handleChange} className={inputCls} style={inputStyle} placeholder="+504 0000-0000" />
        </div>
        {/* Normas */}
        <div>
          <label className={labelCls} style={labelStyle}>Normas Requeridas</label>
          <input name="normas" value={form.normas} onChange={handleChange} className={inputCls} style={inputStyle} placeholder="ASTM, AASHTO, etc." />
        </div>
        {/* Tipo servicio */}
        <div>
          <label className={labelCls} style={labelStyle}>Tipo de Servicio</label>
          <select name="tiposervicio" value={form.tiposervicio} onChange={handleChange} className={inputCls} style={inputStyle}>
            <option value="">Seleccionar...</option>
            <option value="Ensayos de Suelos">Ensayos de Suelos</option>
            <option value="Ensayos de Concreto">Ensayos de Concreto</option>
            <option value="Ensayos de Agregados">Ensayos de Agregados</option>
            <option value="Ensayos de Acero">Ensayos de Acero</option>
            <option value="Topografía">Topografía</option>
            <option value="Múltiples servicios">Múltiples servicios</option>
          </select>
        </div>

        {/* Descripción - full width */}
        <div className="col-span-full">
          <label className={labelCls} style={labelStyle}>Descripción del Proyecto</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} className={inputCls} style={inputStyle} placeholder="Describa brevemente el proyecto y los ensayos requeridos..." />
        </div>

        {/* Map - full width */}
        <div className="col-span-full">
          <label className={labelCls} style={labelStyle}>Ubicación del Proyecto</label>
          <div className="flex gap-2 mb-3 flex-wrap">
            <input ref={mapRef} className={inputCls + ' flex-1'} style={{ ...inputStyle, minWidth: 200 }} placeholder="Buscar dirección..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), searchMap())} />
            <button type="button" onClick={searchMap} className="px-4 py-2 rounded-[8px] text-[0.8rem] font-semibold text-white cursor-pointer border-0" style={{ background: 'var(--blue)' }}>Buscar</button>
            <button type="button" onClick={useMyLocation} className="px-4 py-2 rounded-[8px] text-[0.8rem] font-semibold cursor-pointer border-0" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>📍 Mi ubicación</button>
          </div>
          <div ref={mapContainerRef} style={{ height: 280, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', zIndex: 1 }} />
          {pendingAddr && !mapConfirmed && (
            <div className="mt-3 p-3 rounded-[8px] flex items-center gap-3 flex-wrap" style={{ background: 'var(--blue-pale)', border: '1px solid rgba(0,44,158,.2)' }}>
              <span className="flex-1 text-[0.8rem]" style={{ color: 'var(--navy)' }}>{pendingAddr}</span>
              <button type="button" onClick={confirmMapLocation} className="px-3 py-1.5 rounded-[6px] text-[0.72rem] font-bold cursor-pointer border-0" style={{ background: 'var(--blue)', color: '#fff' }}>Confirmar</button>
              <button type="button" onClick={() => setPendingAddr('')} className="px-3 py-1.5 rounded-[6px] text-[0.72rem] font-bold cursor-pointer border-0" style={{ background: 'rgba(0,44,158,.12)', color: 'var(--blue)' }}>Cancelar</button>
            </div>
          )}
          {mapConfirmed && (
            <div className="mt-3 p-3 rounded-[8px] flex items-center gap-3 flex-wrap" style={{ background: '#e8f5e9', border: '1px solid #a5d6a7' }}>
              <span className="flex-1 text-[0.8rem]" style={{ color: '#2e7d32' }}>✅ {mapAddr}</span>
              <button type="button" onClick={resetMapLocation} className="px-3 py-1.5 rounded-[6px] text-[0.72rem] font-bold cursor-pointer border-0" style={{ background: '#c8e6c9', color: '#2e7d32' }}>Cambiar</button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="col-span-full">
          <button type="submit" className="w-full py-4 rounded-[10px] font-black text-[0.95rem] uppercase tracking-[1px] cursor-pointer border-0 transition-all duration-200 hover:-translate-y-0.5" style={{ background: 'var(--blue)', color: '#fff', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
            ✉ Enviar Solicitud de Cotización
          </button>
        </div>
      </form>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 px-6 py-4 rounded-[12px] text-[0.85rem] font-semibold z-[9999]" style={{ background: '#002C9E', color: '#FFFF00', boxShadow: '0 10px 40px rgba(0,0,0,.3)', animation: 'fadeIn .3s ease' }}>
          {toast}
        </div>
      )}

      {/* Success overlay */}
      {submitted && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]" style={{ background: 'rgba(0,0,0,.55)', animation: 'fadeIn .2s ease' }}>
          <div className="bg-white rounded-[16px] p-10 max-w-[420px] w-[90%] text-center" style={{ boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-black text-[1.2rem] mb-3" style={{ color: 'var(--blue)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>¡Solicitud Enviada!</h3>
            <p className="text-[0.88rem] leading-[1.6] mb-6" style={{ color: 'var(--gray-dk)' }}>El equipo del Laboratorio IC — UNAH le contactará pronto.</p>
            <button onClick={() => setSubmitted(false)} className="px-8 py-3 rounded-[8px] font-bold cursor-pointer border-0" style={{ background: 'var(--blue)', color: 'var(--gold)' }}>Aceptar</button>
          </div>
        </div>
      )}
    </section>
  )
}
