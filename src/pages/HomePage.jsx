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
import useServicios from '../hooks/useServicios'

export default function HomePage() {
  const { selectedCodes, addCode, removeCode, clearCodes } = useQuote()
  const { servicios, topografia, loading, error } = useServicios()

  return (
    <>
      <Navbar />
      <HeroSection />
      <NormasSection />
      <ServiciosSection
        onSelectSvc={addCode}
        selectedCodes={selectedCodes}
        servicios={servicios}
        topografia={topografia}
        loading={loading}
        error={error}
      />
      <EquiposSection />
      <ProcesoSection />
      <CotizacionSection
        selectedCodes={selectedCodes}
        onRemoveSvc={removeCode}
        onClear={clearCodes}
        servicios={servicios}
        topografia={topografia}
      />
      <FAQSection />
      <Footer />
    </>
  )
}