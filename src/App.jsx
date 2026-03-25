import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NormasPage from './pages/NormasPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/normas" element={<NormasPage />} />
    </Routes>
  )
}
