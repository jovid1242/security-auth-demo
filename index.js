require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(fileUpload());
app.use(cors({ origin: "*" }));

app.use("/auth", require("./routes/authRoutes"));
app.use("/protected", require("./routes/protectedRoutes")); 
 
require("./routes/socketRoutes")(io);

server.listen(PORT, () => {
  console.log("Server is running " + `http://localhost:${PORT}`);
});
