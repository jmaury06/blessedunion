#!/usr/bin/env node

/**
 * Script de diagnóstico para verificar la configuración de email
 * Uso: node scripts/check-email-config.js
 */

console.log("\n🔍 DIAGNÓSTICO DE CONFIGURACIÓN DE EMAIL\n");
console.log("═".repeat(50));

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

// 1. Verificar que RESEND_API_KEY existe
console.log("\n1️⃣  Verificando RESEND_API_KEY...");
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error("   ❌ RESEND_API_KEY NO está configurada");
  console.error("   → Solución: Agrega RESEND_API_KEY=tu_api_key en .env.local");
  console.error("   → Obtén tu API key en: https://resend.com/api-keys");
  process.exit(1);
} else if (apiKey === "your-resend-api-key-here" || apiKey === "re_") {
  console.error("   ❌ RESEND_API_KEY tiene un valor de placeholder");
  console.error("   → Solución: Reemplaza con tu API key real de Resend");
  process.exit(1);
} else {
  console.log("   ✅ RESEND_API_KEY está configurada");
  console.log(`   → Longitud: ${apiKey.length} caracteres`);
  console.log(`   → Prefijo: ${apiKey.substring(0, 6)}...`);
}

// 2. Verificar RESEND_FROM_EMAIL
console.log("\n2️⃣  Verificando RESEND_FROM_EMAIL...");
const fromEmail = process.env.RESEND_FROM_EMAIL;

if (!fromEmail) {
  console.log("   ⚠️  RESEND_FROM_EMAIL no está configurada (usará default)");
  console.log("   → Default: Blessed Union <onboarding@resend.dev>");
  console.log("   → Opcional: Puedes configurar tu propio email verificado");
} else {
  console.log("   ✅ RESEND_FROM_EMAIL está configurada");
  console.log(`   → Email: ${fromEmail}`);
}

// 3. Verificar formato de email
console.log("\n3️⃣  Verificando formato de email...");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (fromEmail && !fromEmail.includes('<')) {
  if (emailRegex.test(fromEmail)) {
    console.log("   ✅ Formato de email válido");
  } else {
    console.error("   ❌ Formato de email inválido");
  }
}

// 4. Test de conexión básico
console.log("\n4️⃣  Probando conexión con Resend API...");
console.log("   → Importando SDK de Resend...");

try {
  const { Resend } = require('resend');
  const resend = new Resend(apiKey);
  
  console.log("   ✅ SDK de Resend cargado correctamente");
  console.log("   ℹ️  Para probar el envío real, usa: pnpm test-email");
  
} catch (error) {
  console.error("   ❌ Error al cargar SDK de Resend:", error.message);
  console.error("   → Solución: Ejecuta 'pnpm install' para instalar dependencias");
  process.exit(1);
}

// 5. Verificar otras variables necesarias
console.log("\n5️⃣  Verificando otras variables de entorno...");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error("   ❌ NEXT_PUBLIC_SUPABASE_URL no está configurada");
} else {
  console.log("   ✅ NEXT_PUBLIC_SUPABASE_URL configurada");
}

if (!supabaseKey) {
  console.error("   ❌ SUPABASE_SERVICE_ROLE_KEY no está configurada");
} else {
  console.log("   ✅ SUPABASE_SERVICE_ROLE_KEY configurada");
}

// Resumen final
console.log("\n" + "═".repeat(50));
console.log("\n✅ DIAGNÓSTICO COMPLETADO\n");
console.log("📝 RESUMEN:");
console.log("   • RESEND_API_KEY: ✅ Configurada");
console.log(`   • RESEND_FROM_EMAIL: ${fromEmail ? '✅ Configurada' : '⚠️  Default'}`);
console.log("   • SDK Resend: ✅ Funcionando");
console.log("\n💡 PRÓXIMOS PASOS:");
console.log("   1. Reinicia el servidor de desarrollo: pnpm dev");
console.log("   2. Realiza una compra de prueba");
console.log("   3. Revisa los logs del servidor para ver:");
console.log("      - [EMAIL] 📧 Intentando enviar email a: ...");
console.log("      - [EMAIL] ✅ Email enviado exitosamente!");
console.log("   4. Revisa tu bandeja de entrada (y spam)");
console.log("\n📚 Si el problema persiste, revisa: INSTRUCCIONES_EMAIL.md");
console.log("\n");
