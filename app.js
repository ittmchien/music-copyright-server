const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const uploadRoute = require("./routes/uploadRoute");

//Config
dotenv.config();

const app = express();
// global.__basedir = __dirname;
var corsOptions = {
  origin: `http://localhost:${process.env.PORT}`,
};

app.use(cors());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.listen(4000, () => {
  console.log("Server is running");
});
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connected to Database");
});

//Route
app.use("/v1/auth", authRoute);
app.use("/v1/admin", adminRoute);
app.use("/v1/user", userRoute);
app.use("/v1/upload", uploadRoute);

module.exports = app;
