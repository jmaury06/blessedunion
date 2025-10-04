# 🔐 INSTRUCCIONES DE ADMINISTRADOR

## 📧 CREDENCIALES DE ACCESO

```
Email: ajmh06@gmail.com
Password: Jairomh06++
```

---

## 🚀 PASOS PARA ACCEDER AL PANEL

### 1. Limpiar cookies del navegador (IMPORTANTE)
Si ya habías entrado sin login, necesitas limpiar las cookies:

**Chrome/Safari:**
1. Abre las Dev Tools (F12 o Cmd+Option+I)
2. Ve a la pestaña "Application" (Chrome) o "Storage" (Safari)
3. En la barra lateral izquierda, expande "Cookies"
4. Click en `http://localhost:3000`
5. Click derecho → "Clear All"
6. Refresca la página (Cmd+R o F5)

**Forma rápida (en cualquier navegador):**
- Abre una ventana de incógnito/privada
- Ve a `http://localhost:3000/admin`

### 2. Iniciar sesión
1. Ve a `http://localhost:3000/admin`
2. Verás el formulario de login 🔐
3. Ingresa tu email: `ajmh06@gmail.com`
4. Ingresa tu password: `Jairomh06++`
5. Click en "🚀 Ingresar"

### 3. Usar el panel
- ✨ Generar links para clientes
- 📊 Ver estadísticas en tiempo real
- 🚪 Cerrar sesión cuando termines

---

## 🧹 LIMPIAR BASE DE DATOS

Para dejar las tablas como nuevas:

1. Ve a Supabase Dashboard
2. Abre el **SQL Editor**
3. Pega el contenido de `RESET_DATABASE.sql`
4. Click en **Run**
5. ✅ ¡Listo! Base de datos limpia

**O copia esto directamente:**

```sql
-- Limpiar todas las tablas
TRUNCATE TABLE purchases CASCADE;
TRUNCATE TABLE links CASCADE;

-- Verificar que esté limpio
SELECT COUNT(*) FROM purchases;  -- Debe ser 0
SELECT COUNT(*) FROM links;      -- Debe ser 0
```

---

## 🔒 SEGURIDAD

- ✅ Solo TÚ puedes acceder al admin con tus credenciales
- ✅ La sesión expira en 7 días
- ✅ Las contraseñas están protegidas
- ✅ Los endpoints están protegidos con JWT

---

## 🆘 PROBLEMAS COMUNES

### "No me pide login"
→ Limpia las cookies del navegador (ver paso 1)

### "Credenciales inválidas"
→ Verifica que usas el email y password correctos
→ No copies espacios extras

### "No se ve el formulario"
→ Asegúrate de estar en `http://localhost:3000/admin`
→ Refresca la página

---

**¿Listo? Reinicia el servidor y prueba:**

```bash
pnpm dev
```

Luego ve a: http://localhost:3000/admin
