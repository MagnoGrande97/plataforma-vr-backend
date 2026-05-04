import { Resend } from 'resend';

export class EmailService {
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('❌ RESEND_API_KEY no configurado');
      throw new Error('Email service no disponible');
    }

    this.resend = new Resend(apiKey);
  }

  async enviarInvitacion(email: string, nombre: string) {
    console.log('📨 Enviando email a:', email);

    try {
      const response = await this.resend.emails.send({
        from: 'onboarding@resend.dev', // ⚠️ cambia esto si tienes dominio
        to: email,
        subject: 'Invitación a Prometeo',
        html: `
          <h2>Hola ${nombre}</h2>
          <p>Has sido invitado a Prometeo.</p>
          <a href="https://prometeo-frontend.onrender.com">
            Ingresar
          </a>
        `,
      });

      console.log('✅ Email OK:', response);

      return response;

    } catch (error: any) {
      console.error('❌ RESEND ERROR FULL:', {
        message: error?.message,
        name: error?.name,
        stack: error?.stack,
      });

      throw new Error('Fallo envío email');
    }
  }
}