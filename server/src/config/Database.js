const ENV = require("./config");
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URL);
        console.log("Database Connected");
    } catch (error) {
        console.log("DB Error:", error);
    }
};

module.exports = connectDB;