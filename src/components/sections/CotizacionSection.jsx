import { useEffect, useRef, useState, useCallback } from "react";
import { SERVICIOS, TOPOGRAFIA } from "../../data/labData";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// Códigos que pertenecen a topografía — no piden muestras/ensayos
const TOPO_CODES = ["ST-01", "ST-02", "ST-03", "ST-04"];

// Helper: busca el objeto completo por código
function findServicio(code) {
  for (const cat of Object.values(SERVICIOS)) {
    const found = cat.items.find((i) => i.code === code);
    if (found) return found;
  }
  for (const cat of Object.values(TOPOGRAFIA)) {
    const found = cat.items.find((i) => i.code === code);
    if (found) return found;
  }
  return null;
}

// Geocodificación inversa gratuita con Nominatim (sin API key)
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { "Accept-Language": "es" } },
    );
    const data = await res.json();
    if (data?.display_name) {
      const a = data.address || {};
      const parts = [
        a.road || a.pedestrian || a.footway || a.path,
        a.house_number,
        a.suburb || a.neighbourhood || a.quarter,
        a.city || a.town || a.village || a.municipality,
        a.state,
        a.country,
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : data.display_name;
    }
  } catch (_) {
    /* silencioso */
  }
  return null;
}

// Búsqueda de lugar por texto con Nominatim
async function searchPlace(query) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
    { headers: { "Accept-Language": "es" } },
  );
  return res.json();
}

// Crea el popup HTML del marcador
function makePopupHTML(title, body) {
  return `
    <div style="font-family:'Segoe UI',sans-serif;padding:2px;min-width:180px">
      <div style="font-weight:700;font-size:13px;color:#1e3a8a;margin-bottom:3px">${title}</div>
      <div style="font-size:11px;color:#6b7280;line-height:1.5">${body}</div>
    </div>`;
}

