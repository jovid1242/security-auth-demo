require("dotenv").config();
const express = require("express");
const http = require("http"); 
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
 

app.use(express.json());
app.use(fileUpload());
app.use(cors({ origin: "*" }));

app.use("/auth", require("./routes/authRoutes"));
app.use("/protected", require("./routes/protectedRoutes")); 
  

server.listen(PORT, () => {
  console.log("Server is running " + `http://localhost:${PORT}`);
});
