const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");

app.use(express.static(__dirname));
app.use(bodyParser.json());

// Database Stuff
mongoose.Promise = Promise;

const dbUrl =
  "mongodb+srv://keisto:YxjOCzAYPmfnzToW@cluster0.hziww.mongodb.net/Cluster0?retryWrites=true&w=majority";

const Message = mongoose.model("Message", {
  name: String,
  message: String,
});

app.get("/messages", (req, res) => {
  Message.find({}, (error, messages) => res.send(messages));
});

app.post("/messages", async (req, res) => {
  try {
    const message = new Message(req.body);
    const savedMessage = await message.save();

    const censored = await Message.findOne({ message: "badword" });
    if (censored) {
      await Message.deleteOne({ _id: censored.id });
    } else {
      io.emit("message", req.body);
    }
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    return console.error(error);
  } finally {
    // Runs after either try or fail.
    console.log("Message post called.");
  }
});

io.on("connection", (socket) => {
  console.log("user connected");
});

mongoose.connect(dbUrl, (error) => {
  console.log("mongo db connection", error);
});

const server = http.listen(3000, () => {
  console.log("Server is listening on port:", server.address().port);
});
