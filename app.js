/**
 * fb-messenger-to-slack
 * Copyright (C) 2015  Léo Lam
 * Refer to the included LICENSE file for the license.
 */

global.log = require("./logs");
global.config = require("config");
global.appRoot = __dirname;
global.requireFromRoot = (path) => {
  return require(global.appRoot + "/" + path);
};

process.on("uncaughtException", (error) => {
  log.fatal(error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  log.fatal({ reason, promise }, "Unhandled promise rejection");
  throw new Error("Unhandled rejection: " + reason);
});

require("./listen");
