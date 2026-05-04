import { Resend } from 'resend';

export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async enviarInvitacion(email: string, nombre: string) {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Invitación a Prometeo',
      html: `
        <h2>Hola ${nombre}</h2>
        <p>Has sido invitado a la plataforma Prometeo.</p>
        <p>Haz clic abajo para ingresar:</p>
        <a href="https://prometeo-frontend.onrender.com/">
          Entrar a la plataforma
        </a>
      `,
    });
  }
}