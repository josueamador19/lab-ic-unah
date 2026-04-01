// ─── SERVICIOS ───────────────────────────────────────────────────────────────

export const SERVICIOS = {
  suelos: {
    label: '⛏ Ensayos de Suelos',
    pill: 'SU-01 — SU-22',
    norma: 'ASTM / AASHTO',
    items: [
      { code: 'SU-01', name: 'Contenido de Humedad',   norma: 'ASTM D2216' },
      { code: 'SU-02', name: 'Granulometría',          norma: 'ASTM D6913 / AASHTO T88' },
      { code: 'SU-04', name: 'Límite Líquido',         norma: 'ASTM D4318 / AASHTO T89' },
      { code: 'SU-05', name: 'Límite Plástico',        norma: 'ASTM D4318 / AASHTO T90' },
      { code: 'SU-09', name: 'Clasificación de Suelo', norma: 'ASTM D2487 / AASHTO M145' },
      { code: 'SU-10', name: 'Proctor Estándar',       norma: 'ASTM D698 / AASHTO T99' },
      { code: 'SU-11', name: 'Proctor Modificado',     norma: 'ASTM D1557 / AASHTO T180' },
      { code: 'SU-19', name: 'Peso Específico',        norma: 'ASTM D854 / AASHTO T100' },
      { code: 'SU-21', name: 'Peso Volumétrico',       norma: 'ASTM D7263' },
      { code: 'SU-22', name: 'Hidrometría',            norma: 'ASTM D7928 / AASHTO T88' },
    ],
  },
  concreto: {
    label: '🏗 Ensayos de Concreto',
    pill: 'CU-01 — CU-04',
    norma: 'ASTM',
    items: [
      { code: 'CU-01', name: 'Curado de Cilindros', norma: 'ASTM C31 / AASHTO T23' },
      { code: 'CU-04', name: 'Rotura de Cilindros', norma: 'ASTM C39 / AASHTO T22' },
    ],
  },
  agregados: {
    label: '⚙ Ensayos de Agregados',
    pill: 'AG-02 — AG-08',
    norma: 'ASTM',
    items: [
      { code: 'AG-02', name: 'Desgaste Los Ángeles',     norma: 'ASTM C131 / AASHTO T96' },
      { code: 'AG-04', name: 'Peso Unitario con Golpes', norma: 'ASTM C29 / AASHTO T19' },
      { code: 'AG-05', name: 'Peso Unitario sin Golpes', norma: 'ASTM C29 / AASHTO T19' },
      { code: 'AG-08', name: 'Alterabilidad por Sulfatos', norma: 'ASTM C88 / AASHTO T104' },
    ],
  },
  acero: {
    label: '🔩 Ensayos de Acero de Refuerzo',
    pill: 'AC-01 — AC-03',
    norma: 'ASTM A615',
    items: [
      { code: 'AC-01', name: 'Varillas a Tensión — Fluencia y Elongación', sub: 'No. 11, 10 y 8', norma: 'ASTM A615 / ASTM E8' },
      { code: 'AC-02', name: 'Varillas a Tensión — Fluencia y Elongación', sub: 'No. 6 y 8',      norma: 'ASTM A615 / ASTM E8' },
      { code: 'AC-03', name: 'Varillas a Tensión — Fluencia y Elongación', sub: 'No. 4 y 3',      norma: 'ASTM A615 / ASTM E8' },
    ],
  },
}

export const TOPOGRAFIA = {
  catastral: {
    label: '🗺 Topografía Catastral',
    pill: 'ST-01 — ST-03',
    items: [
      { code: 'ST-01', name: 'Tegucigalpa (TGU)',          note: 'Tarifa por día de trabajo en campo' },
      { code: 'ST-02', name: 'San Pedro Sula (SPS)',        note: 'Tarifa por día de trabajo en campo' },
      { code: 'ST-03', name: 'Tierra Adentro / Interior',  note: 'Incluye viáticos según zona de destino' },
    ],
  },
  ingenieria: {
    label: '🗺 Topografía para Proyectos de Ingeniería',
    pill: 'ST-04',
    items: [
      { code: 'ST-04', name: 'Proyectos de Ingeniería', note: 'Tarifa por día de trabajo en campo' },
    ],
  },
}

// ─── NORMAS ──────────────────────────────────────────────────────────────────

