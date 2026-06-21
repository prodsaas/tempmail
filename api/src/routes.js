const express = require("express");
const router = express.Router();
const { createEmail, changeEmail, fetchMails } = require("./controllers");

router.get("/create-email", createEmail);
router.get("/change-email", changeEmail);
router.get("/fetch-mails", fetchMails);

module.exports = router;