const restify = require("restify");
const config = require("./config");
const mongoose = require("mongoose");
const rjwt = require("restify-jwt-community");
const corsMiddleware = require("restify-cors-middleware");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Post = require("./models/Post");
const { base64Encode } = require("./utils");

const server = restify.createServer();

// Middleware
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["*"],
});

server.pre(cors.preflight);
server.use(cors.actual);

server.listen(config.PORT, () => {
  mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  });
  console.log(`Server running: ${server.name}, ${server.url}`);
});

const db = mongoose.connection;

db.once("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("db connected");
  require("./routes/posts")(server);
  require("./routes/auth")(server);
  require("./routes/users")(server);
  require("./routes/notifications")(server);
});
