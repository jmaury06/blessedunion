# Guía de Testing - Blessed Union Raffle

Esta guía te ayudará a probar todas las funcionalidades de la aplicación de rifa.

## Pre-requisitos

1. Base de datos configurada en Supabase
2. Variables de entorno configuradas
3. Servidor de desarrollo corriendo: `pnpm dev`

---

## 1. Testing de Creación de Links

### Crear un link de prueba

```bash
curl -X POST http://localhost:3000/api/create-link \
  -H "Content-Type: application/json" \
  -d '{"opportunities": 4}'
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "link": "http://localhost:3000/abc123def456"
}
```

### Probar diferentes cantidades de oportunidades:

```bash
# 2 oportunidades
curl -X POST http://localhost:3000/api/create-link \
  -H "Content-Type: application/json" \
  -d '{"opportunities": 2}'

# 10 oportunidades
curl -X POST http://localhost:3000/api/create-link \
  -H "Content-Type: application/json" \
  -d '{"opportunities": 10}'
```

### Validar error con oportunidades inválidas:

```bash
curl -X POST http://localhost:3000/api/create-link \
  -H "Content-Type: application/json" \
  -d '{"opportunities": 5}'
```

**Debería retornar error 400**

---

## 2. Testing del Flujo de Usuario

### Paso 1: Abrir el link generado

1. Copiar la URL del link creado
2. Abrir en navegador
3. **Verificar:** Se muestra el formulario de datos del comprador

### Paso 2: Completar formulario

1. Ingresar nombre: `Juan Pérez`
2. Ingresar email: `juan@example.com`
3. Ingresar teléfono: `+52 123 456 7890`
4. Click en "Comenzar"
5. **Verificar:** Se muestra el tablero de números

### Paso 3: Seleccionar números

1. Click en varios números (según oportunidades disponibles)
2. **Verificar:** 
   - Los números se marcan en verde
   - El contador de "Oportunidades restantes" disminuye
   - Al llegar a 0, aparece botón "Confirmar selección"

### Paso 4: Confirmar selección

1. Click en "Confirmar selección"
2. **Verificar:**
   - Aparece mensaje de éxito con emoji 🎉
   - Redirección automática después de 3 segundos

---

## 3. Testing de Validaciones

### A. Link Expirado

**SQL para simular expiración:**
```sql
UPDATE links 
SET expires_at = NOW() - INTERVAL '1 hour'
WHERE token = 'tu_token_aqui';
```

Abrir el link → **Debe mostrar mensaje de expiración**

### B. Link Inactivo

**SQL:**
```sql
UPDATE links 
SET active = false
WHERE token = 'tu_token_aqui';
```

Abrir el link → **Debe mostrar "Link Inválido"**

### C. Números ya vendidos

1. Crear primer link y comprar números: `000, 001, 002, 003`
2. Crear segundo link
3. Intentar comprar `001` en el segundo link
4. **Verificar:** El número `001` aparece deshabilitado (gris)

### D. Intentar seleccionar más números de los permitidos

1. Link con 2 oportunidades
2. Seleccionar 2 números
3. Intentar click en un tercero
4. **Verificar:** No permite seleccionarlo

---

## 4. Testing de APIs

### Consultar información de un link

```bash
curl http://localhost:3000/api/link/abc123def456
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "link": {
    "token": "abc123def456",
    "opportunities": 4,
    "remaining": 4,
    "active": true,
    "buyer_name": null,
    "buyer_email": null,
    "buyer_phone": null,
    "expires_at": "2024-01-01T12:30:00Z"
  }
}
```

### Consultar números vendidos

```bash
curl http://localhost:3000/api/sold
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "sold": ["000", "001", "042", "137"]
}
```

### Consultar estadísticas

```bash
curl http://localhost:3000/api/stats
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "stats": {
    "links": {
      "total": 5,
      "active": 2,
      "expired": 3
    },
    "numbers": {
      "sold": 24,
      "available": 976,
      "total": 1000,
      "percentage": "2.40"
    },
    "opportunities": {
      "total": 20,
      "used": 24,
      "remaining": -4
    }
  }
}
```

---

## 5. Testing de Expiración Automática

### Probar endpoint de expiración manual

