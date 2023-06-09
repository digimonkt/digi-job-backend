import nodeMailer from "nodemailer";

export const nodeMailFunc = async (
  email: string,
  subject: string,
  content: string
) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USER_NAME, //
      pass: process.env.PASSWORD, //
    },
  });
  transporter.sendMail(
    {
      from: process.env.USER_NAME, // sender address
      to: email, // list of receivers
      subject, // Subject line
      html: content, // html body
    },
    (err, info) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(info.response);
      }
    }
  );
};
