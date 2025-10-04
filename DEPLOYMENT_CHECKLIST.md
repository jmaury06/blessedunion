# 🚀 Deployment Checklist - Blessed Union Raffle

## Pre-Deployment

### 1. Configuración de Supabase

- [ ] Cuenta de Supabase creada
- [ ] Proyecto creado en Supabase
- [ ] Base de datos configurada con las tablas:
  - [ ] `links` con todos los campos
  - [ ] `purchases` con todos los campos
- [ ] Índices creados:
  ```sql
  CREATE INDEX idx_links_token ON links(token);
  CREATE INDEX idx_links_active_expires ON links(active, expires_at);
  CREATE INDEX idx_purchases_link_id ON purchases(link_id);
  CREATE INDEX idx_purchases_number ON purchases(number);
  ```
- [ ] Row Level Security (RLS) configurado (opcional pero recomendado)
- [ ] Extension UUID habilitada: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

### 2. Variables de Entorno

Crear archivo `.env.local` para desarrollo y configurar en Vercel para producción:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app
CRON_SECRET=genera_con_openssl_rand_base64_32
```

**Generar CRON_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Configuración de pnpm

- [ ] `package.json` tiene todos los scripts necesarios
- [ ] Dependencias instaladas: `pnpm install`
- [ ] Build local funciona: `pnpm build`
- [ ] No hay errores de TypeScript

### 4. Testing Local

- [ ] Todas las APIs funcionan
- [ ] Flujo completo de usuario funciona
- [ ] Números vendidos se muestran correctamente
- [ ] Links expiran correctamente
- [ ] Dashboard de admin funciona
- [ ] Animaciones son fluidas
- [ ] Responsive en mobile

---

## Deployment en Vercel

### 1. Preparar Repositorio

- [ ] Código subido a GitHub/GitLab/Bitbucket
- [ ] `.gitignore` incluye `.env.local` y `node_modules`
- [ ] README.md actualizado
- [ ] Branch `main` o `master` lista

### 2. Conectar con Vercel

1. [ ] Ir a [vercel.com](https://vercel.com)
2. [ ] Click en "Import Project"
3. [ ] Conectar con tu repositorio Git
4. [ ] Seleccionar el proyecto "blessedunion"

### 3. Configurar Build Settings

En Vercel Dashboard:

- **Framework Preset:** Next.js
- **Build Command:** `pnpm build`
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`
- **Node Version:** 18.x o superior

### 4. Configurar Environment Variables

En Vercel → Settings → Environment Variables, agregar:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_BASE_URL
CRON_SECRET
```

**Importante:** Agregar para los 3 ambientes: Production, Preview, Development

### 5. Deploy

- [ ] Click en "Deploy"
- [ ] Esperar a que termine el build
- [ ] Verificar que no hay errores

---

## Post-Deployment

### 1. Verificación Básica

- [ ] Sitio carga correctamente
- [ ] No hay errores en console del navegador
- [ ] Assets (imágenes, fonts) cargan correctamente
- [ ] CSS/TailwindCSS funciona correctamente

### 2. Testing de APIs en Producción

```bash
# Crear link
curl -X POST https://tu-dominio.vercel.app/api/create-link \
  -H "Content-Type: application/json" \
  -d '{"opportunities": 4}'

# Verificar stats
curl https://tu-dominio.vercel.app/api/stats

# Verificar sold numbers
curl https://tu-dominio.vercel.app/api/sold
```

### 3. Testing de Flujo Completo

1. [ ] Crear un link de prueba
2. [ ] Abrir el link en navegador
3. [ ] Completar formulario
4. [ ] Seleccionar números
5. [ ] Confirmar selección
6. [ ] Verificar que se guardó en Supabase

### 4. Configurar Cron Job

**Opción A: Vercel Cron (Requiere plan Pro)**

- [ ] Archivo `vercel.json` existe en el proyecto
- [ ] Variable `CRON_SECRET` configurada
- [ ] Deploy realizado (Vercel detecta automáticamente el cron)
- [ ] Verificar en Vercel Dashboard → Cron Jobs

**Opción B: GitHub Actions (Gratis)**

Crear `.github/workflows/expire-links.yml`:

```yaml
name: Expire Old Links

