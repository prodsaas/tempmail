const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.get("/", (req, res) => res.send("OK"));
app.use("/api", routes);

module.exports = app;