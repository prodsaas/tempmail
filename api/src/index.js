require("dotenv").config({ quiet: true });
const smtpServer = require("./smtp");
const app = require("./app");
const { connectRedis, client } = require("./config/redis");
const { connectDatabase, pool, startDbCleanup, stopDbCleanup } = require("./config/db");

const SMTP_PORT = process.env.SMTP_PORT;
const EXPRESS_PORT = process.env.EXPRESS_PORT;

async function startBackend() {
    try {
        await connectRedis();
        await connectDatabase();
        startDbCleanup();

        smtpServer.listen(SMTP_PORT, () => console.log(`SMTP running on PORT ${SMTP_PORT}`));
        app.listen(EXPRESS_PORT, () => console.log(`Server running on PORT ${EXPRESS_PORT}`));
    }
    catch {
        process.exit(1);
    }
}

async function shutdownBackend() {
    try {
        stopDbCleanup();
        await smtpServer.close();
        await client.disconnect();
        await pool.end();
        process.exit(0);
    }
    catch {
        process.exit(1);
    }
};

process.on("SIGTERM", () => shutdownBackend());
process.on("SIGINT", () => shutdownBackend());

startBackend();