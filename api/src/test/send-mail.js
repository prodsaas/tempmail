const nodemailer = require("nodemailer");
require("dotenv").config({ quiet: true });

const emailAddress = process.argv[2];

if (!emailAddress) {
    console.error("Correct Usage: node src/test/send-mail.js <emailAddress>\n");
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    host: "localhost",
    port: process.env.SMTP_PORT,
    secure: false,
    tls: { rejectUnauthorized: false }
});

async function sendMail() {
    try {
        const mail = await transporter.sendMail({
            from: '"Test User" test@example.com',
            to: emailAddress,
            subject: "Test",
            text: "This is a test mail.",
            html: "<h2>Test mail</h2><br><p>This is a test mail.</p>",
        });
        console.log(mail.response);
    }
    catch (error) {
        console.error(error.message);
    }
}

sendMail();