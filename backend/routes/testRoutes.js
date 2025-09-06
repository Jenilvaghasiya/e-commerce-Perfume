// backend/routes/testRoutes.js
const express = require("express");
const router = express.Router();
const { insertMessage, getMessages } = require("../Controller/testController");

router.post("/db-check", insertMessage); // POST
router.get("/db-check", getMessages);   // GET

module.exports = router;
