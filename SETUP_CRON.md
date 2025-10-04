# Configuración del Sistema de Expiración de Links

Este documento explica cómo configurar el sistema automático para marcar links expirados como inactivos.

## Opciones de Implementación

### Opción 1: Vercel Cron (Recomendado para producción)

Si tu aplicación está desplegada en Vercel, puedes usar Vercel Cron Jobs.

**Requisitos:**
- Plan Pro o superior de Vercel
- Variable de entorno `CRON_SECRET` configurada en Vercel

**Pasos:**

1. El archivo `vercel.json` ya está configurado para ejecutar `/api/expire-links` cada 5 minutos.

2. Agrega la variable de entorno en Vercel Dashboard:
   ```
   CRON_SECRET=tu_secreto_aleatorio_aquí
   ```
   Genera un secreto seguro con:
   ```bash
   openssl rand -base64 32
   ```

3. Despliega la aplicación. Vercel automáticamente configurará el cron job.

4. Para verificar que funciona, ve a Vercel Dashboard > Project > Cron Jobs

---

### Opción 2: Supabase pg_cron (Alternativa)

Si prefieres ejecutar la expiración directamente en la base de datos:

**Pasos:**

1. En Supabase Dashboard, ve a **Database → Extensions**

2. Busca y habilita la extensión **pg_cron**

3. Ejecuta el SQL en `supabase/migrations/expire_links_function.sql`:
   - Ir a **SQL Editor** en Supabase
   - Copiar y ejecutar todo el contenido del archivo
   - Descomentar las líneas del `cron.schedule` al final

4. Verificar que el cron está activo:
   ```sql
   SELECT * FROM cron.job;
   ```

**Nota:** pg_cron solo está disponible en planes Pro de Supabase.

---

### Opción 3: GitHub Actions (Gratis)

Si no tienes plan Pro de Vercel ni Supabase, puedes usar GitHub Actions:

1. Crea el archivo `.github/workflows/expire-links.yml`:

```yaml
name: Expire Old Links

on:
  schedule:
    # Ejecutar cada 5 minutos
    - cron: '*/5 * * * *'
  workflow_dispatch: # Permite ejecución manual

jobs:
  expire-links:
    runs-on: ubuntu-latest
    steps:
      - name: Call expire endpoint
        run: |
          curl -X POST https://tu-dominio.vercel.app/api/expire-links \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

2. Agrega el secret `CRON_SECRET` en GitHub:
   - Ir a Settings → Secrets and variables → Actions
   - New repository secret: `CRON_SECRET`

---

## Ejecución Manual

Para probar o ejecutar manualmente:

```bash
curl -X POST https://tu-dominio.com/api/expire-links \
  -H "Authorization: Bearer TU_CRON_SECRET"
```

Respuesta esperada:
```json
{
  "ok": true,
  "expired_count": 3,
  "expired_tokens": ["abc123", "def456", "ghi789"]
}
```

---

## Variables de Entorno Necesarias

Asegúrate de tener configuradas:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
CRON_SECRET=tu_secreto_para_cron
```

---

## Monitoreo

Para verificar que los links se están expirando correctamente:

```sql
-- Ver links expirados en las últimas 24 horas
SELECT token, expires_at, active, created_at
FROM links
WHERE expires_at < NOW()
  AND expires_at > NOW() - INTERVAL '24 hours'
ORDER BY expires_at DESC;
```
