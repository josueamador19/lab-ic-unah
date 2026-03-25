# Lab IC UNAH — React App

Conversión de los archivos HTML del catálogo del **Laboratorio de Topografía, Suelos y Materiales — Depto. Ingeniería Civil, UNAH** a una aplicación React con Vite + Tailwind CSS + React Router.

## Estructura del proyecto

```
src/
├── App.jsx                        # Rutas principales
├── main.jsx                       # Entry point
├── index.css                      # Estilos globales + variables CSS
│
├── data/
│   └── labData.js                 # Todos los datos (servicios, normas, equipos, etc.)
│
├── hooks/
│   └── useQuote.js                # Hook para manejar ensayos seleccionados
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx             # Barra de navegación sticky
│   │   └── Footer.jsx             # Pie de página
│   │
│   └── sections/
│       ├── HeroSection.jsx        # Hero con mosaico animado + stats
│       ├── ServiciosSection.jsx   # Catálogo con filtros por categoría
│       ├── EquiposSection.jsx     # Grid de equipos
│       ├── ProcesoSection.jsx     # Pasos del proceso (4 cards)
│       └── CotizacionSection.jsx  # Formulario + mapa Leaflet interactivo
│
└── pages/
    ├── HomePage.jsx               # Página principal (catalogo-lab-ic-unah.html)
    └── NormasPage.jsx             # Página de normas (normas.html)
```

## Rutas

| URL        | Página       | HTML original                          |
|------------|--------------|----------------------------------------|
| `/`        | HomePage     | `catalogo-lab-ic-unah-modificado.html` |
| `/normas`  | NormasPage   | `normas.html`                          |

## Tecnologías

- **React 18** + **Vite**
- **React Router v6** (navegación entre páginas)
- **Tailwind CSS** (estilos utilitarios)
- **Leaflet / React-Leaflet** (mapa interactivo en formulario de cotización)
- **Google Apps Script** (envío del formulario a Google Sheets)

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

## Funcionalidades migradas

- ✅ Hero animado con mosaico de imágenes
- ✅ Barra de estadísticas
- ✅ Catálogo de servicios con filtros por categoría
- ✅ Topografía catastral y de ingeniería
- ✅ Sección de equipos
- ✅ Proceso en 4 pasos con diseño diagonal
- ✅ Formulario de cotización con selección de ensayos
- ✅ Mapa interactivo Leaflet + geocodificación inversa
- ✅ Búsqueda de ubicación + geolocalización del browser
- ✅ Envío a Google Sheets vía Apps Script
- ✅ Página de Normas con cards y tablas de referencia cruzada
- ✅ Navegación con React Router entre páginas
