const { Pool } = require("pg");

const pool = new Pool(
    process.env.DB_URL ? {
        connectionString: process.env.DB_URL,
        ssl: { rejectUnauthorized: false }
    } : {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
);

async function connectDatabase() {
    try {
        // mail table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS mails (
                id SERIAL PRIMARY KEY,
                email_id VARCHAR(50) NOT NULL,
                from_email VARCHAR(255) NOT NULL,
                from_name VARCHAR(255),
                subject VARCHAR(255),
                text TEXT,
                html TEXT,
                received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        // mail indexes
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_email_id ON mails(email_id)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_received_at ON mails(received_at)`);

        console.log("Database connected");
    }
    catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

let cleanupInterval;

function startDbCleanup() {
    if (cleanupInterval) return;

    cleanupInterval = setInterval(async () => {
        try {
            await pool.query("DELETE FROM mails WHERE received_at < NOW() - INTERVAL '10 minutes'");
        }
        catch (error) {
            console.error(`Database Cleanup Error: ${error.message}`);
        }
    }, 60 * 1000);
};

function stopDbCleanup() {
    if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
    }
};

module.exports = { pool, connectDatabase, startDbCleanup, stopDbCleanup };