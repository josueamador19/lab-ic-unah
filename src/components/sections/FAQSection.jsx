import { useState } from "react";

const FAQS = [
  {
    q: "¿Cuánto tiempo tarda en estar listo un ensayo?",
    a: "Los tiempos de entrega están sujetos a la demanda laboral bajo la cual se encuentre el laboratorio al momento de recibir las muestras, así como a la cantidad de muestras entregadas y al tipo de ensayo requerido.",
  },
  {
    q: "¿Cómo entrego mis muestras al laboratorio?",
    a: "Las muestras deben entregarse de forma presencial en el Edificio B1, Primer Nivel, Ciudad Universitaria — UNAH. El horario de recepción es de Lunes a Viernes de 8:00 AM a 3:00 PM. Cada muestra debe venir identificada con el nombre del proyecto y el tipo de ensayo requerido.",
  },
  {
    q: "¿Cuáles son los métodos de pago aceptados?",
    a: "Una vez recibida la solicitud de cotización, el equipo técnico le enviará las instrucciones de pago por correo electrónico con el monto a cancelar.",
  },
  {
    q: "¿Los ensayos cumplen con normas internacionales?",
    a: "Sí. Todos nuestros ensayos se realizan bajo las normativas ASTM (American Society for Testing and Materials) y AASHTO (American Association of State Highway and Transportation Officials), que son los estándares internacionales aplicados en ingeniería civil y geotecnia.",
  },
  {
    q: "¿Puedo solicitar varios ensayos en una sola cotización?",
    a: "Sí. El formulario de cotización permite agregar múltiples ensayos de distintas categorías (Suelos, Concreto, Agregados, Acero, Topografía) en una sola solicitud. Para cada ensayo puede especificar la cantidad de muestras y el número de ensayos requeridos.",
  },
  {
    q: "¿Qué sucede si mis muestras no cumplen con los requisitos mínimos?",
    a: "Si al recibir las muestras el personal técnico detecta que no cumplen con los requisitos mínimos (cantidad insuficiente, contaminación, mal etiquetado), se le notificará de inmediato para coordinar una nueva entrega sin costo adicional por la revisión.",
  },
  {
    q: "¿Los resultados tienen validez oficial?",
    a: "Los informes emitidos por el Laboratorio de Topografía, Suelos y Materiales están respaldados y firmados por los ingenieros del laboratorio, quienes son responsables de la ejecución de los ensayos y de la veracidad de los resultados reportados.",
  },
  {
    q: "¿Existen limitaciones respecto a los servicios con drones?",
    a: (
      <>
        Sí. La prestación de servicios con drones está condicionada por la{" "}
        <strong>Ley de Aeronáutica Civil de Honduras</strong> y las regulaciones
        vigentes sobre <strong>áreas de vuelo restringido</strong> en el país.
        Esto implica que ciertas zonas geográficas — como proximidades a
        aeropuertos, instalaciones militares, áreas gubernamentales u otras
        zonas de restricción aérea establecidas por las autoridades competentes
        — pueden limitar o impedir la realización de vuelos con aeronaves no
        tripuladas. Antes de programar cualquier servicio con dron, el equipo
        técnico evaluará la viabilidad operativa del vuelo conforme a la
        normativa aplicable.
      </>
    ),
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" style={{ background: "var(--bg)", padding: "5rem 5vw" }}>
      {/* ── Encabezado ── */}
      <div
        className="reveal"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "2.5rem",
          gap: "2rem",
        }}
      >
        <div className="relative z-[2] mb-11">
        <div className="text-[0.64rem] tracking-[3px] uppercase mb-1" style={{ color: 'var(--blue-soft)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
          // Preguntas Frecuentes
        </div>
        <h2 className="font-black" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: 'clamp(1.9rem,3.8vw,3rem)', color: 'var(--navy)', letterSpacing: '-0.3px' }}>
          FAQ
        </h2>
      </div>
      <p className="text-[0.55rem] tracking-[3px] uppercase mb-1" style={{ textAlign: "right",maxWidth: "320px", color: 'var(--blue-soft)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
          Tienes algunas dudas? Revisa las preguntas frecuentes o contáctanos directamente para una atención personalizada
        </p>
        
          
        
      </div>

      {/* ── Separador ── */}
      <div
        style={{
          height: "1px",
          background: "var(--border)",
          marginBottom: "2rem",
        }}
      />

      {/* ── Lista ── */}
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                background: "var(--white)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Pregunta */}
              <button
                onClick={() => toggle(i)}
                style={{
                  width: "100%",
                  background: isOpen ? "var(--blue)" : "var(--white)",
                  border: "none",
                  textAlign: "left",
                  padding: "1.15rem 1.4rem",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: isOpen ? "#fff" : "var(--navy)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isOpen)
                    e.currentTarget.style.background = "var(--blue-lite)";
                }}
                onMouseLeave={(e) => {
                  if (!isOpen)
                    e.currentTarget.style.background = "var(--white)";
                }}
              >
                {faq.q}
                <span
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    flexShrink: 0,
                    color: isOpen ? "var(--gold)" : "var(--blue)",
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.25s",
                    display: "inline-block",
                    lineHeight: 1,
                  }}
                >
                  ›
                </span>
              </button>

              {/* Respuesta */}
              {isOpen && (
                <div
                  style={{
                    padding: "1rem 1.4rem 1.2rem",
                    fontSize: "0.87rem",
                    color: "var(--gray-dk)",
                    lineHeight: 1.8,
                    borderTop: "1px solid var(--border)",
                    background: "var(--white)",
                    textAlign: "justify",
                    animation: "faqFadeIn 0.2s ease",
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes faqFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
