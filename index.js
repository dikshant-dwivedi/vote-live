require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let teacher = "";
let question = null;
let users = [];

io.on("connection", (socket) => {
  socket.emit("check_for_teacher", teacher);

  socket.on("check_for_teacher", () => {
    socket.emit("check_for_teacher", teacher);
  });

  socket.on("register_as_teacher", (cb) => {
    teacher = socket.id;
    socket.broadcast.emit("teacher_registered");
    cb();
  });

  socket.on("ask_question", (data, cb) => {
    question = data;
    users = [];
    socket.broadcast.emit("answer_question", question);
    cb();
  });

  socket.on("cast_vote", (option, cb) => {
    question.options = question.options.map((i) => {
      if (i.value === option) {
        i.votes++;
      }
      return i;
    });
    users.push(socket.id);
    socket.broadcast.emit("update_poll_result", question);
    cb();
  });

  socket.on("send_question", () => {
    if (users.includes(socket.id)) {
      socket.emit("send_question_to_student", null);
    } else {
      socket.emit("send_question_to_student", question);
    }
  });

  socket.on("disconnect", () => {
    if (socket.id === teacher) {
      teacher = "";
      question = null;
      socket.broadcast.emit("teacher_disconnected");
    }
  });
});

__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

httpServer.listen(process.env.PORT || 5000, () => {
  console.log("Server started at port: ", process.env.PORT || 5000);
});
