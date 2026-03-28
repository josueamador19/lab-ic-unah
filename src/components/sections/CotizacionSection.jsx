import { useEffect, useRef, useState } from "react";

export default function CotizacionSection() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  const DEFAULT_LAT = 14.0818;
  const DEFAULT_LNG = -87.2068;

  useEffect(() => {
    if (mapLoaded || mapInstanceRef.current) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => {
      const L = window.L;
      const map = L.map(mapRef.current).setView([DEFAULT_LAT, DEFAULT_LNG], 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const customIcon = L.divIcon({
        html: `<div style="
          width:32px;height:32px;border-radius:50% 50% 50% 0;
          background:#3b5bdb;border:3px solid white;
          box-shadow:0 2px 8px rgba(59,91,219,0.5);
          transform:rotate(-45deg);
        "></div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family:sans-serif;font-size:13px;font-weight:600;">
          📍 Ciudad Universitaria — UNAH<br/>
          <span style="font-weight:400;color:#6b7280;font-size:12px;">Edificio B1, Primer Nivel</span>
        </div>
      `).openPopup();

      setSelectedCoords({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setSelectedCoords({ lat: pos.lat.toFixed(6), lng: pos.lng.toFixed(6) });
      });

      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        setSelectedCoords({ lat: e.latlng.lat.toFixed(6), lng: e.latlng.lng.toFixed(6) });
        marker.closePopup();
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
      setMapLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapInstanceRef.current) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const L = window.L;
        const latlng = L.latLng(parseFloat(lat), parseFloat(lon));
        mapInstanceRef.current.setView(latlng, 16);
        markerRef.current.setLatLng(latlng);
        setSelectedCoords({ lat: parseFloat(lat).toFixed(6), lng: parseFloat(lon).toFixed(6) });
      } else {
        alert("Ubicación no encontrada. Intente con otro término.");
      }
    } catch {
      alert("Error al buscar. Verifique su conexión.");
    }
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocalización no disponible.");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const L = window.L;
        const latlng = L.latLng(coords.latitude, coords.longitude);
        mapInstanceRef.current.setView(latlng, 16);
        markerRef.current.setLatLng(latlng);
        setSelectedCoords({
          lat: coords.latitude.toFixed(6),
          lng: coords.longitude.toFixed(6),
        });
      },
      () => alert("No se pudo obtener su ubicación.")
    );
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    background: "#f9fafb",
    boxSizing: "border-box",
    fontFamily: "inherit",
    color: "#111827",
  };

  const labelStyle = {
    fontSize: "10px",
    fontWeight: 700,
    color: "#6b7280",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "4px",
    display: "block",
  };

  return (
    <section
      id="cotizacion"
      className="px-[5vw] py-20"
      style={{ background: "var(--bg)" }}
    >
      <div className="grid lg:grid-cols-[420px_1fr] gap-8 max-w-[1400px] mx-auto">

        {/* PANEL IZQUIERDO */}
        <div>
          <h2 className="text-3xl mb-4" style={{ fontWeight: 800 }}>
            Contáctenos
          </h2>

          <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
            Complete el formulario o escríbanos. El Ing. Joel Francisco Amador R.,
            Jefe de Laboratorios, le responderá con una propuesta personalizada.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "✉️", label: "Correo", value: "laboratorios.civil@unah.edu.hn", isEmail: true },
              { icon: "👤", label: "Jefe de Laboratorios", value: "Ing. Joel Francisco Amador R." },
              { icon: "🏛️", label: "Departamento", value: "Ingeniería Civil — UNAH" },
              { icon: "📍", label: "Ubicación", value: "Edificio B1, Primer Nivel — Ciudad Universitaria" },
              { icon: "🤝", label: "En colaboración con", value: "FUNDAUNAH" },
              { icon: "🕐", label: "Horario", value: "Lunes – Viernes / 8:00 AM – 3:30 PM" },
            ].map(({ icon, label, value, isEmail }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: "14px",
                background: "#eef2fb", borderRadius: "12px", padding: "14px 18px"
              }}>
                <span style={{ fontSize: "20px" }}>{icon}</span>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2px" }}>{label}</div>
                  <div style={{ fontWeight: isEmail ? 600 : 700, color: isEmail ? "#3b5bdb" : "inherit", fontSize: "14px" }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "20px",
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "#fefce8", border: "1px solid #fde68a",
            borderRadius: "999px", padding: "6px 14px",
            fontSize: "11px", fontWeight: 700, color: "#92400e", letterSpacing: "0.05em"
          }}>
            ✳️ PENDIENTE PROCESO DE PAGO — CONFIRMACIÓN EN 24H
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)"
          }}
        >
          <h3 className="text-xl font-bold mb-6">Solicitar cotización</h3>

          {/* FORMULARIO */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            {[
              { label: "Nombre completo", type: "text", placeholder: "Ej. María López" },
              { label: "Correo electrónico", type: "email", placeholder: "correo@ejemplo.com" },
              { label: "Empresa / Institución", type: "text", placeholder: "Nombre de la empresa" },
              { label: "Teléfono", type: "tel", placeholder: "+504 0000-0000" },
            ].map(({ label, type, placeholder }) => (
              <div key={label}>
                <label style={labelStyle}>{label}</label>
                <input type={type} placeholder={placeholder} style={inputStyle} />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Descripción del servicio</label>
            <textarea
              placeholder="Describa el servicio que necesita..."
              style={{ ...inputStyle, height: "110px", resize: "vertical" }}
            />
          </div>

          <button
            style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              background: "#3b5bdb", color: "white", fontWeight: 700,
              fontSize: "14px", border: "none", cursor: "pointer",
              marginBottom: "28px", letterSpacing: "0.03em",
            }}
          >
            Enviar solicitud →
          </button>

          {/* MAPA */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "18px" }}>📍</span>
              <h4 style={{ fontWeight: 700, fontSize: "15px", color: "var(--fg)", margin: 0 }}>
                Seleccionar ubicación en el mapa
              </h4>
            </div>
            <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "14px" }}>
              Haga clic en el mapa o arrastre el marcador para indicar su ubicación exacta.
            </p>

            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Buscar ubicación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={handleSearch}
                style={{
                  padding: "10px 16px", borderRadius: "10px", background: "#3b5bdb",
                  color: "white", fontWeight: 600, fontSize: "13px",
                  border: "none", cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                Buscar
              </button>
              <button
                onClick={handleMyLocation}
                style={{
                  padding: "10px 16px", borderRadius: "10px",
                  background: "#eef2fb", color: "#3b5bdb",
                  fontWeight: 600, fontSize: "13px",
                  border: "1px solid #c7d2fe", cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                📡 Mi ubicación
              </button>
            </div>

            <div
              ref={mapRef}
              style={{
                height: "320px", borderRadius: "12px",
                overflow: "hidden", border: "1px solid var(--border)",
              }}
            />

            {selectedCoords && (
              <div style={{
                marginTop: "10px", padding: "10px 14px",
                background: "#eef2fb", borderRadius: "8px",
                fontSize: "12px", color: "#3b5bdb", fontWeight: 600,
                display: "flex", gap: "16px", flexWrap: "wrap",
              }}>
                <span>🌐 Lat: {selectedCoords.lat}</span>
                <span>Lng: {selectedCoords.lng}</span>
                <span style={{ color: "#6b7280", fontWeight: 400, marginLeft: "auto" }}>
                  Arrastre el marcador para ajustar
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}