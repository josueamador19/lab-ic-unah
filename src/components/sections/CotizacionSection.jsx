export default function CotizacionSection() {
  return (
    <section
      id="cotizacion"
      className="px-[5vw] py-20"
      style={{ background: "var(--bg)" }}
    >
      <div className="grid lg:grid-cols-[420px_1fr] gap-8 max-w-[1400px] mx-auto">
        
        {/* PANEL IZQUIERDO */}
        <div>
          <h2
            className="text-3xl mb-4"
            style={{ fontWeight: 800 }}
          >
            Contáctenos
          </h2>

          <p className="text-sm mb-6" style={{ color: "var(--gray-dk)" }}>
            Complete el formulario o escríbanos. El Ing. Joel Francisco Amador R.,
            Jefe de Laboratorios, le responderá con una propuesta personalizada.
          </p>

          <div className="space-y-4">
            <div className="contact-card">
              <div className="label">Correo</div>
              <div>[email protected]</div>
            </div>

            <div className="contact-card">
              <div className="label">Jefe de Laboratorios</div>
              <div>Ing. Joel Francisco Amador R.</div>
            </div>

            <div className="contact-card">
              <div className="label">Departamento</div>
              <div>Ingeniería Civil — UNAH</div>
            </div>

            <div className="contact-card">
              <div className="label">Ubicación</div>
              <div>Edificio B1, Primer Nivel — Ciudad Universitaria</div>
            </div>

            <div className="contact-card">
              <div className="label">En colaboración con</div>
              <div>FUNDAUNAH</div>
            </div>

            <div className="contact-card">
              <div className="label">Horario</div>
              <div>Lunes – Viernes / 8:00 AM – 3:30 PM</div>
            </div>
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
          <h3 className="text-xl font-bold mb-6">
            Solicitar cotización
          </h3>

          {/* FORMULARIO */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Nombre completo"
              className="input"
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              className="input"
            />

            <input
              type="text"
              placeholder="Empresa / Institución"
              className="input"
            />

            <input
              type="text"
              placeholder="Teléfono"
              className="input"
            />
          </div>

          <textarea
            placeholder="Describa el servicio que necesita..."
            className="input mb-6"
            style={{ height: "120px" }}
          />

          <button className="btn-primary">
            Enviar solicitud
          </button>

          {/* MAPA */}
          <div className="mt-8">
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Buscar ubicación..."
                className="input flex-1"
              />
              <button className="btn-map">
                Buscar
              </button>
              <button className="btn-map-alt">
                Mi ubicación
              </button>
            </div>

            <div
              style={{
                height: "320px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid var(--border)"
              }}
              id="map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}