const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("../models/User");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/promoteToManager.js <email>");
  process.exit(1);
}

const promoteUser = async () => {
  try {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in .env");
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email '${email}' not found.`);
      process.exit(1);
    }

    user.role = "manager";
    await user.save();
    
    console.log("------------------------------------------------");
    console.log(`SUCCESS: User '${user.name}' (${user.email}) is now a MANAGER.`);
    console.log("------------------------------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

promoteUser();
