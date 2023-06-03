require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const { errorHandler } = require("./middleware/error");
const cors = require("cors");
require("dotenv").config();
const { handleNotFound } = require("./utils/helpers");

const userRouter = require("./routes/users");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/user", userRouter);
app.use("/*", handleNotFound);

app.use(errorHandler);

module.exports = app;
