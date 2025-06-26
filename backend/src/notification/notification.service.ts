async sendAdminCreatedEmail(email: string, name: string) {
  const subject = 'Admin Account Created';
  const body = `<p>Hello ${name},</p>
    <p>Your admin account has been created successfully.</p>
    <p>Login and change your password immediately.</p>`;

  return this.mailerService.sendMail({ to: email, subject, html: body });
}
