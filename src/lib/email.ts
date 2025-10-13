import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key_for_build");

export interface PurchaseConfirmationData {
  buyerName: string;
  buyerEmail: string;
  numbers: string[];
}

export async function sendPurchaseConfirmation(
  data: PurchaseConfirmationData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error(
        "[EMAIL] ⚠️ RESEND_API_KEY no está configurada en las variables de entorno"
      );
      return {
        success: false,
        error:
          "RESEND_API_KEY no configurada. Por favor, agrega tu API key de Resend en .env.local",
      };
    }

    const { buyerName, buyerEmail, numbers } = data;

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
      display: flex;
      align-items: center;
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
    .luck {
      text-align: center;
      font-size: 24px;
      margin: 30px 0;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer-title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .footer-subtitle {
      font-size: 14px;
      color: #666;
    }
    .emoji {
      font-size: 40px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="emoji">📱</div>
      <h1>Rifa Digital</h1>
      <p>Confirmación de Compra</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        ¡Hola ${buyerName}! 👋
      </div>
      <div class="message">
        Gracias por participar en nuestra rifa.<br/>
        ¡Tu apoyo es muy valioso para nosotros!<br/>
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

      <!-- Regla de Aplazamiento -->
      <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
        <div style="font-weight: bold; font-size: 16px; color: #721c24; margin-bottom: 8px;">Importante</div>
        <div style="font-size: 14px; color: #721c24;">
          Si al día del sorteo no se ha vendido el <strong>75% de los números</strong>, 
          la rifa se <strong>aplazará 1 semana más</strong>.
        </div>
      </div>
      
      <div class="numbers-box">
        <div class="numbers-title">
          🎫 Tus números de la suerte:
        </div>
        <div class="numbers-list">${numbersList}</div>
      </div>
      
      <div class="total">
        📊 Total de números comprados: ${numbers.length}
      </div>
      
      <div class="luck">
        Dios te Bendiga 🙏✨
      </div>
      
      <div class="message" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 14px; color: #666;">
        <strong>Nota:</strong> Guarda este correo como comprobante de tu compra. Los números seleccionados son únicos y ya están registrados a tu nombre.
      </div>

      <!-- QR de Pago -->
      <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
        <div style="font-size: 24px; margin-bottom: 15px;">💳</div>
        <div style="font-weight: bold; font-size: 18px; color: #e65100; margin-bottom: 20px;">Realiza tu Pago</div>
        
        <div style="background: white; padding: 15px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <div style="width: 200px; height: 200px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 48px;">
            📱💳
          </div>
          <div style="font-size: 12px; color: #666; margin-top: 8px;">
            Código QR para pago<br>
            (Disponible en la confirmación web)
          </div>
        </div>
        
        <div style="background: #ffe0b2; border: 1px solid #ffb74d; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
          <div style="font-weight: bold; font-size: 16px; color: #e65100;">
            📱 Nequi: <span style="font-family: monospace; font-size: 18px;">3152124896</span>
          </div>
        </div>
        
        <div style="font-size: 14px; color: #bf360c; line-height: 1.6;">
          Escanea el código QR o usa el número de Nequi para realizar tu pago cuando quieras.<br>
          <strong>Una vez realizado el pago, contacta para activar tus números.</strong>
        </div>
      </div>

      <!-- Mensaje de Contacto -->
      <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <div style="font-size: 24px; margin-bottom: 10px;">📱</div>
        <div style="font-weight: bold; font-size: 16px; color: #1565c0; margin-bottom: 12px;">¡Importante!</div>
        <div style="font-size: 14px; color: #1565c0; margin-bottom: 15px;">
          Ponte en contacto para cancelar y que tus números queden activos:
        </div>
        <div style="font-size: 14px; color: #1565c0;">
          <div style="margin-bottom: 8px;">
            <strong>📞 Contacto 1:</strong> 
            <a href="https://wa.me/573152124896" style="color: #4caf50; text-decoration: none; font-family: monospace;">3152124896</a>
          </div>
          <div style="margin-bottom: 8px;">
            <strong>📞 Contacto 2:</strong> 
            <a href="https://wa.me/572012918573" style="color: #4caf50; text-decoration: none; font-family: monospace;">2012918573</a>
          </div>
        </div>
        <div style="font-size: 14px; color: #1565c0; margin-top: 15px; text-align: center; font-weight: bold;">
          ¡Muchas gracias por tu apoyo!
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-title">Rifa Digital</div>
      <div class="footer-subtitle">Sistema de Rifas 2025</div>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
🎉 ¡Gracias por tu compra!

Rifa Digital - Confirmación de Números

Hola ${buyerName},

Gracias por participar en nuestra rifa.
¡Tu apoyo es muy valioso para nosotros!
Hemos registrado exitosamente tu compra.

Has comprado exitosamente los siguientes números:
${numbersList}

Total: ${numbers.length} ${numbers.length === 1 ? "número" : "números"}

━━━━━━━━━━━━━━━━━━━━━━
GANATE 📱💰
━━━━━━━━━━━━━━━━━━━━━━
Un hermoso iPhone 13 de 128GB
o 2.500.000 COP

━━━━━━━━━━━━━━━━━━━━━━
📅 FECHA DEL SORTEO
━━━━━━━━━━━━━━━━━━━━━━
Sábado 1 de Noviembre de 2025
🎲 Con las 3 últimas cifras de la Lotería de Boyacá

━━━━━━━━━━━━━━━━━━━━━━
⚠️ IMPORTANTE
━━━━━━━━━━━━━━━━━━━━━━
Si al día del sorteo no se ha vendido el 75% de los números,
la rifa se aplazará 1 semana más.

━━━━━━━━━━━━━━━━━━━━━━
💳 REALIZA TU PAGO
━━━━━━━━━━━━━━━━━━━━━━
📱 Nequi: 3152124896

Puedes usar el número de Nequi para realizar tu pago cuando quieras.
Una vez realizado el pago, contacta para activar tus números.

━━━━━━━━━━━━━━━━━━━━━━
📱 ¡IMPORTANTE!
━━━━━━━━━━━━━━━━━━━━━━
Ponte en contacto para cancelar y que tus números queden activos:

📞 Contacto 1: 3152124896 (WhatsApp)
📞 Contacto 2: 2012918573 (WhatsApp)

¡Muchas gracias por tu apoyo!

Dios te Bendiga 🙏✨

---
Rifa Digital
Sistema de Rifas 2025
    `;

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "Rifa Digital <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: buyerEmail,
      subject: `🎉 Confirmación de compra - Números ${numbers.join(", ")}`,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error("[EMAIL] ❌ Error al enviar:", error);
      console.error(
        "[EMAIL] 🔍 Detalles del error:",
        JSON.stringify(error, null, 2)
      );
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("[EMAIL] Error inesperado:", error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return { success: false, error: errorMessage };
  }
}
