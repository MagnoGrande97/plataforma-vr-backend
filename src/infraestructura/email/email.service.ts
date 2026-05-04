import { Resend } from 'resend';

export class EmailService {
  private resend: Resend | null = null;

  constructor() {
    if (process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    } else {
      console.warn('⚠️ RESEND_API_KEY no configurada');
    }
  }

  async enviarInvitacion(email: string, nombre: string) {
    try {
      console.log('📧 Enviando email a:', email);

      if (!this.resend) {
        console.warn('❌ No hay API KEY');
        return;
      }

      const response = await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Invitación a Prometeo',
        html: `
          <h2>Hola ${nombre}</h2>
          <p>Has sido invitado a la plataforma Prometeo.</p>
          <a href="https://prometeo-frontend.onrender.com/">
            Entrar a la plataforma
          </a>
        `,
      });

      console.log('📨 RESPUESTA RESEND:', response);

    } catch (error) {
      console.error('🔥 ERROR RESEND:', error);
    }
  }
}