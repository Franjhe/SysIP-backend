import { SMTPClient } from 'emailjs';

class EmailService {
  constructor() {
    // Configuración del cliente SMTP
    this.client = new SMTPClient({
      user: process.env.USER_EMAIL,
      password: process.env.PASS_EMAIL,
      host: 'smtp.gmail.com',
      ssl: true,
    });
  }

  async enviarCorreo(destinatario, asunto, cuerpo) {
    // Configuración del mensaje
    const message = {
      from: process.env.USER_EMAIL,
      to: destinatario,
      subject: asunto,
      text: cuerpo,
    };

    try {
      // Conectar y enviar el mensaje
      await this.client.send(message);

      console.log('Correo enviado exitosamente.');
      return true;
    } catch (error) {
      console.error('Error al enviar el correo: ', error);
      return false;
    }
  }
}

export default EmailService;
