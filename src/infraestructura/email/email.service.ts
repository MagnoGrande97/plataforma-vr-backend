import { Resend } from 'resend';

export class EmailService {
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error('RESEND_API_KEY no configurado');
    }

    this.resend = new Resend(apiKey);
  }

  async enviarInvitacion(email: string, nombre: string) {
    try {
      const response = await this.resend.emails.send({
        from: 'onboarding@resend.dev', // 🔥 IMPORTANTE
        to: email,
        subject: 'Invitación a Prometeo',
        html: `
          <h2>Hola ${nombre}</h2>
          <p>Has sido invitado a la plataforma Prometeo.</p>
          <p>Puedes iniciar sesión aquí:</p>
          <a href="https://prometeo-frontend.onrender.com">
            Ir a la plataforma
          </a>
        `,
      });

      console.log('EMAIL ENVIADO:', response);

      return response;
    } catch (error) {
      console.error('ERROR EMAIL:', error);
      throw error;
    }
  }
}