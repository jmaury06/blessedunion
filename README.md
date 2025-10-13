# Rifa Digital - Raffle Management System

Sistema profesional de gestión de rifas. Permite a los compradores seleccionar números de rifa mediante links únicos con expiración automática.

## 🎯 Características

- 1000 números de rifa (000-999)
- Links únicos con tokens encriptados
- Expiración automática de links a los 30 minutos
- Selección múltiple de números (2, 4, 6, 8 o 10 por comprador)
- Validación en tiempo real de números ya vendidos
- Interfaz responsive con TailwindCSS
- Animaciones con Framer Motion

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** TailwindCSS
- **Animaciones:** Framer Motion
- **Base de datos:** Supabase (PostgreSQL)
- **Package Manager:** pnpm
- **Optimización:** Preact en producción

## 📋 Requisitos Previos

- Node.js 18+
- pnpm
- Cuenta de Supabase

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone <tu-repo>
cd rifa-digital
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CRON_SECRET=secreto_aleatorio_para_cron
```

4. Configurar base de datos:

Ver archivo [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) para las migraciones SQL necesarias.

5. Iniciar servidor de desarrollo:
```bash
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── [token]/          # Página dinámica para cada link único
│   ├── api/              # API Routes
│   │   ├── create-link/  # Crear nuevo link
│   │   ├── link/[token]/ # Obtener info del link
│   │   ├── save-buyer/   # Guardar datos del comprador
│   │   ├── claim-numbers/# Reclamar números seleccionados
│   │   ├── sold/         # Obtener números vendidos
│   │   └── expire-links/ # Expirar links antiguos (cron)
│   └── components/
│       ├── BuyerForm.tsx # Formulario de datos
│       └── RaffleBoard.tsx # Tablero de selección
```

## 🔄 Flujo de Usuario

1. **Comprador recibe link único**: `https://misitio.com/abc123`
2. **Primera visita**: Completa formulario con nombre, email y teléfono
3. **Selección de números**: 
   - Ve tablero con números 000-999
   - Números vendidos aparecen deshabilitados
   - Selecciona sus números según oportunidades disponibles
4. **Confirmación**: 
   - Al completar selección, se registran en DB
   - Link se marca como inactivo
   - Mensaje de éxito y redirección

## 📡 API Endpoints

### POST `/api/create-link`
Crea un nuevo link único.

**Body:**
```json
{
  "opportunities": 4
}
```

**Response:**
```json
{
  "ok": true,
  "link": "https://misitio.com/abc123"
}
```

---

### GET `/api/link/[token]`
Obtiene información del link.

**Response:**
```json
{
  "ok": true,
  "link": {
    "token": "abc123",
    "opportunities": 4,
    "remaining": 2,
    "active": true,
    "buyer_name": "Juan Pérez",
    "expires_at": "2024-01-01T12:30:00Z"
  }
}
```

---

### POST `/api/save-buyer`
Guarda datos del comprador.

**Body:**
```json
{
  "token": "abc123",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+1234567890"
}
```

---

### POST `/api/claim-numbers`
Registra los números seleccionados.

**Body:**
```json
{
  "token": "abc123",
  "numbers": ["001", "042", "137", "999"]
}
```

**Response:**
```json
{
  "ok": true,
  "remaining": 0,
  "deactivated": true
}
```

---

### GET `/api/sold`
Obtiene lista de números ya vendidos.

**Response:**
```json
{
  "ok": true,
  "sold": ["000", "001", "042"]
}
```

## ⏰ Sistema de Expiración Automática

Ver archivo [`SETUP_CRON.md`](./SETUP_CRON.md) para configurar la expiración automática de links.

**Opciones:**
- Vercel Cron (Recomendado)
- Supabase pg_cron
- GitHub Actions

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e
```

## 📦 Build y Deploy

```bash
# Build de producción
pnpm build

# Preview del build
pnpm start
```

### Deploy en Vercel

1. Push a GitHub
2. Importar proyecto en Vercel
3. Configurar variables de entorno
4. Deploy automático en cada push

## 📚 Documentación Adicional

- [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) - Esquema de base de datos
- [`SETUP_CRON.md`](./SETUP_CRON.md) - Configuración de cron jobs

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto es privado.

## 👥 Autores

- Tu nombre - Desarrollo inicial
