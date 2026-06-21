const crypto = require("crypto");
const { client } = require("./config/redis");
const { pool } = require("./config/db");
const { getCookie, setCookie } = require("./utils/cookie");
const { DOMAIN } = require("./utils/domain");

exports.createEmail = async (req, res) => {
    try {
        const existingEmailId = getCookie(req);
        if (existingEmailId) {
            const cachedSession = await client.get(`email:${existingEmailId}`);
            if (cachedSession) {
                const { emailAddress, expiresAt } = JSON.parse(cachedSession);
                return res.status(200).json({ emailAddress, expiresAt });
            }
        }

        const emailId = crypto.randomBytes(6).toString("hex").toLowerCase();
        const emailAddress = `${emailId}@${DOMAIN}`;

        const EXPIRE_IN_SECONDS = 10 * 60;
        const expiresAt = new Date(Date.now() + EXPIRE_IN_SECONDS * 1000).toISOString();

        const sessionPayload = JSON.stringify({ emailAddress, expiresAt });
        await client.set(`email:${emailId}`, sessionPayload, { EX: EXPIRE_IN_SECONDS });

        setCookie(res, emailId, EXPIRE_IN_SECONDS);
        return res.json({ emailAddress, expiresAt });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

exports.changeEmail = async (req, res) => {
    try {
        const existingEmailId = getCookie(req);
        if (existingEmailId) {
            await client.del(`email:${existingEmailId}`);
            await pool.query("DELETE FROM mails WHERE email_id = $1", [existingEmailId]);
        }

        const emailId = crypto.randomBytes(6).toString("hex").toLowerCase();
        const emailAddress = `${emailId}@${DOMAIN}`;

        const EXPIRE_IN_SECONDS = 10 * 60;
        const expiresAt = new Date(Date.now() + EXPIRE_IN_SECONDS * 1000).toISOString();

        const sessionPayload = JSON.stringify({ emailAddress: emailAddress, expiresAt });
        await client.set(`email:${emailId}`, sessionPayload, { EX: EXPIRE_IN_SECONDS });

        setCookie(res, emailId, EXPIRE_IN_SECONDS);
        return res.json({ emailAddress, expiresAt });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

exports.fetchMails = async (req, res) => {
    try {
        const existingEmailId = getCookie(req);
        if (!existingEmailId) {
            return res.status(401).json({ message: "Email Id not found" });
        }

        const remainingTtl = await client.ttl(`email:${existingEmailId}`);
        if (remainingTtl <= 0) {
            return res.status(401).json({ message: "Email Id not found" });
        }

        const result = await pool.query(
            `SELECT id, from_email, from_name, subject, text, html, received_at FROM mails 
            WHERE email_id = $1 ORDER BY received_at DESC`,
            [existingEmailId]
        );

        return res.json(result.rows);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};