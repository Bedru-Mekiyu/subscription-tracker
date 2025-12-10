import dayjs from 'dayjs';
import { emailTemplates } from './email.template.js';
import transporter, { accountEmail } from '../config/nodemailer.js';

export const sendReminderEmail = async ({ to, type, subscription }) => {
  const template = emailTemplates.find((t) => t.label === type);
  if (!template) throw new Error("Invalid email type");

  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
    accountSettingsLink: 'https://example.com/account',
    supportLink: 'https://example.com/support',
  }
  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);
  const mailOptions = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}