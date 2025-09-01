const nodemailer = require("nodemailer");
const XLSX = require("xlsx");
const path = require("path");
const cli=require('readline')
const fs = require("fs").promises;

const rl=cli.createInterface({
  input: process.stdin,
  output: process.stdout
});



const skills = []  //add skills here



const resumePath = path.join(__dirname, "resume.pdf");


// ✅ Read contacts from Excel asynchronously
async function loadContacts() {
  try {
    await fs.access(resumePath);
  } catch {
    console.error("❗ Resume file not found:", resumePath);
    process.exit(1);
  }

  const excelPath = path.join(__dirname, "Name_and_Email.xlsx");
  let workbook;
  try {
    workbook = XLSX.readFile(excelPath, { cellStyles: true });
  } catch (err) {
    console.error("❗ Could not read Excel file:", err.message);
    process.exit(1);
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = XLSX.utils.decode_range(sheet["!ref"]);

  let contacts = [];

  for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
    let skipRow = false;
    let rowData = {};
    let skipReason = "";

    for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
      const cellAddress = { c: colNum, r: rowNum };
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      const cell = sheet[cellRef];

      if (!cell) continue;

      const font = cell?.s?.font || {};
      const fontColor = font?.color?.rgb || "";
      const fontSize = font?.sz || "";

      // ❌ Skip if red font
      if (fontColor.toUpperCase() === "FFFF0000") {
        skipRow = true;
        skipReason = `red font in column ${String.fromCharCode(65 + colNum)}`;
        break;
      }

      // ❌ Skip if font size = 8
      if (parseInt(fontSize, 10) === 8) {
        skipRow = true;
        skipReason = `font size 7 in column ${String.fromCharCode(65 + colNum)}`;
        break;
      }

      // Map columns
      if (colNum === 0) rowData.Name = cell.v;
      if (colNum === 1) rowData.Email = cell.v;
      if (colNum === 2) rowData.Company = cell.v || "";
    }

    if (skipRow) {
      console.warn(`⏭️ Skipping row ${rowNum + 1} due to ${skipReason}`);
      continue;
    }

    if (rowData.Email) contacts.push(rowData);
  }

  return contacts;
}

// ✅ Send emails
async function sendEmails(contacts) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "chethanraj509@gmail.com",
      pass: "", // Gmail App Password
    },
  });

  for (const contact of contacts) {
    try {
      const info = await transporter.sendMail({
        from: '"Chethan Raj" <chethanraj509@gmail.com>',
        to: contact.Email,
        subject: "Application for Software Engineer Role",
        text: `Dear ${contact.Name || "HR"},

I hope you’re doing well. I’m reaching out to express my interest in the Software Engineer position at ${contact.Company || ""}. Given my experience in ${skills}, I believe I would be a strong fit for the role.

I’ve attached my resume for your reference and would greatly appreciate any guidance on the application process.

Thank you very much for your time.

Best regards,  
Chethan Raj  
chethanraj509@gmail.com  
+91-9778258442`,
        attachments: [
          {
            filename: "Chethan_Raj_Resume.pdf",
            path: resumePath,
          },
        ],
      });

      console.log(`✅ Email sent to ${contact.Email} (${contact.Name}) : ${info.messageId}`);
    } catch (error) {
      console.error(`❗ Failed to send email to ${contact.Email}:`, error.message);
    }
  }
}

// ✅ Main
(async () => {
  const contacts = await loadContacts();

  if (contacts.length === 0) {
    console.error("No valid contacts found to send emails.");
    return;
  }

  await sendEmails(contacts);
})();
