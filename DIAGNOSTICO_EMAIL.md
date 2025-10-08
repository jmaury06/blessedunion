# 🔍 Diagnóstico: ¿Por qué no llegan los emails?

## 🚨 Problema
Los emails de confirmación no están llegando a los clientes después de confirmar la compra.

---

## ✅ Solución Paso a Paso

### **Paso 1: Instalar dependencias necesarias**

```bash
pnpm install dotenv
```

### **Paso 2: Verificar configuración de email**

Ejecuta el script de diagnóstico:

```bash
pnpm check-email
```

Este script verificará:
- ✅ Si `RESEND_API_KEY` está configurada
- ✅ Si `RESEND_FROM_EMAIL` está configurada (opcional)
- ✅ Si el SDK de Resend está instalado
- ✅ Formato de las variables

**¿Qué debes ver?**
```
🔍 DIAGNÓSTICO DE CONFIGURACIÓN DE EMAIL
══════════════════════════════════════════════════

1️⃣  Verificando RESEND_API_KEY...
   ✅ RESEND_API_KEY está configurada
   
2️⃣  Verificando RESEND_FROM_EMAIL...
   ✅ RESEND_FROM_EMAIL está configurada
   
✅ DIAGNÓSTICO COMPLETADO
```

**Si vez ❌ errores:**
- Ve al [Paso 3](#paso-3-configurar-resend_api_key)

---

### **Paso 3: Configurar RESEND_API_KEY**

1. **Obtén tu API Key de Resend:**
   - Ve a [https://resend.com/api-keys](https://resend.com/api-keys)
   - Si no tienes cuenta, créala (es gratis)
   - Copia tu API Key (empieza con `re_`)

2. **Edita tu archivo `.env.local`:**
   ```bash
   # Abre el archivo
   nano .env.local
   
   # O con tu editor favorito
   code .env.local
   ```

3. **Agrega o actualiza estas líneas:**
   ```bash
   # Email Configuration (Resend)
   RESEND_API_KEY=re_tu_api_key_aqui_sin_comillas
   
   # Opcional: Email remitente verificado
   RESEND_FROM_EMAIL=Blessed Union <onboarding@resend.dev>
   ```

4. **Guarda el archivo** (Ctrl+O y Ctrl+X en nano)

---

### **Paso 4: Probar el envío de email**

Ejecuta el script de prueba con TU email:

```bash
pnpm test-email tu-email@ejemplo.com
```

Reemplaza `tu-email@ejemplo.com` con tu email real.

**¿Qué debes ver?**
```
📧 PRUEBA DE ENVÍO DE EMAIL
══════════════════════════════════════════════════

✉️  Enviando email de prueba a: tu-email@ejemplo.com
📮 Enviando desde: Blessed Union <onboarding@resend.dev>

✅ EMAIL ENVIADO EXITOSAMENTE!
📬 ID del email: abc123...

📝 INSTRUCCIONES:
   1. Revisa tu bandeja de entrada: tu-email@ejemplo.com
   2. Si no lo ves, revisa la carpeta de SPAM
   3. Espera 1-2 minutos
```

**Si recibes el email:**
- ✅ ¡Tu configuración está correcta!
- Ve al [Paso 5](#paso-5-reiniciar-el-servidor)

**Si NO recibes el email:**
- Ve a [Solución de Problemas](#solución-de-problemas)

---

### **Paso 5: Reiniciar el servidor**

**MUY IMPORTANTE:** Next.js necesita reiniciarse para cargar las nuevas variables de entorno.

```bash
# 1. Detén el servidor actual (Ctrl+C en la terminal)

# 2. Inicia de nuevo
pnpm dev
```

Debes ver algo como:
```
▲ Next.js 15.5.4
- Local:        http://localhost:3000
✓ Ready in 2.3s
```

---

### **Paso 6: Hacer una compra de prueba**

1. **Abre la aplicación** en tu navegador
2. **Contacta por WhatsApp** para obtener un link de compra
3. **Selecciona números** y confirma la compra
4. **Revisa la consola del servidor** (terminal donde corre `pnpm dev`)

**¿Qué debes ver en los logs?**

✅ **Si TODO está bien:**
```
[CLAIM] 📧 Iniciando envío de email de confirmación...
[CLAIM] 📧 Destinatario: cliente@ejemplo.com
[CLAIM] 📧 Nombre: Juan Pérez
[CLAIM] 📧 Números: 001, 042, 123
[EMAIL] 📧 Intentando enviar email a: cliente@ejemplo.com
[EMAIL] 📊 Cantidad de números: 3
[EMAIL] 📮 Enviando desde: Blessed Union <onboarding@resend.dev>
[EMAIL] ✅ Email enviado exitosamente!
[EMAIL] 📬 ID del email: abc123...
[CLAIM] ✅ Email enviado exitosamente a: cliente@ejemplo.com
```

❌ **Si hay ERROR:**
```
[CLAIM] ❌❌❌ ERROR AL ENVIAR EMAIL ❌❌❌
[CLAIM] ❌ Destinatario: cliente@ejemplo.com
[CLAIM] ❌ Error: RESEND_API_KEY no configurada...
```

Si ves el error, regresa al [Paso 3](#paso-3-configurar-resend_api_key)

---

## 🆘 Solución de Problemas

### **Error: "RESEND_API_KEY no está configurada"**

**Causa:** La variable de entorno no está en `.env.local` o el servidor no se reinició.

**Solución:**
1. Verifica que `.env.local` tenga la línea `RESEND_API_KEY=re_...`
2. Asegúrate de que no tenga espacios al inicio
3. **REINICIA el servidor** (Ctrl+C y luego `pnpm dev`)

---

### **Error: "Invalid API key"**

**Causa:** La API key es incorrecta o inválida.

**Solución:**
1. Ve a [https://resend.com/api-keys](https://resend.com/api-keys)
2. Crea una nueva API key
3. Cópiala COMPLETA (debe empezar con `re_`)
4. Actualiza tu `.env.local`
5. Reinicia el servidor

---

### **Error: "Unverified domain"**

**Causa:** Estás usando un email de un dominio personalizado que no está verificado.

**Solución:**
1. **Opción A (Rápida):** Usa el dominio de prueba
   ```bash
   RESEND_FROM_EMAIL=Blessed Union <onboarding@resend.dev>
   ```

2. **Opción B (Producción):** Verifica tu dominio
   - Ve a [https://resend.com/domains](https://resend.com/domains)
   - Agrega tu dominio
   - Configura los registros DNS
   - Espera la verificación
   - Usa tu email verificado

---

### **Error: "Rate limit exceeded"**

**Causa:** Has alcanzado el límite del plan gratuito.

**Límites del plan gratuito:**
- 100 emails por día
- 3,000 emails por mes

**Solución:**
1. Espera hasta mañana
2. O actualiza tu plan en Resend

---

### **El email llega a SPAM**

**Causa:** Es normal con dominios de prueba o nuevos.

**Solución temporal:**
- Pide a tus clientes que revisen SPAM
- Marca el email como "No es spam"

**Solución permanente:**
- Verifica tu dominio en Resend
- Configura SPF, DKIM y DMARC

---

### **El email no llega (pero no hay errores)**

**Causa:** El email puede estar demorado o bloqueado por el proveedor.

**Solución:**
1. **Espera 5-10 minutos**
2. **Revisa SPAM**
3. **Intenta con otro email** (Gmail, Outlook, etc.)
4. **Revisa el estado en Resend:**
   - Ve a [https://resend.com/emails](https://resend.com/emails)
   - Busca el email por el ID que aparece en los logs

---

## 📊 Checklist Completo

Marca cada item cuando lo completes:

- [ ] Instalé `dotenv`: `pnpm install dotenv`
- [ ] Ejecuté `pnpm check-email` y vi ✅
- [ ] Tengo mi `RESEND_API_KEY` en `.env.local`
- [ ] Ejecuté `pnpm test-email mi-email@ejemplo.com`
- [ ] Recibí el email de prueba
- [ ] Reinicié el servidor (`Ctrl+C` y `pnpm dev`)
- [ ] Hice una compra de prueba
- [ ] Vi los logs `[EMAIL] ✅ Email enviado exitosamente!`
- [ ] El cliente recibió el email

---

## 🎯 Resumen de Comandos

```bash
# 1. Instalar dependencia
pnpm install dotenv

# 2. Verificar configuración
pnpm check-email

# 3. Probar envío
pnpm test-email tu-email@ejemplo.com

# 4. Reiniciar servidor
# Presiona Ctrl+C
pnpm dev
```

---

## 💡 Notas Importantes

1. **Siempre reinicia el servidor** después de cambiar `.env.local`
2. **Los emails son no-bloqueantes**: Si fallan, la compra se registra igual
3. **Revisa siempre los logs del servidor** para ver qué está pasando
4. **El dominio de prueba funciona** pero puede ir a spam
5. **Para producción**, verifica tu propio dominio

---

## 📞 ¿Necesitas más ayuda?

Si después de seguir todos los pasos aún tienes problemas:

1. **Copia los logs completos** de la terminal (desde que inició el envío del email)
2. **Toma captura** de tu archivo `.env.local` (oculta la API key real)
3. **Revisa** el archivo `INSTRUCCIONES_EMAIL.md` para más detalles

---

## ✨ Funcionalidad de Respaldo

Recuerda que ahora tienes el **botón de descarga** en la pantalla de confirmación:
- 📥 **Descargar Confirmación**
- Genera una imagen PNG con los números
- Funciona SIEMPRE, incluso si el email falla

Esto garantiza que tus clientes **nunca pierdan** su confirmación. 🎉
