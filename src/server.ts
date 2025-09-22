import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";

let server: Server;

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  if (server) {
    server.close(() => {
      console.error("Server closed due to unhandled rejection");
      process.exit(1);
    });
  }
});

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log("🛢 Database connected successfully");
    server = app.listen(config.port, () => {
      console.log(`🚀 Application is running on port ${config.port}`);
    });
  } catch (error) {
    console.log("Failed to conncect to database:", error);
    process.exit(1);
  }
}

main();

process.on("SIGTERM", () => {
  console.log("SIGTERM is received");
  if (server) {
    server.close(() => {
      console.log("Server closed due to SIGTERM");
    });
    process.exit(0);
  } else {
    process.exit(1);
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT is received");
  if (server) {
    server.close(() => {
      console.log("Server closed due to SIGINT");
    });
    process.exit(0);
  } else {
    process.exit(1);
  }
});
