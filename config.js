module.exports = {
  PORT: process.env.PORT || 5555,
  URL: process.env.URL || "http://localhost:5555",
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb+srv://saikat:saikat@cluster0.5e3hw.mongodb.net/restify-api?retryWrites=true&w=majority",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
};
