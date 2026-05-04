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
      console.warn('⚠️ Email deshabilitado (no API key)');
      return { disabled: true };
    }

    try {
      const response = await this.resend.emails.send({
        from: 'onboarding@resend.dev', // ⚠️ cambia si tienes dominio verificado
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

      console.log('✅ Email enviado:', response);

      return response;

    } catch (error: any) {
      console.error('❌ ERROR RESEND:', error?.message || error);
      throw new Error('Error enviando email');
    }
  }
}