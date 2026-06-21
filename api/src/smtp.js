const { SMTPServer } = require("smtp-server");
const { simpleParser } = require("mailparser");
const { client } = require("./config/redis");
const { pool } = require("./config/db");
const { DOMAIN } = require("./utils/domain");

const smtpServer = new SMTPServer({
    authOptional: true,
    disabledCommands: ["AUTH"],

    async onRcptTo(address, session, callback) {
        const emailAddress = address.address.toLowerCase();
        if (!emailAddress.endsWith(`@${DOMAIN}`)) {
            return callback(new Error("Incorrect domain"));
        }

        const emailId = emailAddress.split("@")[0];

        try {
            const keyExists = await client.exists(`email:${emailId}`);
            if (keyExists === 0) {
                return callback(new Error("Email Unknown / Email Expired"));
            }

            return callback();
        }
        catch (error) {
            return callback(new Error("Mail Server Error"));
        }
    },

    onData(stream, session, callback) {
        simpleParser(stream, {}, async (err, parsed) => {
            if (err) {
                return callback(err);
            }

            try {
                let recipientEmail = "";
                if (parsed.to && parsed.to.value && parsed.to.value[0]) {
                    recipientEmail = parsed.to.value[0].address.toLowerCase();
                }
                else if (session.envelope && session.envelope.rcptTo && session.envelope.rcptTo[0]) {
                    recipientEmail = session.envelope.rcptTo[0].address.toLowerCase();
                }

                if (!recipientEmail.endsWith(`@${DOMAIN}`)) {
                    return callback();
                }

                const emailId = recipientEmail.split("@")[0];

                await pool.query(
                    `INSERT INTO mails (email_id, from_email, from_name, subject, text, html) 
                    VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        emailId,
                        parsed.from.value[0].address,
                        parsed.from.value[0].name || null,
                        parsed.subject || null,
                        parsed.text || null,
                        parsed.html || null
                    ]
                );

                return callback();
            }
            catch {
                return callback(new Error("Failed processing data"));
            }
        });
    }
});

module.exports = smtpServer;