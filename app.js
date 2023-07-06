require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const { errorHandler } = require("./middleware/error");
const cors = require("cors");
require("dotenv").config();
const { handleNotFound } = require("./utils/helpers");

const userRouter = require("./routes/users");
const actorRouter = require("./routes/actor");
const movieRouter = require("./routes/movie");
const reviewRouter = require("./routes/review");
const adminRouter = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/user", userRouter);
app.use("/actor", actorRouter);
app.use("/movie", movieRouter);
app.use("/review", reviewRouter);
app.use("/admin", adminRouter);
app.use("/*", handleNotFound);

app.use(errorHandler);

module.exports = app;
