import { Injectable } from '@nestjs/common';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: Transporter;

  constructor() {
    // Initialisez le transporteur de messagerie avec vos paramètres de configuration
    this.transporter = createTransport({
      // Configuration du transporteur de messagerie (par exemple SMTP, SendGrid, etc.)
    });
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}