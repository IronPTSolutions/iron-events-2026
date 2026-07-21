const express = require("express");
const loggerHttp = require("pino-http");
const logger = require("./lib/logger");
const config = require("./lib/config");
const apiRouter = require("./controllers");
const { errors } = require("./middlewares");
const session = require("./lib/session");

require("./lib/db");

const app = express();

app.use(loggerHttp({ logger }));
app.use(express.json());
// Session middleware must be mounted before routes so req.session is available in every handler
app.use(session);

app.use("/api/v0", apiRouter);

app.use(errors.notFound);
app.use(errors.globalHandler);

app.listen(config.get("port"), () =>
  logger.info(`Application listen at port ${config.get("port")}`),
);
