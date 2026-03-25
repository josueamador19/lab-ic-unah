import { PROCESO_STEPS } from '../../data/labData'

export default function ProcesoSection() {
  return (
    <section id="proceso" className="px-[5vw] py-20 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="proc-stripe" />

      <div className="relative z-[2] mb-11">
        <div className="text-[0.64rem] tracking-[3px] uppercase mb-1" style={{ color: 'var(--blue-soft)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
          // Flujo de Trabajo
        </div>
        <h2 className="font-black" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: 'clamp(1.9rem,3.8vw,3rem)', color: 'var(--navy)', letterSpacing: '-0.3px' }}>
          Proceso de Ensayo
        </h2>
      </div>

      <div className="grid gap-6 relative z-[2]" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {PROCESO_STEPS.map((step, i) => (
          <div key={i} className="rounded-[16px] p-7 flex flex-col gap-4" style={{ background: '#002C9E' }}>
            <div className="text-[2rem] font-black leading-none" style={{ color: 'rgba(255,255,0,0.25)', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
              {step.num}
            </div>
            <div>
              <div className="font-bold text-[1rem] mb-2 text-white" style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
                {step.title}
              </div>
              <p className="text-[0.83rem] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {step.desc}
              </p>
            </div>
            <div className="mt-auto">
              <div className="h-[3px] w-12 rounded-full" style={{ background: 'var(--gold)' }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
