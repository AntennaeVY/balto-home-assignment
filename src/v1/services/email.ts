import { mailer } from "../config/email";

export async function sendCongratsEmail(
  recipient: string,
  data: { name: string; date: string; likes: number; followers: number }
) {
  const info = await mailer.transporter?.sendMail({
    from: `"Balto 🐶" <${process.env.MAIL_USER_EMAIL}>`,
    to: recipient,
    subject: "Congratulations from Balto 🎉🍾!",
    html: populateTemplate(data),
  });

  return info;
}

function populateTemplate(data: {
  name: string;
  date: string;
  likes: number;
  followers: number;
}) {
  const { name, date, likes, followers } = data;

  return `<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');
    body {
      font-family: 'Roboto', sans-serif;
      font-size: 16px;
      color: #333333;
      background-color: #f0f0f0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    .logo {
      width: 200px;
      height: auto;
    }
    .content {
      background-color: #ffffff;
      padding: 20px;
    }
    .title {
      font-weight: 500;
      font-size: 24px;
      color: #1a73e8;
    }
    .message {
      font-weight: 300;
      line-height: 1.5;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #1a73e8;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      font-size: 14px;
      color: #999999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://i.imgur.com/Myl1g01.png">
    <div class="content" style="margin-top: 10px">
      <h1 class="title">Congrats <b>${name}</b>!</h1>
      <p class="message">Ever since you became a Balto customer on <b>${date}</b>, you've gained <b>${likes}</b> likes and <b>${followers}</b> follows.</p>
      <a href="https://balto.fr" target="_blank" class="button">Learn More</a>
    </div>
    <div class="footer">
      <!-- Add your footer text here -->
      <p>This email was sent by Balto, the best pet shop !</p>
      <p><a href="https://balto.fr" target="_blank">Unsubscribe</a> | <a href="https://balto.fr" target="_blank">Privacy Policy</a> | <a href="https://balto.fr" target="_blank">Terms of Service<a/></p>
    </div>
  </div>
</body>
</html>`;
}
