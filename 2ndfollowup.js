const nodemailer = require("nodemailer");

const recipients = [
  "example1@gmail.com",
  "example2@gmail.com"
];

const company = "TechCorp";
const expertise = "React, Node.js, MongoDB";

async function sendApplication() {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: "yourmail@gmail.com", 
      pass: "your-app-password", 
    },
  });

  try {
    let info = await transporter.sendMail({
      from: '"Your Name" <yourmail@gmail.com>', 
      to: recipients, 
      subject: `Application for Developer Position at ${company}`,
      text: `Dear Hiring Manager,

I am excited to apply for the Developer position at ${company}. With hands-on experience in ${expertise}, I believe I can add value to your engineering team.

Please find my resume attached for your review. I would welcome the chance to discuss how I can contribute to ${company}'s success.

Looking forward to your response.

Best regards,
Your Name
yourmail@gmail.com
+91-XXXXXXXXXX`,
      attachments: [
        {
          filename: "Your_Name_Resume.pdf",
          path: "./Your_Name_Resume.pdf",
        },
      ],
    });

    console.log("✅ Email successfully sent: %s", info.messageId);
    console.log("📨 Delivered to:", info.accepted);
    console.log("❌ Failed deliveries:", info.rejected);

  } catch (err) {
    console.error("❗ Error while sending:", err);
  }
}

sendApplication().catch(console.error);
