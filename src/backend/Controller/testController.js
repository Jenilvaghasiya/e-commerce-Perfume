// backend/Controller/testController.js
const Test = require("../models/TestDB");

// POST - insert a message
exports.insertMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const newMsg = new Test({ message });
    await newMsg.save();

    res.status(201).json({ success: true, message: "Message inserted", data: newMsg });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to insert message", error: error.message });
  }
};

// GET - fetch all messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Test.find();
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch messages", error: error.message });
  }
};
