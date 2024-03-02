import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  async sendWorkspaceInvitation(userEmail: string, workspaceName: string): Promise<void> {
    // Set up the Gmail SMTP transporter
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'ferjaniwael40@gmail.com',
        pass: 'csxo next tfpr fycu',
      },
    });

    // Compose email
    const mailOptions = {
      from: 'your_gmail_address@gmail.com',
      to: userEmail,
      subject: 'Workspace Invitation',
      text: `You have been invited to join the workspace ${workspaceName}. Please accept the invitation.`,
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      console.log('Invitation email sent successfully');
    } catch (error) {
      console.error('Error sending invitation email:', error);
      throw new Error('Failed to send invitation email');
    }
  }
}
