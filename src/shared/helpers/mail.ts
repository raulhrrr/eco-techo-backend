import { InternalServerErrorException } from '@nestjs/common';
import { transporter } from 'src/config/mail.config';

export const sendEmail = async (
  emails: string[],
  subject: string,
  message: string,
): Promise<void> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emails,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new InternalServerErrorException('Error sending alert email');
  }
};
