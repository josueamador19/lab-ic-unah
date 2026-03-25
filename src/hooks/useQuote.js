import { useState } from 'react'

/**
 * useQuote — manage the list of selected service codes for the quote form.
 * Shared between ServiciosSection (add) and CotizacionSection (display/remove).
 */
export default function useQuote() {
  const [selectedCodes, setSelectedCodes] = useState([])

  const addCode = (code) => {
    setSelectedCodes(prev => prev.includes(code) ? prev : [...prev, code])
  }

  const removeCode = (code) => {
    setSelectedCodes(prev => prev.filter(c => c !== code))
  }

  const clearCodes = () => setSelectedCodes([])

  return { selectedCodes, addCode, removeCode, clearCodes }
}
