import { Resend } from 'resend';

export class EmailService {
  private resend: Resend | null = null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('❌ RESEND_API_KEY no configurado');
      return;
    }

    this.resend = new Resend(apiKey);
  }

  async enviarInvitacion(email: string, nombre: string) {
    console.log('📨 Intentando enviar email a:', email);

    if (!this.resend) {
      console.warn('⚠️ Email deshabilitado');
      return { disabled: true };
    }

    try {
      // 🔥 URL NUEVA (SIN /invitacion)
      const inviteUrl =
        `https://prometeo-frontend.onrender.com/?invite=true&email=${encodeURIComponent(email)}`;

      const response = await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Invitación a Prometeo',

        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>Hola ${nombre}</h2>

            <p>
              Has sido invitado a la plataforma Prometeo.
            </p>

            <p>
              Haz click aquí para crear tu cuenta:
            </p>

            <a
              href="${inviteUrl}"
              style="
                background: black;
                color: white;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 8px;
                display: inline-block;
              "
            >
              Ingresar a Prometeo
            </a>

            <p style="margin-top:20px;">
              Si no solicitaste esto, ignora este email.
            </p>
          </div>
        `,
      });

      console.log('✅ EMAIL RESPONSE:', response);

      return response;

    } catch (error: any) {
      console.error('❌ ERROR RESEND:', error);

      throw new Error(
        error?.message || 'Error enviando email'
      );
    }
  }
}