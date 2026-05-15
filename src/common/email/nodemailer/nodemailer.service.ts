import nodemailer, { Transporter } from "nodemailer";
import { IMailProvider } from "../mail.interface";
import { SEND_MAIL_PASS, SEND_MAIL_USER } from "../../../config";

interface NodemailerConfig {
  service: string;
  host: string;
  port: number;
  auth: { user: string; pass: string };
}

export class NodemailerProvider implements IMailProvider {
  private transporter: Transporter;

  constructor(config: NodemailerConfig) {
    this.transporter = nodemailer.createTransport({
      service: config.service,
      host: config.host,
      port: config.port,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({ to, subject, html });
  }
}