on:
  schedule:
    - cron: '*/5 * * * *'
  workflow_dispatch:

jobs:
  expire-links:
    runs-on: ubuntu-latest
    steps:
      - name: Call expire endpoint
        run: |
          curl -X POST https://tu-dominio.vercel.app/api/expire-links \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

Configurar secret `CRON_SECRET` en GitHub.

**Opción C: Supabase pg_cron**

- [ ] Habilitar extensión `pg_cron` en Supabase
- [ ] Ejecutar SQL de `supabase/migrations/expire_links_function.sql`

### 5. Configurar Dominio Personalizado (Opcional)

En Vercel → Settings → Domains:

1. [ ] Agregar dominio personalizado
2. [ ] Configurar DNS records
3. [ ] Esperar propagación DNS
4. [ ] Verificar SSL/HTTPS funciona
5. [ ] Actualizar `NEXT_PUBLIC_BASE_URL`

---

## Monitoreo y Mantenimiento

### 1. Analytics

- [ ] Vercel Analytics habilitado
- [ ] Configurar alertas de errores
- [ ] Monitorear uso de bandwidth

### 2. Supabase

- [ ] Configurar backups automáticos
- [ ] Revisar uso de storage
- [ ] Configurar alertas de queries lentas

### 3. Logs

Revisar regularmente:

- [ ] Logs de Vercel (errores de servidor)
- [ ] Logs de Supabase (queries)
- [ ] Browser console (errores de cliente)

### 4. Performance

- [ ] Lighthouse score > 90
- [ ] Time to First Byte < 600ms
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s

---

## Security Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` solo en server-side
- [ ] `CRON_SECRET` configurado y seguro
- [ ] No hay API keys hardcodeadas en código
- [ ] HTTPS habilitado
- [ ] CORS configurado correctamente
- [ ] RLS habilitado en Supabase (opcional)
- [ ] Rate limiting configurado (opcional)

---

## Troubleshooting

### Error: "Build failed"

1. Verificar que todas las dependencias están en `package.json`
2. Revisar logs de build en Vercel
3. Probar `pnpm build` localmente
4. Verificar versión de Node.js

### Error: "Database connection failed"

1. Verificar que variables de Supabase están correctas
2. Verificar que Supabase project está activo
3. Revisar firewall rules en Supabase

### Error: "CRON_SECRET invalid"

1. Verificar que el secret coincide entre Vercel y el request
2. Asegurarse de incluir `Bearer` en el header de Authorization

### Números vendidos no se muestran

1. Verificar que API `/api/sold` funciona
2. Revisar tabla `purchases` en Supabase
3. Verificar que constraint UNIQUE(number) existe

---

## Rollback Plan

Si algo sale mal en producción:

1. [ ] Ir a Vercel Dashboard → Deployments
2. [ ] Encontrar último deployment estable
3. [ ] Click en "..." → "Promote to Production"
4. [ ] Verificar que el rollback funcionó

---

## Go-Live Checklist Final

- [ ] Todas las features probadas
- [ ] Performance optimizada
- [ ] Cron job funcionando
- [ ] Backups configurados
- [ ] Documentación completa
- [ ] Team notificado
- [ ] Plan de soporte definido
- [ ] Monitoring activo

---

## Post-Launch

### Primera Semana

- [ ] Monitorear errores diariamente
- [ ] Revisar performance
- [ ] Verificar que cron job está corriendo
- [ ] Recolectar feedback de usuarios

### Mantenimiento Regular

- [ ] Actualizar dependencias mensualmente
- [ ] Revisar y limpiar links expirados
- [ ] Optimizar queries si es necesario
- [ ] Backup de base de datos semanalmente

---

## Contactos de Soporte

- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **Next.js Issues:** https://github.com/vercel/next.js/issues

---

✅ **¡Deployment Completo!**

URL de Producción: ___________________________

URL de Admin: ___________________________/admin

Fecha de Deploy: ___________________________