export default function CotizacionSection({
  selectedCodes = [],
  onRemoveSvc,
  onClear,
}) {
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef      = useRef(null);

  const [selectedCoords,  setSelectedCoords]  = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddress,  setLoadingAddress]  = useState(false);
  const [searchQuery,     setSearchQuery]     = useState("");
  const [searching,       setSearching]       = useState(false);
  const [mapLoaded,       setMapLoaded]       = useState(false);

  // ── Estado del formulario ─────────────────────────────────────────────────
  const [form, setForm] = useState({
    nombre:      "",
    correo:      "",
    empresa:     "",
    telefono:    "",
    descripcion: "",
    muestras:    "",   // cantidad de muestras (solo servicios no-topo)
    ensayos:     "",   // cantidad de ensayos  (solo servicios no-topo)
  });
  const [enviando,  setEnviando]  = useState(false);
  const [resultado, setResultado] = useState(null); // { ok, message }

  const DEFAULT_LAT = 14.0818;
  const DEFAULT_LNG = -87.2068;

  const handleFormChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Detecta si hay al menos un servicio que NO es topografía
  const serviciosSeleccionados = selectedCodes.map(findServicio).filter(Boolean);
  const tieneNoTopo = serviciosSeleccionados.some(
    (s) => !TOPO_CODES.includes(s.code),
  );

  // ── Envío al backend ──────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (selectedCodes.length === 0) return;

    const payload = {
      nombre:      form.nombre.trim(),
      correo:      form.correo.trim(),
      empresa:     form.empresa.trim()      || null,
      telefono:    form.telefono.trim()     || null,
      descripcion: form.descripcion.trim()  || null,
      muestras:    tieneNoTopo && form.muestras ? parseInt(form.muestras) : null,
      ensayos:     tieneNoTopo && form.ensayos  ? parseInt(form.ensayos)  : null,
      servicios:   serviciosSeleccionados.map((s) => ({
        code:  s.code,
        name:  s.name,
        norma: s.norma ?? null,
        sub:   s.sub ?? null,
      })),
      ubicacion: selectedCoords
        ? {
            lat:     selectedCoords.lat,
            lng:     selectedCoords.lng,
            address: selectedAddress ?? null,
          }
        : null,
    };

    if (!payload.nombre) {
      setResultado({ ok: false, message: "Por favor ingrese su nombre." });
      return;
    }
    if (!payload.correo) {
      setResultado({ ok: false, message: "Por favor ingrese su correo." });
      return;
    }

    setEnviando(true);
    setResultado(null);

    try {
      const res  = await fetch(`${API_URL}/api/v1/cotizacion`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        setResultado({ ok: true, message: data.message });
        setForm({
          nombre: "", correo: "", empresa: "", telefono: "",
          descripcion: "", muestras: "", ensayos: "",
        });
        onClear?.();
      } else {
        const detail = data?.detail;
        const msg =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
            ? detail.map((e) => e.msg).join(", ")
            : "Error al enviar la solicitud.";
        setResultado({ ok: false, message: msg });
      }
    } catch {
      setResultado({
        ok: false,
        message: "No se pudo conectar con el servidor. Verifique su conexión.",
      });
    } finally {
      setEnviando(false);
    }
  };

  // ── Actualiza marcador + geocodificación inversa ──────────────────────────
  const applyPosition = useCallback(
    async (lat, lng, popupTitle = "📍 Ubicación seleccionada") => {
      setSelectedCoords({
        lat: parseFloat(lat).toFixed(6),
        lng: parseFloat(lng).toFixed(6),
      });
      setSelectedAddress(null);
      setLoadingAddress(true);

      const address = await reverseGeocode(lat, lng);
      const label =
        address ||
        `${parseFloat(lat).toFixed(6)}, ${parseFloat(lng).toFixed(6)}`;
      setSelectedAddress(label);
      setLoadingAddress(false);

      if (markerRef.current) {
        markerRef.current
          .bindPopup(makePopupHTML(popupTitle, label), { maxWidth: 280 })
          .openPopup();
      }
    },
    [],
  );

  // ── Init Leaflet ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (mapLoaded || mapInstanceRef.current) return;

    const link  = document.createElement("link");
    link.rel    = "stylesheet";
    link.href   = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);

    const script    = document.createElement("script");
    script.src      = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload   = () => {
      setTimeout(() => {
        if (!mapRef.current || mapInstanceRef.current) return;
        const L = window.L;

        const map = L.map(mapRef.current, {
          center: [DEFAULT_LAT, DEFAULT_LNG],
          zoom:   16,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const dropIcon = L.divIcon({
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
            <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30S36 31.5 36 18C36 8.06 27.94 0 18 0z"
              fill="#3b5bdb" stroke="white" stroke-width="2.5"/>
            <circle cx="18" cy="18" r="7" fill="white"/>
          </svg>`,
          className:   "",
          iconSize:    [36, 48],
          iconAnchor:  [18, 48],
          popupAnchor: [0, -52],
        });

        const marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], {
          icon:      dropIcon,
          draggable: true,
        }).addTo(map);

        marker
          .bindPopup(
            makePopupHTML(
              "📍 Ciudad Universitaria — UNAH",
              "Edificio B1, Primer Nivel<br/>Laboratorios de Ingeniería Civil",
            ),
            { maxWidth: 260 },
          )
          .openPopup();

        setSelectedCoords({
          lat: DEFAULT_LAT.toFixed(6),
          lng: DEFAULT_LNG.toFixed(6),
        });
        setSelectedAddress("Ciudad Universitaria, Tegucigalpa, Honduras");

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          applyPosition(pos.lat, pos.lng);
        });

        map.on("click", (e) => {
          marker.setLatLng(e.latlng);
          applyPosition(e.latlng.lat, e.latlng.lng);
        });

        map.invalidateSize();
        markerRef.current      = marker;
        mapInstanceRef.current = map;
        setMapLoaded(true);
      }, 300);
    };
    document.head.appendChild(script);
  }, [applyPosition]);

  // ── Búsqueda de texto ─────────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapInstanceRef.current) return;
    setSearching(true);
    try {
      const data = await searchPlace(searchQuery);
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const L      = window.L;
        const latlng = L.latLng(parseFloat(lat), parseFloat(lon));
        mapInstanceRef.current.setView(latlng, 17);
        markerRef.current.setLatLng(latlng);

        const shortAddr = display_name.split(",").slice(0, 4).join(",").trim();
        setSelectedCoords({
          lat: parseFloat(lat).toFixed(6),
          lng: parseFloat(lon).toFixed(6),
        });
        setSelectedAddress(shortAddr);

        markerRef.current
          .bindPopup(makePopupHTML("🔍 Resultado de búsqueda", shortAddr), { maxWidth: 280 })
          .openPopup();
      } else {
        alert("Ubicación no encontrada. Intente con otro término.");
      }
    } catch {
      alert("Error al buscar. Verifique su conexión.");
    } finally {
      setSearching(false);
    }
  };

  // ── Estilos reutilizables ─────────────────────────────────────────────────
  const inputStyle = {
    width:       "100%",
    padding:     "10px 14px",
    borderRadius:"10px",
    border:      "1px solid #d1d5db",
    fontSize:    "14px",
    outline:     "none",
    background:  "#f9fafb",
    boxSizing:   "border-box",
    fontFamily:  "inherit",
    color:       "#111827",
  };

  const labelStyle = {
    fontSize:      "10px",
    fontWeight:    700,
    color:         "#6b7280",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom:  "4px",
    display:       "block",
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      id="cotizacion"
      className="px-[5vw] py-20"
      style={{ background: "var(--bg)" }}
    >
      <div className="grid lg:grid-cols-[420px_1fr] gap-8 max-w-[1400px] mx-auto">

        {/* ── PANEL IZQUIERDO ───────────────────────────────────────────────*/}
        <div>
          <h2 className="text-3xl mb-4" style={{ fontWeight: 800 }}>
            Contáctenos
          </h2>
          <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
            Complete el formulario o escríbanos. El Ing. Joel Francisco Amador
            R., Jefe de Laboratorios, le responderá con una propuesta
            personalizada.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "✉️",  label: "Correo",               value: "laboratorio.ic@unah.edu.hn", isEmail: true },
              { icon: "👤",  label: "Jefe de Laboratorios", value: "ING. JOEL FRANCISCO AMADOR R." },
              { icon: "🏛️", label: "Departamento",          value: "INGENIERÍA CIVIL — UNAH" },
              { icon: "📍",  label: "Ubicación",            value: "EDIFICIO B1, PRIMER NIVEL — CIUDAD UNIVERSITARIA" },
              { icon: "🤝",  label: "En colaboración con",  value: "FUNDAUNAH" },
              { icon: "🕐",  label: "Horario",              value: "LUNES – VIERNES / 8:00 AM – 3:00 PM" },
            ].map(({ icon, label, value, isEmail }) => (
              <div
                key={label}
                style={{
                  display:    "flex",
                  alignItems: "center",
                  gap:        "14px",
                  background: "#eef2fb",
                  borderRadius: "12px",
                  padding:    "14px 18px",
                }}
              >
                <span style={{ fontSize: "20px" }}>{icon}</span>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2px" }}>
                    {label}
                  </div>
                  <div style={{ fontWeight: isEmail ? 600 : 700, color: isEmail ? "#3b5bdb" : "inherit", fontSize: "14px" }}>
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop:    "20px",
              display:      "inline-flex",
              alignItems:   "center",
              gap:          "6px",
              background:   "#fefce8",
              border:       "1px solid #fde68a",
              borderRadius: "999px",
              padding:      "6px 14px",
              fontSize:     "11px",
              fontWeight:   700,
              color:        "#92400e",
              letterSpacing:"0.05em",
            }}
          >
            ✳️ PENDIENTE PROCESO DE PAGO — CONFIRMACIÓN EN 24H
          </div>
        </div>

        {/* ── PANEL DERECHO ─────────────────────────────────────────────────*/}
        <div
          className="p-6 rounded-xl"
          style={{
            background: "var(--card)",
            border:     "1px solid var(--border)",
            boxShadow:  "var(--shadow)",
          }}
        >
          <h3 className="text-xl font-bold mb-6">Solicitar cotización</h3>

          {/* ── Campos base ─────────────────────────────────────────────────*/}
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "1fr 1fr",
              gap:                 "16px",
              marginBottom:        "16px",
            }}
          >
            {[
              { label: "Nombre completo",       field: "nombre",   type: "text",  placeholder: "Ej. María López" },
              { label: "Correo electrónico",    field: "correo",   type: "email", placeholder: "correo@ejemplo.com" },
              { label: "Empresa / Institución", field: "empresa",  type: "text",  placeholder: "Nombre de la empresa" },
              { label: "Teléfono",              field: "telefono", type: "tel",   placeholder: "+504 0000-0000" },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label style={labelStyle}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={handleFormChange(field)}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>

          {/* ── Servicios seleccionados ──────────────────────────────────────*/}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={labelStyle}>
                Servicios solicitados
                {serviciosSeleccionados.length > 0 && (
                  <span style={{ marginLeft: "8px", background: "#3b5bdb", color: "white", borderRadius: "999px", padding: "1px 7px", fontSize: "10px", fontWeight: 700 }}>
                    {serviciosSeleccionados.length}
                  </span>
                )}
              </label>
              {serviciosSeleccionados.length > 1 && (
                <button
                  onClick={onClear}
                  style={{ fontSize: "11px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}
                >
                  Limpiar todo
                </button>
              )}
            </div>

            {serviciosSeleccionados.length === 0 ? (
              <div style={{ padding: "20px 16px", borderRadius: "10px", border: "1.5px dashed #d1d5db", background: "#f9fafb", textAlign: "center" }}>
                <div style={{ fontSize: "22px", marginBottom: "6px" }}>🔬</div>
                <div style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>Ningún servicio seleccionado aún</div>
                <div style={{ fontSize: "11px", color: "#d1d5db", marginTop: "3px" }}>
                  Use el botón <strong style={{ color: "#6b7280" }}>Cotizar</strong> en el catálogo de servicios
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {serviciosSeleccionados.map((svc) => (
                  <div
                    key={svc.code}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", background: "#eef2fb", border: "1px solid #c7d2fe" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#3b5bdb", background: "#dbeafe", borderRadius: "6px", padding: "2px 8px", whiteSpace: "nowrap", flexShrink: 0 }}>
                        {svc.code}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e3a8a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {svc.name}
                        </div>
                        {svc.sub && (
                          <div style={{ fontSize: "11px", color: "#6b7280", fontStyle: "italic" }}>{svc.sub}</div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, marginLeft: "8px" }}>
                      <span style={{ fontSize: "10px", color: "#6b7280", background: "#e5e7eb", borderRadius: "4px", padding: "2px 6px", whiteSpace: "nowrap" }}>
                        {svc.norma}
                      </span>
                      <button
                        onClick={() => onRemoveSvc(svc.code)}
                        title="Quitar servicio"
                        style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#fee2e2", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, flexShrink: 0 }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Muestras y ensayos (solo si hay servicios no-topo) ───────────*/}
          {tieneNoTopo && (
            <div
              style={{
                marginBottom: "16px",
                padding:      "16px 18px",
                borderRadius: "12px",
                background:   "#f0fdf4",
                border:       "1px solid #86efac",
              }}
            >
              <div
                style={{
                  fontSize:     "11px",
                  fontWeight:   700,
                  color:        "#166534",
                  letterSpacing:"0.06em",
                  textTransform:"uppercase",
                  marginBottom: "12px",
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "6px",
                }}
              >
                🔢 Cantidad de muestras y ensayos
              </div>
              <div
                style={{
                  display:             "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap:                 "12px",
                }}
              >
                <div>
                  <label style={{ ...labelStyle, color: "#166534" }}>
                    N° de muestras a entregar
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej. 3"
                    value={form.muestras}
                    onChange={handleFormChange("muestras")}
                    style={{
                      ...inputStyle,
                      border:     "1px solid #86efac",
                      background: "#fff",
                    }}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, color: "#166534" }}>
                    N° de ensayos requeridos
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej. 5"
                    value={form.ensayos}
                    onChange={handleFormChange("ensayos")}
                    style={{
                      ...inputStyle,
                      border:     "1px solid #86efac",
                      background: "#fff",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Descripción ──────────────────────────────────────────────────*/}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Descripción / Detalles adicionales</label>
            <textarea
              placeholder="Nombre del proyecto, observaciones, condiciones especiales..."
              value={form.descripcion}
              onChange={handleFormChange("descripcion")}
              style={{ ...inputStyle, height: "110px", resize: "vertical" }}
            />
          </div>

          {/* ── Banner de resultado ──────────────────────────────────────────*/}
          {resultado && (
            <div
              style={{
                marginBottom: "16px",
                padding:      "14px 18px",
                borderRadius: "10px",
                background:   resultado.ok ? "#f0fdf4" : "#fef2f2",
                border:       `1px solid ${resultado.ok ? "#86efac" : "#fca5a5"}`,
                color:        resultado.ok ? "#166534" : "#991b1b",
                fontSize:     "13px",
                fontWeight:   600,
                display:      "flex",
                alignItems:   "center",
                gap:          "8px",
              }}
            >
              <span style={{ fontSize: "16px" }}>{resultado.ok ? "✅" : "❌"}</span>
              {resultado.message}
            </div>
          )}

          {/* ── Botón enviar ─────────────────────────────────────────────────*/}
          <button
            onClick={handleSubmit}
            disabled={selectedCodes.length === 0 || enviando}
            style={{
              width:        "100%",
              padding:      "12px",
              borderRadius: "10px",
              background:   selectedCodes.length === 0 || enviando ? "#9ca3af" : "#3b5bdb",
              color:        "white",
              fontWeight:   700,
              fontSize:     "14px",
              border:       "none",
              cursor:       selectedCodes.length === 0 || enviando ? "not-allowed" : "pointer",
              marginBottom: "28px",
              letterSpacing:"0.03em",
              transition:   "background 0.2s",
            }}
          >
            {enviando
              ? "Enviando…"
              : selectedCodes.length === 0
              ? "Seleccione al menos un servicio"
              : `Enviar solicitud (${selectedCodes.length} servicio${selectedCodes.length > 1 ? "s" : ""}) →`}
          </button>

          {/* ── MAPA ─────────────────────────────────────────────────────────*/}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "18px" }}>📍</span>
              <h4 style={{ fontWeight: 700, fontSize: "15px", color: "var(--fg)", margin: 0 }}>
                Seleccionar ubicación en el mapa
              </h4>
            </div>
            <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "14px" }}>
              Haga clic en el mapa o arrastre el marcador. El nombre del lugar se detecta automáticamente.
            </p>

            {/* Buscador */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Buscar dirección o lugar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                style={{ padding: "10px 16px", borderRadius: "10px", background: "#3b5bdb", color: "white", fontWeight: 600, fontSize: "13px", border: "none", cursor: searching ? "wait" : "pointer", whiteSpace: "nowrap", opacity: searching ? 0.7 : 1 }}
              >
                {searching ? "Buscando…" : "Buscar"}
              </button>
              <button
                onClick={() => {
                  if (!navigator.geolocation) return alert("Geolocalización no disponible.");
                  navigator.geolocation.getCurrentPosition(
                    ({ coords }) => {
                      const L      = window.L;
                      const latlng = L.latLng(coords.latitude, coords.longitude);
                      mapInstanceRef.current.setView(latlng, 17);
                      markerRef.current.setLatLng(latlng);
                      applyPosition(coords.latitude, coords.longitude, "📡 Mi ubicación");
                    },
                    () => alert("No se pudo obtener su ubicación."),
                  );
                }}
                style={{ padding: "10px 14px", borderRadius: "10px", background: "#eef2fb", color: "#3b5bdb", fontWeight: 600, fontSize: "13px", border: "1px solid #c7d2fe", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                📡 Mi ubicación
              </button>
            </div>

            {/* Mapa */}
            <div
              ref={mapRef}
              style={{ height: "320px", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", background: "#f3f4f6" }}
            />

            {/* Panel de coordenadas */}
            {selectedCoords && (
              <div style={{ marginTop: "10px", padding: "12px 16px", background: "#eef2fb", borderRadius: "10px", border: "1px solid #c7d2fe" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "5px" }}>
                  Ubicación seleccionada
                </div>

                {loadingAddress ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                    <div style={{ width: "13px", height: "13px", border: "2px solid #3b5bdb", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", color: "#9ca3af", fontStyle: "italic" }}>Detectando nombre del lugar…</span>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                ) : (
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e3a8a", marginBottom: "5px", lineHeight: 1.45 }}>
                    {selectedAddress}
                  </div>
                )}

                <div style={{ fontSize: "11px", color: "#6b7280", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <span>🌐 Lat: {selectedCoords.lat}</span>
                  <span>Lng: {selectedCoords.lng}</span>
                  <span style={{ marginLeft: "auto", fontStyle: "italic" }}>Arrastre el marcador para ajustar</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}