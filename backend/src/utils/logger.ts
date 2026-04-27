import pino from "pino";
import cron from "cron";
import fs from "fs/promises";
import path from "path";
const isProd = process.env.NODE_ENV === "production";

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      level: "debug",
      options: { colorize: true },
    },
    {
      target: "pino-roll",
      options: {
        file: "./src/logs/app.log",
        frequency: "daily", // or 'size'
        size: "10m", // rotate after 10MB
        mkdir: true,
        compress: true,
      },
    },
  ],
});
// Schedule daily cleanup at 2 AM
new cron.CronJob("0 2 * * *", async () => {
  try {
    const logsDir = path.join(process.cwd(), "src/logs");
    const files = await fs.readdir(logsDir);
    const now = Date.now();
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(logsDir, file);
      const stats = await fs.stat(filePath);
      if (now - stats.mtimeMs > fourteenDaysMs) {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    console.error("Log cleanup failed:", error);
  }
});

const logger = pino(
  {
    level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
    timestamp: pino.stdTimeFunctions.isoTime,
    serializers: {
      err: pino.stdSerializers.err,
    },
    redact: ["req.headers.authorization", "password", "token"],
  },
  transport,
);

export default logger;
