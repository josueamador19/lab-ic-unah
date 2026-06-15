import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const LAB_META = {
  suelos:    { label: '⛏ Ensayos de Suelos',            pill: 'SU-01 — SU-22', norma: 'ASTM / AASHTO' },
  concreto:  { label: '🏗 Ensayos de Concreto',          pill: 'CU-01 — CU-04', norma: 'ASTM' },
  agregados: { label: '⚙ Ensayos de Agregados',          pill: 'AG-02 — AG-08', norma: 'ASTM' },
  acero:     { label: '🔩 Ensayos de Acero de Refuerzo', pill: 'AC-01 — AC-03', norma: 'ASTM A615' },
}

const TOPO_META = {
  catastral:  { label: '🗺 Topografía Catastral',                      pill: 'ST-01 — ST-03', codes: ['ST-01', 'ST-02', 'ST-03'] },
  ingenieria: { label: '🗺 Topografía para Proyectos de Ingeniería',   pill: 'ST-04',          codes: ['ST-04'] },
}

export default function useServicios() {
  const [servicios,  setServicios]  = useState({})
  const [topografia, setTopografia] = useState({})
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/v1/servicios`)
      .then(r => r.json())
      .then(({ ok, data }) => {
        if (!ok) throw new Error('Error al cargar servicios')

        const svc = {}
        for (const [key, meta] of Object.entries(LAB_META)) {
          if (data[key]) svc[key] = { ...meta, items: data[key] }
        }
        setServicios(svc)

        const topoItems = data.topografia ?? []
        const topo = {}
        for (const [key, meta] of Object.entries(TOPO_META)) {
          topo[key] = { label: meta.label, pill: meta.pill, items: topoItems.filter(i => meta.codes.includes(i.code)) }
        }
        setTopografia(topo)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { servicios, topografia, loading, error }
}
