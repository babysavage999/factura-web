# 💰 Billing App Cloud - Sistema de Gestión de Facturación

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

**Sistema web moderno para la gestión integral de facturación, clientes y análisis financiero**

[Características](#-características) • [Instalación](#-instalación) • [Uso](#-uso) • [Despliegue](#-despliegue) • [Tecnologías](#-tecnologías)

</div>

---

## 📋 Descripción General del Proyecto

**Billing App Cloud** es una aplicación web moderna desarrollada con Next.js que proporciona una solución completa para la gestión de facturación empresarial. El sistema permite a las empresas gestionar sus clientes, crear y administrar facturas, y visualizar métricas financieras clave a través de un dashboard interactivo.

### ¿Por qué este proyecto?

Este proyecto fue desarrollado como solución a la necesidad de las pequeñas y medianas empresas de contar con un sistema de facturación accesible, moderno y fácil de usar. A diferencia de sistemas complejos y costosos, **Billing App Cloud** ofrece:

- **Simplicidad**: Interfaz intuitiva que no requiere capacitación extensa
- **Accesibilidad**: Funciona en cualquier navegador moderno, sin necesidad de instalación
- **Visualización de datos**: Dashboard con gráficos interactivos para análisis financiero
- **Escalabilidad**: Arquitectura preparada para crecer con las necesidades del negocio

### ¿Para qué sirve?

El sistema está diseñado para:

1. **Gestión de Clientes**: Mantener un registro completo de información de clientes (contacto, dirección, RUC/NIT)
2. **Control de Facturas**: Crear, editar y gestionar facturas con numeración consecutiva automática
3. **Análisis Financiero**: Visualizar ingresos, tendencias y métricas clave a través de gráficos interactivos
4. **Seguridad**: Sistema de autenticación que protege el acceso a información sensible
5. **Reportes**: Generar insights sobre el rendimiento financiero del negocio

---

## ✨ Características

### 🔐 Autenticación y Seguridad

- Sistema de login con credenciales seguras
- Protección de rutas mediante middleware
- Sesiones persistentes con cookies HTTP-only
- Redirección automática para usuarios no autenticados

### 👥 Gestión de Clientes (CRUD Completo)

- **Crear**: Formulario intuitivo para agregar nuevos clientes
- **Leer**: Visualización de lista de clientes con información completa
- **Actualizar**: Edición inline de datos de clientes
- **Eliminar**: Eliminación con validación (previene eliminar clientes con facturas asociadas)
- Validaciones de formulario (email, campos requeridos)
- Datos seedeados para demostración

### 📄 Gestión de Facturas (CRUD Completo)

- **Crear**: Modal para crear facturas con selección de cliente
- **Leer**: Tabla profesional con todas las facturas
- **Actualizar**: Edición de facturas existentes
- **Eliminar**: Eliminación con confirmación
- Numeración consecutiva automática (INV-00001, INV-00002, etc.)
- Estados de factura: Pagada, Pendiente, Cancelada
- Relación con clientes para validaciones

### 📊 Dashboard Analítico

- **KPIs Principales**:
  - Total Revenue (ingresos totales)
  - Total de Facturas
  - Número de Clientes
  - Promedio por Factura
- **Métricas por Estado**:

  - Facturas Pagadas
  - Facturas Pendientes
  - Facturas Canceladas

- **Gráficos Interactivos**:

  - **Revenue por Mes**: Gráfico de área mostrando ingresos de los últimos 6 meses
  - **Distribución por Estado**: Gráfico de donut con porcentajes de facturas por estado
  - **Top Clientes**: Gráfico de barras con los 5 clientes con mayor facturación

- **Tabla de Facturas Recientes**: Últimas 5 facturas creadas

### 🎨 Interfaz de Usuario

- Diseño moderno y profesional con shadcn/ui
- Responsive design (funciona en móviles, tablets y desktop)
- Tema claro/oscuro compatible
- Componentes reutilizables y consistentes
- Animaciones y transiciones suaves

---

## 🚀 Instalación

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 20.x o superior
- **pnpm** (recomendado) o npm
- **Git** para clonar el repositorio

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd factura-web/billing.app.cloud
   ```

2. **Instalar dependencias**

   ```bash
   pnpm install
   # o si usas npm
   npm install
   ```

3. **Ejecutar en modo desarrollo**

   ```bash
   pnpm dev
   # o
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Credenciales de Acceso

Para acceder al sistema, utiliza las siguientes credenciales:

- **Email**: `admin@example.com`
- **Contraseña**: `admin123`

---

## 💻 Uso

### Primeros Pasos

1. **Iniciar Sesión**

   - Navega a `/login`
   - Ingresa las credenciales proporcionadas
   - Serás redirigido automáticamente al dashboard

2. **Explorar el Dashboard**

   - Visualiza las métricas principales
   - Revisa los gráficos interactivos
   - Explora las facturas recientes

3. **Gestionar Clientes**

   - Ve a la sección "Clientes" en el menú
   - Haz clic en "Nuevo Cliente" para agregar uno
   - Edita o elimina clientes según sea necesario

4. **Crear Facturas**
   - Navega a "Facturas"
   - Haz clic en "Nueva Factura"
   - Selecciona un cliente, ingresa la fecha, monto y estado
   - La numeración se genera automáticamente

### Funcionalidades Clave

#### Gestión de Clientes

- Los clientes pueden tener facturas asociadas
- No se puede eliminar un cliente que tenga facturas (validación automática)
- Todos los campos son validados antes de guardar

#### Gestión de Facturas

- Las facturas se numeran consecutivamente (INV-00001, INV-00002, etc.)
- El revenue total solo cuenta las facturas con estado "Pagada"
- Las facturas se pueden filtrar y visualizar por estado

#### Dashboard

- Los gráficos se actualizan automáticamente cuando cambian los datos
- El revenue por mes muestra los últimos 6 meses
- Los datos se cargan desde localStorage (persistencia local)

---

## 🌐 Despliegue

### ¿Por qué Vercel?

**Vercel** es la plataforma de despliegue ideal para este proyecto por las siguientes razones:

#### 1. **Infraestructura en AWS**

Vercel utiliza la infraestructura de **Amazon Web Services (AWS)** como base, lo que garantiza:

- **Alta disponibilidad**: Red global de servidores con 99.99% de uptime
- **Escalabilidad automática**: Se adapta automáticamente al tráfico
- **Baja latencia**: Edge Network distribuida globalmente
- **Seguridad empresarial**: Certificaciones SOC 2, ISO 27001, y más

#### 2. **Optimizado para Next.js**

- Desarrollado por el mismo equipo que creó Next.js
- Optimizaciones automáticas para React Server Components
- Serverless Functions integradas
- Edge Functions para máximo rendimiento

#### 3. **Despliegue Continuo (CI/CD)**

- Integración automática con Git (GitHub, GitLab, Bitbucket)
- Preview deployments para cada pull request
- Rollback instantáneo en caso de problemas
- Builds optimizados y caching inteligente

#### 4. **Características Adicionales**

- **SSL automático**: Certificados HTTPS gratuitos
- **CDN global**: Contenido servido desde la ubicación más cercana
- **Analytics integrado**: Métricas de rendimiento y uso
- **Environment variables**: Gestión segura de variables de entorno

### Despliegue en Vercel

#### Opción 1: Despliegue desde GitHub (Recomendado)

1. **Preparar el repositorio**

   ```bash
   git add .
   git commit -m "Preparar para despliegue"
   git push origin main
   ```

2. **Conectar con Vercel**

   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta de GitHub
   - Haz clic en "Add New Project"
   - Selecciona tu repositorio

3. **Configurar el proyecto**

   - Framework Preset: **Next.js** (detectado automáticamente)
   - Root Directory: `billing.app.cloud`
   - Build Command: `pnpm build` (o `npm run build`)
   - Output Directory: `.next` (automático)

4. **Variables de entorno** (si las necesitas)

   - Agrega variables en la sección "Environment Variables"
   - Para este proyecto, no se requieren variables adicionales

5. **Desplegar**
   - Haz clic en "Deploy"
   - Espera a que termine el build
   - Tu aplicación estará disponible en `tu-proyecto.vercel.app`

#### Opción 2: Despliegue con Vercel CLI

1. **Instalar Vercel CLI**

   ```bash
   npm i -g vercel
   # o
   pnpm add -g vercel
   ```

2. **Iniciar sesión**

   ```bash
   vercel login
   ```

3. **Desplegar**

   ```bash
   cd billing.app.cloud
   vercel
   ```

4. **Desplegar a producción**
   ```bash
   vercel --prod
   ```

### Configuración Post-Despliegue

1. **Dominio personalizado** (opcional)

   - Ve a Project Settings > Domains
   - Agrega tu dominio personalizado
   - Configura los registros DNS según las instrucciones

2. **Environment Variables** (si es necesario)

   - Project Settings > Environment Variables
   - Agrega variables para producción

3. **Monitoreo**
   - Revisa Analytics en el dashboard de Vercel
   - Configura alertas si es necesario

### Ventajas del Despliegue en Vercel

✅ **Gratis para proyectos personales**  
✅ **Despliegue en menos de 2 minutos**  
✅ **SSL automático y gratuito**  
✅ **CDN global incluido**  
✅ **Preview deployments para testing**  
✅ **Rollback con un clic**  
✅ **Integración perfecta con Next.js**  
✅ **Infraestructura AWS de clase empresarial**

---

## 🛠️ Tecnologías Utilizadas

### Frontend Framework

- **Next.js 16.0.3**: Framework React con Server-Side Rendering (SSR) y Static Site Generation (SSG)
  - **¿Por qué?**: Rendimiento optimizado, SEO mejorado, y routing automático

### Lenguaje de Programación

- **TypeScript 5.0**: Superset tipado de JavaScript
  - **¿Por qué?**: Detección temprana de errores, mejor autocompletado, y código más mantenible

### Librería UI

- **React 19.2.0**: Librería para construir interfaces de usuario
  - **¿Por qué?**: Componentes reutilizables, virtual DOM eficiente, y ecosistema robusto

### Estilos

- **Tailwind CSS 4.0**: Framework CSS utility-first
  - **¿Por qué?**: Desarrollo rápido, diseño responsive fácil, y bundle size optimizado

### Componentes UI

- **shadcn/ui**: Componentes de UI construidos sobre Radix UI
  - **¿Por qué?**: Componentes accesibles, personalizables, y con excelente UX

### Gráficos

- **Recharts 3.4.1**: Librería de gráficos para React
  - **¿Por qué?**: Gráficos interactivos, responsive, y fácil integración con React

### Iconos

- **Lucide React 0.554.0**: Librería de iconos moderna
  - **¿Por qué?**: Iconos consistentes, ligeros, y con buen soporte de TypeScript

### Utilidades

- **class-variance-authority**: Para variantes de componentes
- **clsx**: Para combinar clases de CSS condicionalmente
- **tailwind-merge**: Para fusionar clases de Tailwind sin conflictos

### Almacenamiento

- **localStorage**: Almacenamiento local del navegador
  - **¿Por qué?**: Persistencia de datos sin necesidad de backend, ideal para prototipos y MVPs

### Autenticación

- **Cookies HTTP-only**: Para manejo seguro de sesiones
  - **¿Por qué?**: Protección contra XSS, sesiones persistentes, y seguridad mejorada

---

## 📁 Estructura del Proyecto

```
billing.app.cloud/
├── app/                          # App Router de Next.js
│   ├── api/                      # API Routes
│   │   └── login/                # Endpoint de autenticación
│   ├── dashboard/                # Rutas protegidas del dashboard
│   │   ├── clients/              # Gestión de clientes
│   │   ├── invoices/             # Gestión de facturas
│   │   └── page.tsx              # Dashboard principal
│   ├── login/                    # Página de login
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Página de inicio
│   └── globals.css               # Estilos globales
├── components/                   # Componentes React
│   ├── ui/                       # Componentes UI de shadcn
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── chart.tsx
│   │   ├── field.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   └── login-form.tsx            # Formulario de login
├── lib/                          # Utilidades y lógica de negocio
│   ├── auth.ts                   # Funciones de autenticación
│   ├── dashboard.ts              # Cálculo de métricas
│   ├── storage.ts                # Gestión de localStorage
│   ├── types.ts                  # Tipos TypeScript
│   └── utils.ts                  # Utilidades generales
├── middleware.ts                 # Middleware de Next.js para protección de rutas
├── components.json               # Configuración de shadcn/ui
├── next.config.ts                # Configuración de Next.js
├── package.json                  # Dependencias del proyecto
├── tsconfig.json                 # Configuración de TypeScript
└── README.md                     # Este archivo
```

---

## 🔒 Seguridad

### Medidas Implementadas

1. **Autenticación**

   - Credenciales hardcodeadas para demostración (en producción usar base de datos)
   - Cookies HTTP-only para prevenir XSS
   - Middleware de protección de rutas

2. **Validación**

   - Validación de formularios en cliente
   - Validación de tipos con TypeScript
   - Sanitización de inputs

3. **Protección de Rutas**
   - Middleware que verifica autenticación
   - Redirección automática a login
   - Prevención de acceso no autorizado

---

## 🧪 Testing y Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia servidor de desarrollo

# Producción
pnpm build        # Construye la aplicación para producción
pnpm start        # Inicia servidor de producción

# Linting
pnpm lint         # Ejecuta ESLint
```

### Datos de Prueba

El sistema incluye datos seedeados para facilitar las pruebas:

- **3 Clientes** predefinidos
- **3 Facturas** distribuidas en diferentes meses
- Credenciales de acceso: `admin@example.com` / `admin123`

---

## 🚧 Limitaciones y Mejoras Futuras

### Limitaciones Actuales

- Almacenamiento local (localStorage) - los datos se pierden al limpiar el navegador
- Autenticación hardcodeada - no hay base de datos de usuarios
- Sin backend - toda la lógica está en el cliente

### Mejoras Futuras

- [ ] Integración con base de datos (PostgreSQL/MongoDB)
- [ ] Sistema de autenticación completo con JWT
- [ ] API REST para operaciones CRUD
- [ ] Exportación de facturas a PDF
- [ ] Envío de facturas por email
- [ ] Reportes avanzados
- [ ] Multi-tenancy (múltiples empresas)
- [ ] Integración con sistemas de pago
- [ ] App móvil (React Native)

---

## 📚 Recursos y Documentación

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Recharts Documentation](https://recharts.org)
- [Vercel Documentation](https://vercel.com/docs)

---

## 👥 Autores

**Equipo de Desarrollo**

- **Nombre del Estudiante/Equipo**
  - Universidad: [Nombre de la Universidad]
  - Carrera: [Nombre de la Carrera]
  - Curso: [Nombre del Curso]
  - Año: 2024

### Contribuciones

Este proyecto fue desarrollado como parte de un proyecto académico para demostrar conocimientos en:

- Desarrollo web moderno
- Frameworks React y Next.js
- TypeScript
- Diseño de interfaces de usuario
- Gestión de estado y datos
- Despliegue en la nube

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos. Todos los derechos reservados.

---

## 🙏 Agradecimientos

- **Vercel** por proporcionar una plataforma de despliegue excepcional
- **shadcn** por los componentes UI de alta calidad
- **Next.js Team** por el framework increíble
- **Comunidad Open Source** por las herramientas y librerías utilizadas

---

<div align="center">

**Desarrollado con ❤️ para la gestión eficiente de facturación**

[Reportar un Bug](https://github.com/tu-usuario/tu-repo/issues) • [Solicitar una Feature](https://github.com/tu-usuario/tu-repo/issues)

</div>
