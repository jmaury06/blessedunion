import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface PurchaseConfirmationData {
  buyerName: string;
  buyerEmail: string;
  numbers: string[];
}

export async function sendPurchaseConfirmation(
  data: PurchaseConfirmationData
): Promise<{ success: boolean; error?: string }> {
  try {
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
      <h1>Blessed Union</h1>
      <p>Confirmación de Compra - Rifa de Boda</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        ¡Hola ${buyerName}! 👋
      </div>
      
      <div class="message">
        Gracias por participar en nuestra rifa. Hemos registrado exitosamente tu compra.
      </div>

      <!-- Premio -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
        <div style="font-size: 32px; margin-bottom: 10px;">🎁</div>
        <div style="font-size: 22px; font-weight: bold; margin-bottom: 10px;">¡Gran Premio!</div>
        <div style="font-size: 28px; font-weight: bold; margin-bottom: 5px;">iPhone 13 de 128GB</div>
        <div style="font-size: 20px; opacity: 0.95;">o $2.500.000 en efectivo</div>
      </div>

      <!-- Información del Sorteo -->
      <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <div style="font-size: 24px; margin-bottom: 10px;">📅</div>
        <div style="font-weight: bold; font-size: 18px; color: #333; margin-bottom: 8px;">Fecha del Sorteo</div>
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
        ¡Mucha suerte! 🍀✨
      </div>
      
      <div class="message" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 14px; color: #666;">
        <strong>Nota:</strong> Guarda este correo como comprobante de tu compra. Los números seleccionados son únicos y ya están registrados a tu nombre.
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-title">Blessed Union</div>
      <div class="footer-subtitle">Rifa de Boda 2025</div>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
🎉 ¡Gracias por tu compra!

Blessed Union - Confirmación de Números

Hola ${buyerName},

Has comprado exitosamente los siguientes números:
${numbersList}

Total: ${numbers.length} ${numbers.length === 1 ? "número" : "números"}

━━━━━━━━━━━━━━━━━━━━━━
🎁 GRAN PREMIO
━━━━━━━━━━━━━━━━━━━━━━
📱 iPhone 13 de 128GB
💰 o $2.500.000 en efectivo

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

¡Mucha suerte en la rifa! 🍀✨

---
Blessed Union
Rifa de Boda 2025
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: "Blessed Union <onboarding@resend.dev>", // Cambiar cuando tengas dominio verificado
      to: [buyerEmail],
      subject: `🎉 Confirmación de compra - Números ${numbers.join(", ")}`,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error("[EMAIL] Error al enviar:", error);
      return { success: false, error: error.message };
    }

    console.log("[EMAIL] Email enviado exitosamente:", emailData);
    return { success: true };
  } catch (error: any) {
    console.error("[EMAIL] Error inesperado:", error);
    return { success: false, error: error.message };
  }
}
