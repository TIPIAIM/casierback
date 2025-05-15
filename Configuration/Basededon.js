const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URI = process.env.Mong_tiptaop; 
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI
    );
    console.log(`Connecté a mongodb: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
module.exports = connectDB;
