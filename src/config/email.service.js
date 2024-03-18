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
    const mailOptions = {
      text: '',
      from: process.env.USER_EMAIL,
      to: destinatario,
      cc:'franjhely.andre13@gmail.com',
      subject: asunto,
      attachment: [
        { data: cuerpo, alternative: true },
      ],
    };

    return new Promise((resolve, reject) => {
      // Enviar el correo con emailjs
      this.client.send(mailOptions, (err, message) => {
        if (err) {
          console.error('Error al enviar el correo: ', err);
          reject(false);
        } else {
          console.log('Correo enviado con éxito: ', message);
          resolve(true);
        }
      });
    });
  }
}

export default EmailService;
