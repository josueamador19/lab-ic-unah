# Laboratorio de Ingeniería Civil UNAH — Frontend

Sitio web institucional y sistema de cotizaciones en línea para los Laboratorios de Topografía, Suelos y Materiales — UNAH. Construido con React + Vite + Tailwind CSS.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | React 18 |
| Build tool | Vite 5 |
| Estilos | Tailwind CSS 3 |
| Routing | React Router DOM 6 |
| Mapas | Leaflet |

---

## Requisitos previos

- **Node.js** ≥ 18 — [nodejs.org](https://nodejs.org)
- **npm** ≥ 9
- El **backend** corriendo en `http://localhost:8000` (ver [README del backend](../lab-backend/README.md))

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd lab-ic-unah
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env`:

```env
VITE_API_URL=http://localhost:8000
```

### 4. Iniciar en modo desarrollo

```bash
npm run dev
```

Disponible en `http://localhost:5173`.

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del backend (sin barra final) | `https://api.lab.unah.edu.hn` |

---

## Secciones del sitio

| Sección | Anchor | Datos |
|---------|--------|-------|
| Normas aplicadas | `#normas` | API `/api/v1/normas` |
| Catálogo de servicios | `#servicios` | API `/api/v1/servicios` |
| Equipos y capacidades | `#equipos` | API `/api/v1/equipos` |
| Proceso de ensayo | `#proceso` | API `/api/v1/proceso` |
| Formulario de cotización | `#cotizacion` | API `/api/v1/cotizacion` |
| Preguntas frecuentes | `#faq` | API `/api/v1/faq` |
| Panel administrativo | `/admin` | API `/api/v1/admin/*` |

---

## Estructura del proyecto

```
lab-ic-unah/
├── src/
│   ├── App.jsx                        # Rutas: / y /admin
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx             # Responsive con hamburger menu
│   │   │   └── Footer.jsx
│   │   └── sections/
│   │       ├── HeroSection.jsx
│   │       ├── NormasSection.jsx      # Carga desde API
│   │       ├── ServiciosSection.jsx   # Carga desde API
│   │       ├── EquiposSection.jsx     # Carga desde API
│   │       ├── ProcesoSection.jsx     # Carga desde API
│   │       ├── CotizacionSection.jsx  # Formulario + mapa Leaflet
│   │       └── FAQSection.jsx         # Carga desde API
│   ├── hooks/
│   │   ├── useQuote.js                # Estado de servicios seleccionados
│   │   ├── useServicios.js            # Fetch catálogo de servicios
│   │   └── useConfiguracion.js        # Fetch datos de contacto
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   └── AdminPage.jsx              # Panel administrativo completo
│   └── assets/                        # Imágenes e íconos estáticos
├── .env.example
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Panel administrativo

Accesible en `http://localhost:5173/admin`.

Requiere la contraseña configurada en `ADMIN_KEY` del backend.

| Tab | Funcionalidad |
|-----|---------------|
| 📋 Servicios | CRUD del catálogo de ensayos con filtro por categoría |
| 🔬 Equipos | CRUD de equipos con subida de imagen |
| 📐 Normas | Editar organismos de normalización y sus etiquetas |
| 🔄 Proceso | Editar los pasos del proceso de ensayo |
| ❓ FAQ | CRUD de preguntas frecuentes |
| ⚙️ Configuración | Editar datos de contacto (email, horario, jefe de lab, etc.) |

---

## Build para producción

```bash
npm run build
```

Genera la carpeta `dist/` con los archivos estáticos optimizados.

```bash
npm run preview   # previsualizar el build localmente
```

---

## Despliegue en servidor Linux con Nginx

### 1. Generar el build (en el servidor o localmente)

```bash
VITE_API_URL=https://api.lab.unah.edu.hn npm run build
```

### 2. Subir `dist/` al servidor

```bash
scp -r dist/ usuario@servidor:/var/www/lab-frontend/
```

### 3. Configurar Nginx

```nginx
# /etc/nginx/sites-available/lab-frontend
server {
    listen 80;
    server_name lab.unah.edu.hn;

    root /var/www/lab-frontend;
    index index.html;

    # Requerido para que React Router funcione correctamente
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache agresivo para assets compilados
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
ln -s /etc/nginx/sites-available/lab-frontend /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### 4. HTTPS con Let's Encrypt

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d lab.unah.edu.hn
```

---

## CI/CD

### GitHub Actions

Crear `.github/workflows/deploy-frontend.yml` en el repositorio:

```yaml
name: Deploy — Frontend

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Instalar dependencias
        run: npm ci

      - name: Build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
        run: npm run build

      - name: Limpiar carpeta en servidor
        uses: appleboy/ssh-action@v1
        with:
          host:     ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key:      ${{ secrets.SSH_PRIVATE_KEY }}
          script:   rm -rf /var/www/lab-frontend/*

      - name: Subir build al servidor
        uses: appleboy/scp-action@v0.1.7
        with:
          host:     ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key:      ${{ secrets.SSH_PRIVATE_KEY }}
          source:   "dist/*"
          target:   "/var/www/lab-frontend"
          strip_components: 1
```

**Secrets requeridos** (`Settings → Secrets → Actions`):

| Secret | Descripción |
|--------|-------------|
| `VITE_API_URL` | URL del backend en producción |
| `SSH_HOST` | IP o dominio del servidor |
| `SSH_USER` | Usuario SSH (ej. `ubuntu`) |
| `SSH_PRIVATE_KEY` | Llave privada SSH |

> Para **GitLab CI**, crear `.gitlab-ci.yml` con un job `build` que ejecute `npm ci && npm run build` y un job `deploy` que suba `dist/` al servidor con `scp` o `rsync`.

---

## Notas importantes

- `dist/` no se sube al repositorio; lo genera el pipeline en cada deploy.
- Las variables `VITE_*` se inyectan en **tiempo de build**, no en runtime. Cambiar `VITE_API_URL` requiere un nuevo build.
- El panel `/admin` no tiene protección de ruta en el frontend — la seguridad la provee el backend mediante `ADMIN_KEY`.
