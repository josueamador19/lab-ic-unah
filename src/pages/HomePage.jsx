import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/sections/HeroSection'
import ServiciosSection from '../components/sections/ServiciosSection'
import EquiposSection from '../components/sections/EquiposSection'
import ProcesoSection from '../components/sections/ProcesoSection'
import CotizacionSection from '../components/sections/CotizacionSection'
import NormasSection from '../components/sections/NormasSection'
import FAQSection from '../components/sections/FAQSection'
import useQuote from '../hooks/useQuote'

export default function HomePage() {
  const { selectedCodes, addCode, removeCode, clearCodes } = useQuote()

  const handleSelectSvc = (code) => {
    addCode(code)
    setTimeout(() => {
      document.getElementById('cotizacion')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <>
      <Navbar />
      <HeroSection />
      <NormasSection/>
      <ServiciosSection onSelectSvc={handleSelectSvc} />
      <EquiposSection />
      <ProcesoSection />
      <CotizacionSection
        selectedCodes={selectedCodes}
        onRemoveSvc={removeCode}
        onClear={clearCodes}
      />
      <FAQSection />
      <Footer />
    </>
  )
}
