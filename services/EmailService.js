const nodemailer = require('nodemailer');

require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    type: 'login',
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

class EmailService {
  static async sendWeatherReport(user,weatherContent) {
    try {
      const mailOptions = {
        from: '"Weather App" <nodeapp53@gmail.com>',
        to: user.email,
        subject: 'Hourly Weather Report',
        html: weatherContent,
     
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Weather report sent to ${user.email}: ${info.response}`);
    } catch (error) {
      console.error('Error sending weather report:', error);
    }
  }
}

module.exports = EmailService;
