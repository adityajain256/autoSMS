// import pino from "pino";

// const isPod = process.env.NODE_ENV == "production";

// const transport = isPod
//   ? pino.transport({
//       target: "pino/file",
//       options: {
//         destination: "./src/LogDirectory/logfile.log",
//         translateTime: "yyyy-mm-dd HH:MM:ss",
//         mkdir: true,
//       },
//     })
//   : pino.transport({
//       target: "pino-pretty",
//       options: {
//         colorize: true,
//         translateTime: "yyyy-mm-dd HH:MM:ss",
//         ignore: "pid,hostname",
//       },
//     });

// const logger = pino(
//   {
//     level: isPod ? "debug" : "info",
//     timestamp: pino.stdTimeFunctions.isoTime,
//     serializers: {
//       err: pino.stdSerializers.err,
//     },
//     redact: {
//       paths: ["req.headers.authorization", "password", "token", "secret"],
//       remove: true,
//     },
//   },
//   transport,
// );

// export default logger;

import pino from "pino";
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
