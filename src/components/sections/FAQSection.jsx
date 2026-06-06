import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export default function FAQSection() {
  const [faqs,      setFaqs]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/faq`)
      .then(r => r.json())
      .then(({ data }) => setFaqs(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" style={{ background: "var(--bg)", padding: "5rem 5vw" }}>
      {/* ── Encabezado ── */}
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", gap: "2rem", flexWrap: "wrap" }}
      >
        <div className="relative z-[2]">
          <div className="text-[0.64rem] tracking-[3px] uppercase mb-1" style={{ color: "var(--blue-soft)", fontFamily: "Helvetica Neue,Helvetica,Arial,sans-serif" }}>
            // Preguntas Frecuentes
          </div>
          <h2 className="font-black" style={{ fontFamily: "Helvetica Neue,Helvetica,Arial,sans-serif", fontSize: "clamp(1.9rem,3.8vw,3rem)", color: "var(--navy)", letterSpacing: "-0.3px" }}>
            FAQ
          </h2>
        </div>
        <p className="text-[0.55rem] tracking-[3px] uppercase" style={{ textAlign: "right", maxWidth: "320px", color: "var(--blue-soft)", fontFamily: "Helvetica Neue,Helvetica,Arial,sans-serif" }}>
          ¿Tienes dudas? Revisa las preguntas frecuentes o contáctanos directamente para una atención personalizada
        </p>
      </div>

      <div style={{ height: "1px", background: "var(--border)", marginBottom: "2rem" }} />

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--gray)" }}>
          Cargando…
        </div>
      )}

      {/* ── Lista ── */}
      <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={faq.id} style={{ borderRadius: "10px", overflow: "hidden", background: "var(--white)", border: "1px solid var(--border)" }}>
              <button
                onClick={() => toggle(i)}
                style={{
                  width: "100%", background: isOpen ? "var(--blue)" : "var(--white)", border: "none",
                  textAlign: "left", padding: "1.15rem 1.4rem",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "0.82rem", fontWeight: 700,
                  color: isOpen ? "#fff" : "var(--navy)", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  gap: "1rem", textTransform: "uppercase", letterSpacing: "0.4px",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "var(--blue-lite)"; }}
                onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = "var(--white)"; }}
              >
                {faq.pregunta}
                <span style={{
                  fontSize: "1.25rem", fontWeight: 900, flexShrink: 0,
                  color: isOpen ? "var(--gold)" : "var(--blue)",
                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.25s", display: "inline-block", lineHeight: 1,
                }}>›</span>
              </button>

              {isOpen && (
                <div style={{
                  padding: "1rem 1.4rem 1.2rem", fontSize: "0.87rem",
                  color: "var(--gray-dk)", lineHeight: 1.8,
                  borderTop: "1px solid var(--border)", background: "var(--white)",
                  textAlign: "justify", animation: "faqFadeIn 0.2s ease",
                }}>
                  {faq.respuesta}
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
