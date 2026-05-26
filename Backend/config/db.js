import dns from "dns";
import mongoose from "mongoose";

export let dbConnected = false;

const getMongoUrl = () => {
  const url = process.env.MONGO_URL || process.env.MONGODB_URI;
  if (url) return url;
  console.warn(
    "No MongoDB connection string found in MONGO_URL or MONGODB_URI. Falling back to local MongoDB at mongodb://127.0.0.1:27017/Tables"
  );
  return "mongodb://127.0.0.1:27017/Tables";
};

const configureDnsForAtlas = (mongoUrl) => {
  if (typeof mongoUrl === "string" && mongoUrl.startsWith("mongodb+srv://")) {
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
      console.log("Using public DNS servers for MongoDB SRV resolution.");
    } catch (dnsError) {
      console.warn("Could not override DNS servers for MongoDB SRV lookup:", dnsError.message);
    }
  }
};

const tryConnect = async (mongoUrl) => {
  await mongoose.connect(mongoUrl, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    family: 4,
  });
};

export const connectDB = async () => {
  const mongoUrl = getMongoUrl();
  configureDnsForAtlas(mongoUrl);

  try {
    await tryConnect(mongoUrl);
    dbConnected = true;
    console.log("MONGODB CONNECTED SUCCESSFULLY!");
    return true;
  } catch (error) {
    console.error("Error connecting to MONGODB", error);

    const message = String(error?.message || "").toLowerCase();
    const isAuthError = message.includes("authentication failed") || message.includes("bad auth");
    const isSrvError = message.includes("querysrv") || message.includes("querysrv") || message.includes("srv");

    if (isAuthError) {
      console.error(
        "MongoDB authentication failed. Verify MONGO_URL username/password, Atlas user permissions, and the auth database."
      );
    } else if (isSrvError && mongoUrl.startsWith("mongodb+srv://")) {
      console.error(
        "Atlas SRV DNS lookup failed. Check your network DNS or use a standard mongodb:// connection string if DNS SRV is blocked."
      );
    } else {
      console.error(
        "MongoDB connection failed. Check your connection string, network access, and Atlas cluster configuration."
      );
    }

    const fallbackUrl = "mongodb://127.0.0.1:27017/Tables";
    if (mongoUrl !== fallbackUrl) {
      console.log("Attempting fallback to local MongoDB:", fallbackUrl);
      try {
        await tryConnect(fallbackUrl);
        dbConnected = true;
        console.log("MONGODB CONNECTED SUCCESSFULLY TO LOCAL DB!");
        return true;
      } catch (fallbackError) {
        console.error("Local MongoDB fallback failed:", fallbackError);
      }
    }

    return false;
  }
};