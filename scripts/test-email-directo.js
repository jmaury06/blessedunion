#!/usr/bin/env node

/**
 * Script de prueba directa de email
 * Envía un email sin tocar la base de datos
 * 
 * Uso: node scripts/test-email-directo.js
 */

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

console.log("\n📧 PRUEBA DIRECTA DE EMAIL (Sin base de datos)\n");
console.log("═".repeat(60));

// Verificar API key
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("\n❌ ERROR: RESEND_API_KEY no está configurada");
  console.error("   → Configura tu API key en .env.local");
  console.error("   → Ejecuta: pnpm check-email\n");
  process.exit(1);
}

console.log("✅ RESEND_API_KEY encontrada");
console.log("✅ Preparando email de prueba...\n");

// Datos de prueba
const testData = {
  buyerName: "Jairo Maury (PRUEBA)",
  buyerEmail: "ajmh06@gmail.com",
  numbers: ["006", "025"]
};

console.log("📋 DATOS DE PRUEBA:");
console.log("   • Nombre:", testData.buyerName);
console.log("   • Email:", testData.buyerEmail);
console.log("   • Números:", testData.numbers.join(", "));
console.log("");

// Función de envío (copiada de src/lib/email.ts)
async function sendTestEmail() {
  try {
    const { Resend } = require('resend');
    const resend = new Resend(apiKey);

    const { buyerName, buyerEmail, numbers } = testData;
    
    console.log("📧 Generando contenido del email...");
    
    const numbersList = numbers
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((num) => `• ${num}`)
      .join("\n");

    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: bold;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 18px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 20px;
      margin-bottom: 20px;
      color: #333;
    }
    .message {
      font-size: 16px;
      color: #555;
      margin-bottom: 30px;
      line-height: 1.8;
    }
    .numbers-box {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-left: 4px solid #667eea;
      padding: 25px;
      border-radius: 8px;
      margin: 30px 0;
    }
    .numbers-title {
      font-weight: bold;
      font-size: 18px;
      color: #333;
      margin-bottom: 15px;
    }
    .numbers-list {
      font-size: 20px;
      font-weight: bold;
      color: #667eea;
      line-height: 1.8;
      white-space: pre-line;
    }
    .total {
      background: #667eea;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .test-banner {
      background: #ffc107;
      color: #000;
      padding: 15px;
      text-align: center;
      font-weight: bold;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="test-banner">
      🧪 ESTO ES UNA PRUEBA - NO ES UNA COMPRA REAL
    </div>
    
    <div class="header">
      <div style="font-size: 40px; margin-bottom: 10px;">📱</div>
      <h1>Unión Bendecida</h1>
      <p>Confirmación de Compra - Rifa pro-Boda</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        ¡Hola ${buyerName}! 👋
      </div>
      <div class="message">
        <strong>🧪 Este es un email de PRUEBA del sistema.</strong><br>
        Gracias por participar en nuestra rifa.<br/>
        Nos ayudas a acercarnos más a nuestro sueño.<br/>
        Hemos registrado exitosamente tu compra.
      </div>

      <!-- Premio -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 25px 0;">
        <div style="font-size: 48px; font-weight: 900; margin-bottom: 15px; letter-spacing: 2px;">GANATE 📱💰</div>
        <div style="font-size: 22px; font-weight: 600; opacity: 0.95; line-height: 1.6;">
          Un hermoso iPhone 13 de 128GB<br/>o 2.500.000 COP
        </div>
      </div>

      <!-- Información del Sorteo -->
      <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <div style="font-size: 24px; margin-bottom: 10px;">📅</div>
        <div style="font-size: 16px; color: #555; margin-bottom: 5px;">
          <strong>Sábado 1 de Noviembre de 2025</strong>
        </div>
        <div style="font-size: 14px; color: #666;">
          🎲 Con las <strong>3 últimas cifras</strong> de la <strong>Lotería de Boyacá</strong>
        </div>
      </div>
      
      <div class="numbers-box">
        <div class="numbers-title">
          🎫 Tus números de la suerte (PRUEBA):
        </div>
        <div class="numbers-list">${numbersList}</div>
      </div>
      
      <div class="total">
        📊 Total de números: ${numbers.length}
      </div>
      
      <div class="message" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 14px; color: #666;">
        <strong>Nota:</strong> Este es un email de prueba del sistema. En compras reales, el cliente recibirá un email similar con sus números seleccionados.
      </div>
    </div>
    
    <div class="footer">
      <div style="font-size: 20px; font-weight: bold; color: #333; margin-bottom: 5px;">Unión Bendecida</div>
      <div style="font-size: 14px; color: #666;">Rifa pro-Boda 2025</div>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
🧪 ESTO ES UNA PRUEBA - NO ES UNA COMPRA REAL

🎉 Unión Bendecida - Confirmación de Números

Hola ${buyerName},

Este es un email de PRUEBA del sistema.
Gracias por participar en nuestra rifa.
Nos ayudas a acercarnos más a nuestro sueño.
Hemos registrado exitosamente tu compra.

Números de prueba:
${numbersList}

Total: ${numbers.length} ${numbers.length === 1 ? "número" : "números"}

━━━━━━━━━━━━━━━━━━━━━━
GANATE 📱💰
━━━━━━━━━━━━━━━━━━━━━━
Un hermoso iPhone 13 de 128GB
o $2.500.000 en efectivo

━━━━━━━━━━━━━━━━━━━━━━
📅 FECHA DEL SORTEO
━━━━━━━━━━━━━━━━━━━━━━
Sábado 1 de Noviembre de 2025
🎲 Con las 3 últimas cifras de la Lotería de Boyacá

¡Mucha suerte en la rifa! 🍀✨

---
Blessed Union - Rifa de Boda 2025
🧪 Email de prueba del sistema
    `;

    const fromEmail = process.env.RESEND_FROM_EMAIL || "Unión Bendecida <onboarding@resend.dev>";
    
    console.log("📮 Enviando desde:", fromEmail);
    console.log("📬 Enviando a:", buyerEmail);
    console.log("");
    console.log("⏳ Enviando email...\n");
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: buyerEmail,
      subject: `🧪 [PRUEBA] Confirmación de compra - Números ${numbers.join(", ")}`,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error("❌❌❌ ERROR AL ENVIAR ❌❌❌\n");
      console.error("Tipo de error:", error.name || 'Error');
      console.error("Mensaje:", error.message);
      console.error("\n🔍 Detalles completos:");
      console.error(JSON.stringify(error, null, 2));
      
      console.log("\n💡 POSIBLES SOLUCIONES:");
      console.log("   1. Verifica que tu RESEND_API_KEY sea correcta");
      console.log("   2. Si usas dominio personalizado, verifica que esté verificado");
      console.log("   3. Revisa límites del plan (100 emails/día en plan gratis)");
      console.log("   4. Ejecuta: pnpm check-email");
      console.log("");
      process.exit(1);
    }

    console.log("✅✅✅ EMAIL ENVIADO EXITOSAMENTE ✅✅✅\n");
    console.log("═".repeat(60));
    console.log("");
    console.log("📬 ID del email:", data.id);
    console.log("");
    console.log("📝 PRÓXIMOS PASOS:");
    console.log("   1. Revisa tu bandeja de entrada: ajmh06@gmail.com");
    console.log("   2. Si no lo ves, revisa SPAM/Correo no deseado");
    console.log("   3. Puede demorar 1-2 minutos en llegar");
    console.log("   4. Revisa el estado en: https://resend.com/emails");
    console.log("");
    console.log("✨ Si recibiste el email:");
    console.log("   → Tu configuración está PERFECTA");
    console.log("   → Los emails de compras reales se enviarán automáticamente");
    console.log("   → No necesitas hacer nada más");
    console.log("");
    console.log("🎉 ¡PRUEBA COMPLETADA CON ÉXITO!");
    console.log("");
    
  } catch (error) {
    console.error("\n❌ ERROR CRÍTICO:", error.message);
    console.error("\n🔍 Stack trace:");
    console.error(error.stack);
    console.log("\n💡 Solución:");
    console.log("   → Ejecuta: pnpm install resend dotenv");
    console.log("");
    process.exit(1);
  }
}

// Ejecutar la prueba
sendTestEmail();
