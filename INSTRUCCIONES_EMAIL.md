# 🔧 Instrucciones para Configurar el Email de Confirmación

## ⚠️ Problema Identificado

Los correos de confirmación no están llegando a los clientes por **2 razones principales**:

### 1. **Falta la API Key de Resend**
La variable de entorno `RESEND_API_KEY` no está configurada en el archivo `.env.local`.

### 2. **Email remitente no verificado**
El email que se usa para enviar (`onboarding@resend.dev`) es un dominio de prueba que puede no estar funcionando correctamente.

---

## ✅ Solución Completa

### Paso 1: Instalar html2canvas (para el botón de descarga)

```bash
pnpm add html2canvas
```

### Paso 2: Configurar Resend

1. Ve a [https://resend.com/](https://resend.com/) y crea una cuenta o inicia sesión
2. Obtén tu API Key desde [https://resend.com/api-keys](https://resend.com/api-keys)
3. (Opcional pero recomendado) Verifica tu dominio en [https://resend.com/domains](https://resend.com/domains)

### Paso 3: Actualizar .env.local

Abre tu archivo `.env.local` y agrega las siguientes líneas:

```bash
# Email Configuration (Resend)
RESEND_API_KEY=re_tu_api_key_aqui

# Opcional: Si verificaste tu dominio, usa tu email
RESEND_FROM_EMAIL=Bendecidos en Amor <noreply@tudominio.com>

# Si no tienes dominio verificado, puedes usar el de prueba
# RESEND_FROM_EMAIL=Bendecidos en Amor <onboarding@resend.dev>
```

### Paso 4: Reiniciar el servidor de desarrollo

```bash
# Detén el servidor actual (Ctrl+C) y luego:
pnpm dev
```

---

## 🎯 Cambios Implementados

### 1. **Mejoras en el manejo de emails** (`src/lib/email.ts`)
- ✅ Validación de que RESEND_API_KEY esté configurada
- ✅ Logs detallados para debugging
- ✅ Soporte para email remitente configurable
- ✅ Mejor manejo de errores con detalles completos

### 2. **Botón de descarga en pantalla de éxito** (`src/app/components/RaffleBoard.tsx`)
- ✅ Nuevo botón "📥 Descargar Confirmación"
- ✅ Captura la pantalla de éxito como imagen PNG
- ✅ Descarga automática con fecha en el nombre del archivo
- ✅ Mensaje informativo sobre el email enviado

### 3. **Template de variables actualizado** (`env.template`)
- ✅ Incluye RESEND_API_KEY
- ✅ Incluye RESEND_FROM_EMAIL (opcional)
- ✅ Comentarios explicativos

---

## 🧪 Cómo Probar

1. **Instala la dependencia**:
   ```bash
   pnpm add html2canvas
   ```

2. **Configura tu `.env.local`** con la API key de Resend

3. **Reinicia el servidor**:
   ```bash
   pnpm dev
   ```

4. **Realiza una compra de prueba**:
   - Accede a tu aplicación
   - Selecciona números
   - Completa la compra
   
5. **Verifica**:
   - ✅ El botón "Descargar Confirmación" debe aparecer
   - ✅ Al hacer clic, descarga una imagen PNG con los números
   - ✅ Revisa la consola del servidor para ver los logs del email
   - ✅ Revisa tu bandeja de entrada (y spam) para el email

---

## 📋 Logs a Revisar

Cuando se envía un email, verás estos logs en la consola del servidor:

```
[EMAIL] 📧 Intentando enviar email a: cliente@example.com
[EMAIL] 📊 Cantidad de números: 3
[EMAIL] 📮 Enviando desde: Bendecidos en Amor <onboarding@resend.dev>
[EMAIL] ✅ Email enviado exitosamente!
[EMAIL] 📬 ID del email: abc123...
```

Si hay un error, verás:
```
[EMAIL] ⚠️ RESEND_API_KEY no está configurada en las variables de entorno
```
o
```
[EMAIL] ❌ Error al enviar: [detalles del error]
```

---

## 🆘 Solución de Problemas

### El email no llega
1. Verifica que RESEND_API_KEY esté configurada correctamente
2. Revisa la carpeta de spam
3. Verifica los logs del servidor
4. Si usas un dominio personalizado, asegúrate de que esté verificado en Resend

### El botón de descarga no funciona
1. Asegúrate de haber instalado html2canvas: `pnpm add html2canvas`
2. Verifica que no hay errores en la consola del navegador
3. Si falla, toma una captura de pantalla manualmente

### Errores en Resend
- **Invalid API key**: Verifica que copiaste correctamente la API key
- **Unverified domain**: Usa `onboarding@resend.dev` o verifica tu dominio
- **Rate limit**: Resend tiene límites en el plan gratuito (100 emails/día)

---

## 📝 Notas Importantes

- **Plan Gratuito de Resend**: 100 emails por día, 3,000 por mes
- **Dominio de Prueba**: `onboarding@resend.dev` funciona sin verificación pero puede tener limitaciones
- **Dominio Propio**: Recomendado para producción, requiere verificación DNS
- **Backup**: El botón de descarga garantiza que el cliente siempre tenga su confirmación, incluso si el email falla

---

## 🎁 Funcionalidad Adicional

Ahora los clientes tienen **2 formas** de obtener su confirmación:

1. **Email** ✉️ - Reciben un correo hermoso con todos los detalles
2. **Descarga** 📥 - Pueden descargar una imagen de la pantalla de confirmación

Esto garantiza que **siempre** tengan acceso a sus números, incluso si el email tiene problemas.

---

¿Necesitas ayuda adicional? Revisa los logs y el archivo de configuración.
