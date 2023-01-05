const express = require("express");

const app = express();
var ExpressPeerServer = require("peer").ExpressPeerServer;
var peerExpress = require("express");
var peerApp = peerExpress();
var peerServer = require("http").createServer(peerApp);
var options = { debug: true };
var peerPort = 443;
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");

peerApp.use("/peerjs", ExpressPeerServer(peerServer, options));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});

server.listen(process.env.port || 80);
peerServer.listen(peerPort);