export const NORMAS_CARDS = [
  {
    id: 'astm',
    icon: { text: 'ASTM', style: { background: 'linear-gradient(135deg,#1a3a6e,#0d2045)', color: '#90c8f8' } },
    title: 'ASTM International',
    sub: 'American Society for Testing and Materials',
    desc: 'Principal referencia técnica para ensayos de materiales de construcción. Sus métodos estandarizados garantizan reproducibilidad y comparabilidad de resultados a nivel internacional.',
    tags: ['ASTM D698', 'ASTM D1557', 'ASTM D4318', 'ASTM D2216', 'ASTM C39', 'ASTM A615'],
  },
  {
    id: 'aashto',
    icon: { text: 'AASHTO', style: { background: 'linear-gradient(135deg,#1e4d2b,#0f2916)', color: '#7ecf8a', fontSize: '0.6rem' } },
    title: 'AASHTO',
    sub: 'American Association of State Highway and Transportation Officials',
    desc: 'Normas específicas para materiales y ensayos en infraestructura vial. Complementa la normativa ASTM con requisitos orientados a carreteras, puentes y obras de transporte.',
    tags: ['AASHTO T99', 'AASHTO T180', 'AASHTO T89', 'AASHTO T90', 'AASHTO T88', 'AASHTO T193'],
  },
  {
    id: 'aci',
    icon: { text: 'ACI', style: { background: 'linear-gradient(135deg,#6b1a1a,#3d0f0f)', color: '#f0a0a0' } },
    title: 'ACI — American Concrete Institute',
    sub: 'Normas de diseño y control de calidad del concreto',
    desc: 'Estándares para diseño de mezclas, control de resistencia y práctica de colocación del concreto estructural. Referencia fundamental en proyectos de edificación e infraestructura.',
    tags: ['ACI 211', 'ACI 214', 'ACI 301', 'ACI 318'],
  },
  {
    id: 'iso',
    icon: { text: 'ISO', style: { background: 'linear-gradient(135deg,#8a6a00,#5a4400)', color: '#FFFF00' } },
    title: 'ISO — International Organization for Standardization',
    sub: 'Normas de gestión y calidad de laboratorio',
    desc: 'Marco normativo para sistemas de gestión de calidad, calibración de equipos y aseguramiento de resultados. La norma ISO/IEC 17025 es la referencia internacional para la competencia técnica de laboratorios de ensayo.',
    tags: ['ISO 9001', 'ISO/IEC 17025'],
  },
  {
    id: 'nth',
    icon: { text: 'NTH\nHN', style: { background: 'linear-gradient(135deg,#1b2d50,#0a1a3a)', color: '#90c8f8', fontSize: '0.6rem', lineHeight: 1.2, whiteSpace: 'pre' } },
    title: 'Normas Técnicas de Honduras',
    sub: 'SOPTRAVI / SINIT — Marco nacional',
    desc: 'Normativas nacionales emitidas por la Secretaría de Infraestructura y Servicios Públicos de Honduras para obras públicas, carreteras y construcción civil en el territorio nacional.',
    tags: ['Manual de Carreteras HN', 'SOPTRAVI', 'SINIT', 'Especificaciones Generales'],
  },
]

export const ENSAYOS_NORMA = {
  suelos: {
    label: '⛏ Suelos',
    cols: ['Código', 'Ensayo', 'Norma ASTM', 'Norma AASHTO'],
    rows: [
      { code: 'SU-01', name: 'Contenido de Humedad',   astm: 'ASTM D2216',  aashto: 'AASHTO T265' },
      { code: 'SU-02', name: 'Granulometría',          astm: 'ASTM D6913',  aashto: 'AASHTO T88' },
      { code: 'SU-04', name: 'Límite Líquido',         astm: 'ASTM D4318',  aashto: 'AASHTO T89' },
      { code: 'SU-05', name: 'Límite Plástico',        astm: 'ASTM D4318',  aashto: 'AASHTO T90' },
      { code: 'SU-09', name: 'Clasificación de Suelo', astm: 'ASTM D2487',  aashto: 'AASHTO M145' },
      { code: 'SU-10', name: 'Proctor Estándar',       astm: 'ASTM D698',   aashto: 'AASHTO T99' },
      { code: 'SU-11', name: 'Proctor Modificado',     astm: 'ASTM D1557',  aashto: 'AASHTO T180' },
    ],
  },
  concreto: {
    label: '🏗 Concreto',
    cols: ['Código', 'Ensayo', 'Norma ASTM', 'Referencia ACI'],
    rows: [
      { code: 'CO-01', name: 'Resistencia a Compresión (cilindros)', astm: 'ASTM C39',  aashto: 'ACI 214' }
    ],
  },
  agregados: {
    label: '⚙ Agregados',
    cols: ['Código', 'Ensayo', 'Norma ASTM', ''],
    rows: [
      { code: 'AG-08', name: 'Alterabilidad en Sulfatos',        astm: 'ASTM C88',  aashto: '' },
    ],
  },
  acero: {
    label: '🔩 Acero',
    cols: ['Código', 'Ensayo', 'Norma ASTM', ''],
    rows: [
      { code: 'AC-01', name: 'Tensión — Carga de Fluencia y Rotura', astm: 'ASTM A370', aashto: '' },
    ],
  },
}

