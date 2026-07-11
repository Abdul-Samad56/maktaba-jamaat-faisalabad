import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export async function connectDb(uri) {
  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000,
  });
}
