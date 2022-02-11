const socketio = require("socket.io");

module.exports = function (server) {
  const io = socketio(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.emit("message", "Welcome from our message system");
  });
};
