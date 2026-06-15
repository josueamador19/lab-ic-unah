import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export default function useConfiguracion() {
  const [config,  setConfig]  = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/v1/configuracion`)
      .then(r => r.json())
      .then(({ data }) => setConfig(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { config, loading }
}
