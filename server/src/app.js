const express = require("express");
const cors = require("cors");
const CookieParser = require("cookie-parser");
const adminRouter = require("./routes/admin.route");
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(CookieParser());

app.use("/api/admin", adminRouter);

module.exports = app;