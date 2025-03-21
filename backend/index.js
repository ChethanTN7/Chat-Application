const express = require("express");
const dbConnection = require("./dbconnection");
const UserModel = require("./Models/UserModel");
const MessageModel = require("./Models/MessageModel");
const dotenv = require("dotenv").config();
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { type } = require("os");
const { log } = require("console");

const app = express();
const server = http.createServer(app);

const chatIo = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins (you can replace "*" with specific domains like "http://localhost:3000")
    methods: ["GET", "POST"],
  },
  path: "/socket/chat", // This is the custom path
});

const shareIo = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins (you can replace "*" with specific domains like "http://localhost:3000")
    methods: ["GET", "POST"],
  },
  path: "/socket/share", // This is the custom path
});

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

dbConnection();

// Define a simple route
app.get("/", (req, res) => {
  try {
    res.send("Hello World!");
  } catch (error) {
    console.log(error.message);
  }
});

// Sign-In
app.post("/sign-in", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const users = await UserModel.findOne({ email });
    if (users) {
      return res.status(201).json({
        success: false,
        message: "User already exist",
      });
    }

    await UserModel.create({ name, email, password });

    return res.status(200).json({
      success: true,
      message: "User added successfully",
    });
  } catch (error) {
    console.log(error.message);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    console.log("login");

    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password }).select("_id");

    if (!user) {
      return res.status(201).json({
        success: false,
        message: "Invalid credencials",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User found",
      user,
    });
  } catch (error) {
    console.log(error.message);
  }
});

//
app.get("/get/profile/:id", async (req, res) => {
  const { id } = req.params;
  console.log("profile");

  const user = await UserModel.findById(id).select("name email");
  if (!user) {
    return res.status(201).json({ success: false, message: "Not found" });
  }

  return res.status(200).json({
    success: true,
    message: "User Details",
    user,
  });
});

// add recipients
app.put("/add/recipient/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const recipientId = await UserModel.findOne({ email: email }).select("_id");
    // console.log(recipientId._id);
    if (!recipientId) {
      return res.status(201).json({
        success: false,
        message: "Recipient not found",
      });
    }

    await UserModel.updateOne(
      { _id: id },
      { $addToSet: { recipients: recipientId._id } }
    );
    await UserModel.updateOne(
      { _id: recipientId },
      { $addToSet: { recipients: id } }
    );

    const userdata = await UserModel.findById(id, "recipients").populate(
      "recipients",
      "name"
    );

    return res.status(200).json({
      success: true,
      message: "Recipient added",
      user: userdata.recipients,
    });
  } catch (error) {
    console.log(error.message);
  }
});

// Get all recipients
app.get("/get/recipients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await UserModel.findById(id, "recipients").populate(
      "recipients",
      "name"
    );

    if (!userData) {
      return res.status(201).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Recipients are",
      data: userData.recipients,
    });
  } catch (error) {
    console.log(error.message);
  }
});

// Get all messeges
app.put("/get/messages", async (req, res) => {
  try {
    const { id, rid } = req.body;

    const data = await MessageModel.find({
      $or: [
        { sender: id, receiver: rid },
        { sender: rid, receiver: id },
      ],
    }).select("sender time content");

    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: "No messages found" });
    }

    const messages = data.map((ele) => {
      const { sender, time, ...rest } = ele._doc; // Destructure and omit sender
      return ele.sender == id
        ? { ...rest, type: "send", date: ele.time }
        : { ...rest, type: "receive", date: ele.time };
    });

    return res.status(200).json({
      success: true,
      message: "The messages are:",
      messages,
    });
  } catch (error) {
    console.log(error.message);
  }
});

// Chat socket
chatIo.on("connection", (socket) => {
  console.log("A user connected");
  const id = socket.handshake.query.id;
  const rid = socket.handshake.query.rid;
  console.log(id, " and ", rid);

  socket.on("chat message", (msg) => {
    console.log("Message received: " + msg);
    chatIo.emit("chat message", msg); // Broadcast to all clients
  });

  socket.on("message", async (message) => {
    console.log(message);

    const newMessage = await MessageModel.create({
      sender: id,
      receiver: rid,
      time: message.date,
      content: message.msg,
    });
    // Add the message reference to the sender and receiver's messages array
    await UserModel.findByIdAndUpdate(id, {
      $push: { messages: newMessage._id },
    });
    await UserModel.findByIdAndUpdate(rid, {
      $push: { messages: newMessage._id },
    });

    chatIo.emit("chat" + rid, { ...message, id });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

let requests = [];

shareIo.on("connection", (socket) => {
  let id, rid;
  log("Share a user connected");

  socket.on("init", async (data) => {
    log(data);
    id = data.id;
    rid = data.recipientId;
    requests.push({ id, rid });
    log(requests);
    const name = await UserModel.findById(data.id).select("name");

    shareIo.emit("init" + data.recipientId, {
      message: `${name.name} want to share you ${data.metaData.name}`,
    });
  });

  socket.on("accept", (accept) => {
    log(accept);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