export const PROCESO_STEPS = [
  { num: '01', title: 'Solicitud', desc: 'Complete el formulario de cotización en línea con los ensayos requeridos y datos del proyecto.' },
  { num: '02', title: 'Cotización', desc: 'Nuestro equipo revisará su solicitud y le enviará una cotización formal en un plazo de 24 horas hábiles.' },
  { num: '03', title: 'Muestreo', desc: 'Coordine la entrega o recolección de muestras según los protocolos establecidos por cada norma técnica.' },
  { num: '04', title: 'Resultados', desc: 'Recibirá un informe técnico oficial con los resultados, gráficas y conclusiones del ensayo realizado.' },
]
 // Equipos
import topografia from '../assets/topografia.png'
import maquinaDeDesgaste       from '../assets/maquina_de_desgaste.jpg'
import equipoHidrometria   from '../assets/EquipoDeHidrometria.jpg'
import granulometria      from '../assets/granulometria.jpg'
import compresionuniversal      from '../assets/compresionuniversal.jpg'

export const EQUIPOS = [
  {
    title: 'Topografía',
    desc: 'Ofrecemos levantamientos topográficos catastrales, planimétricos y altimétricos para proyectos de construcción e ingeniería. Contamos con estación total de alta precisión y dron RTK para fotogrametría aérea, cubriendo zonas urbanas y rurales en Tegucigalpa, San Pedro Sula e interior del país.',
    specs: null ,// ['spec1', 'spec2', 'spec3'], // agregar especificaciones técnicas relevantes
    badge: 'Topografía',
    img: topografia, 
  },
  {
    title: 'Maquina de Desgaste L.A',
    desc: 'Equipo para determinar la resistencia al desgaste de agregados gruesos mediante abrasión e impacto. Ensayo bajo norma ASTM C131 / AASHTO T96.',
    specs:null ,// ['spec1', 'spec2', 'spec3'], // agregar especificaciones técnicas relevantes
    badge: 'Agregados · AG-02',
    img: maquinaDeDesgaste,
  },
  {
    title: 'Equipo de Hidrometría',
    desc: 'Determinación de la distribución granulométrica de suelos finos mediante sedimentación. Análisis de partículas menores a 0.075 mm bajo norma ASTM D7928 / AASHTO T88.',
    specs: null ,// ['spec1', 'spec2', 'spec3'], // agregar especificaciones técnicas relevantes
    badge: 'Suelos · SU-22',
    img: equipoHidrometria, 
  },
  {
    title: 'Granulometría y Copa de Casagrande',
    desc: 'Juego de tamices para análisis granulométrico (ASTM D6913) y copa de Casagrande para determinación del límite líquido de suelos (ASTM D4318 / AASHTO T89).',
    specs: null ,// ['spec1', 'spec2', 'spec3'], // agregar especificaciones técnicas relevantes
    badge: 'Suelos · SU-02 / SU-04',
    img: granulometria, 
  },
  {
    title: 'Máquina de Compresión Universal',
    desc: 'Prensa hidráulica para ensayo de resistencia a la compresión de cilindros y bloques de concreto. Capacidad hasta 2,000 kN bajo norma ASTM C39 / AASHTO T22.',
    specs: null ,// ['spec1', 'spec2', 'spec3'], // agregar especificaciones técnicas relevantes
    badge: 'Concreto · CU-04',
    img: compresionuniversal, 
  },
]

export const STATS = [
  { num: '20+', label: 'Tipos de Ensayo' },
  { num: '5',   label: 'Categorías' },
  { num: 'ASTM / AASHTO', label: 'Normas Aplicadas' },
  { num: 'UNAH / FUNDAUNAH', label: 'En colaboración con' },
]
