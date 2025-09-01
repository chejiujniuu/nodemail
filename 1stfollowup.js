const nodemailer = require("nodemailer");

const maillist = [
  "gpro41099@gmail.com",
  "chethanraj423@gmail.com"
];

const companyName = "INDIA"; 
const skills = "Java, Python"; 

async function main() {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "chethanraj509@gmail.com",
      pass: "fmgz zpdd eyvw jiqc", 
    },
  });

  try {
    let info = await transporter.sendMail({
      from: '"Chethan Raj" <chethanraj509@gmail.com>', 
      to: maillist, 
      subject: "Follow-up: Application for Software Engineer Role",
      text: `Dear [HR's Name],

I hope you are doing well.

I wanted to kindly follow up regarding my application for the Software Engineer position at ${companyName}. I had applied earlier and shared my resume for your review. With my skills in ${skills}, I am confident I can contribute effectively to your team.

I would greatly appreciate it if you could provide me with an update on the status of my application. Please let me know if any additional information is needed from my side.

Thank you once again for your time and consideration. I look forward to hearing from you.

Best regards,
Chethan Raj
chethanraj509@gmail.com
+91-XXXXXXXXXX`,
    });

    console.log("Follow-up message sent: %s", info.messageId);
    console.log(" Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);

  } catch (error) {
    console.error("Error sending email:", error);
  }
}

main().catch(console.error);
