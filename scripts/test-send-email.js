#!/usr/bin/env node

/**
 * Script de prueba para enviar un email de confirmación
 * Uso: node scripts/test-send-email.js tu-email@ejemplo.com
 */

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

const email = process.argv[2];

if (!email) {
  console.error("\n❌ Error: Debes proporcionar un email");
  console.log("   Uso: node scripts/test-send-email.js tu-email@ejemplo.com\n");
  process.exit(1);
}

console.log("\n📧 PRUEBA DE ENVÍO DE EMAIL\n");
console.log("═".repeat(50));

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error("\n❌ RESEND_API_KEY no está configurada");
  console.error("   → Ejecuta primero: node scripts/check-email-config.js\n");
  process.exit(1);
}

console.log("\n✉️  Enviando email de prueba a:", email);
console.log("   Con números: 001, 042, 123\n");

async function testEmail() {
  try {
    const { Resend } = require('resend');
    const resend = new Resend(apiKey);
    
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Blessed Union <onboarding@resend.dev>";
    
    console.log("📮 Enviando desde:", fromEmail);
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: '🎉 [PRUEBA] Confirmación de compra - Rifa Blessed Union',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; }
            .header { text-align: center; color: #9333ea; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .content { color: #333; line-height: 1.6; }
            .numbers { background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">🎉 EMAIL DE PRUEBA - Blessed Union</div>
            <div class="content">
              <p>¡Hola! Este es un email de prueba del sistema de rifa.</p>
              <p>Si estás viendo este mensaje, significa que el sistema de email está funcionando correctamente.</p>
              
              <div class="numbers">
                <strong>Números de prueba:</strong><br>
                • 001<br>
                • 042<br>
                • 123
              </div>
              
              <p><strong>Premio:</strong> iPhone 13 de 128GB o $2.500.000 en efectivo</p>
              <p><strong>Sorteo:</strong> Sábado 1 de Noviembre de 2025</p>
            </div>
            <div class="footer">
              Blessed Union - Rifa de Boda 2025<br>
              Este es un email de prueba del sistema
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
🎉 EMAIL DE PRUEBA - Blessed Union

¡Hola! Este es un email de prueba del sistema de rifa.

Números de prueba:
• 001
• 042
• 123

Premio: iPhone 13 de 128GB o $2.500.000 en efectivo
Sorteo: Sábado 1 de Noviembre de 2025

---
Blessed Union - Rifa de Boda 2025
Este es un email de prueba del sistema
      `
    });

    if (error) {
      console.error("\n❌ ERROR AL ENVIAR:");
      console.error("   Tipo:", error.name || 'Error');
      console.error("   Mensaje:", error.message);
      console.error("\n🔍 DETALLES COMPLETOS:");
      console.error(JSON.stringify(error, null, 2));
      
      console.log("\n💡 POSIBLES SOLUCIONES:");
      console.log("   1. Verifica que tu API key sea correcta");
      console.log("   2. Si usas dominio personalizado, verifica que esté verificado en Resend");
      console.log("   3. Revisa que no hayas alcanzado el límite del plan gratuito (100 emails/día)");
      console.log("   4. Intenta con el dominio de prueba: onboarding@resend.dev\n");
      
      process.exit(1);
    }

    console.log("\n✅ EMAIL ENVIADO EXITOSAMENTE!");
    console.log("\n📬 ID del email:", data.id);
    console.log("\n📝 INSTRUCCIONES:");
    console.log("   1. Revisa tu bandeja de entrada:", email);
    console.log("   2. Si no lo ves, revisa la carpeta de SPAM");
    console.log("   3. Espera 1-2 minutos (a veces demora un poco)");
    console.log("   4. Puedes revisar el estado en: https://resend.com/emails");
    console.log("\n✨ Si recibiste el email, tu configuración está correcta!");
    console.log("   → Ahora los emails reales se enviarán automáticamente al confirmar compras\n");
    
  } catch (error) {
    console.error("\n❌ ERROR INESPERADO:", error.message);
    console.error("\n🔍 Stack trace:");
    console.error(error);
    console.log("\n💡 Solución: Asegúrate de tener instalado el paquete 'resend'");
    console.log("   → Ejecuta: pnpm install resend\n");
    process.exit(1);
  }
}

testEmail();
