import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
  from: `"MiniShop Support" <${process.env.EMAIL_USER}>`,
  to: options.email,
  subject: options.subject,
  text: options.message,
  html: `<p>Click <a href="${options.link}">here</a> to reset your password.</p>`,
};


    await transporter.sendMail(mailOptions);
};

export default sendEmail;