```bash
curl -X POST http://localhost:3000/api/expire-links \
  -H "Authorization: Bearer tu_cron_secret_aqui"
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "expired_count": 3,
  "expired_tokens": ["token1", "token2", "token3"]
}
```

### Verificar en base de datos

```sql
SELECT token, active, expires_at 
FROM links 
WHERE expires_at < NOW()
ORDER BY expires_at DESC;
```

Todos los links expirados deben tener `active = false`

---

## 6. Testing del Dashboard de Admin

1. Abrir: `http://localhost:3000/admin`
2. **Verificar:**
   - Se muestran todas las estadísticas
   - Los números son correctos
   - Las animaciones funcionan
   - El botón "Actualizar Stats" recarga la página

---

## 7. Testing de Escenarios Extremos

### A. Comprar el último número disponible

1. Crear compras hasta tener 999 números vendidos
2. Crear un link con 1 oportunidad
3. Comprar el número 999
4. **Verificar:** Todos los números están deshabilitados para nuevos links

### B. Link con 10 oportunidades

1. Crear link con 10 oportunidades
2. Seleccionar 10 números
3. Confirmar
4. **Verificar:** 
   - Se crean 10 registros en `purchases`
   - El link queda con `remaining = 0` y `active = false`

### C. Múltiples usuarios simultáneos

1. Abrir 3 pestañas con diferentes links
2. Seleccionar números simultáneamente
3. **Verificar:** No se permite comprar el mismo número dos veces

---

## 8. Testing de Performance

### Cargar tablero con 1000 botones

1. Abrir un link
2. Usar DevTools → Performance
3. **Verificar:**
   - El tablero carga en < 2 segundos
   - Las animaciones son fluidas (60 FPS)
   - No hay memory leaks

### Testing de carga de base de datos

```sql
-- Insertar 100 links de prueba
INSERT INTO links (token, opportunities, remaining, expires_at)
SELECT 
  md5(random()::text),
  (ARRAY[2,4,6,8,10])[floor(random() * 5 + 1)],
  (ARRAY[2,4,6,8,10])[floor(random() * 5 + 1)],
  NOW() + INTERVAL '30 minutes'
FROM generate_series(1, 100);
```

Verificar que `/api/stats` sigue respondiendo rápido.

---

## 9. Checklist de Testing Completo

- [ ] Crear link con cada opción de oportunidades (2, 4, 6, 8, 10)
- [ ] Completar flujo completo usuario (formulario → selección → confirmación)
- [ ] Verificar que números vendidos aparecen deshabilitados
- [ ] Probar link expirado
- [ ] Probar link inactivo
- [ ] Probar seleccionar más números de los permitidos
- [ ] Verificar que no se puede comprar el mismo número dos veces
- [ ] Dashboard de admin muestra stats correctos
- [ ] Endpoint de expiración funciona
- [ ] Animaciones son fluidas en mobile
- [ ] Responsive en diferentes tamaños de pantalla
- [ ] Formulario valida campos correctamente
- [ ] Mensajes de error son claros

---

## 10. Testing en Producción

Antes de lanzar, verificar:

1. **Variables de entorno** están configuradas en Vercel
2. **Cron job** está activo y funcionando
3. **Base de datos** tiene los índices correctos
4. **SSL/HTTPS** está habilitado
5. **Rate limiting** está configurado (opcional)

### Smoke Test en Producción

```bash
# Crear link
curl -X POST https://tu-dominio.vercel.app/api/create-link \
  -H "Content-Type: application/json" \
  -d '{"opportunities": 2}'

# Verificar stats
curl https://tu-dominio.vercel.app/api/stats

# Verificar números vendidos
curl https://tu-dominio.vercel.app/api/sold
```

---

## Herramientas Recomendadas

- **Postman/Insomnia**: Para testing de APIs
- **Chrome DevTools**: Para debugging del frontend
- **Supabase Dashboard**: Para verificar datos en DB
- **Vercel Analytics**: Para monitorear performance en producción
- **Playwright**: Para E2E testing automatizado (opcional)

---

## Reporte de Bugs

Si encuentras un bug:

1. Anota los pasos para reproducirlo
2. Captura screenshots/videos
3. Revisa console del navegador
4. Revisa logs en Vercel
5. Verifica datos en Supabase
