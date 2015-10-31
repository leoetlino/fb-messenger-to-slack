/**
 * fb-messenger-to-slack
 * Copyright (C) 2015  Léo Lam
 * Refer to the included LICENSE file for the license.
 *
 * This file sets up the logging system and also sets up the
 * external logs system if enabled in the config.
 *
 * The log module will be called by the whole application a lot
 * during its lifetime and is expected to implement the following methods:
 * child(), trace(), debug(), info(), warn(), error(), fatal(), flushQueue().
 */

let bunyan = require("bunyan");
let streams = [{
  level: "trace",
  stream: process.stdout,
}];

let logger = bunyan.createLogger({
  name: "fb-messenger-to-slack",
  streams: streams,
  serializers: {
    err: bunyan.stdSerializers.err,
  },
});

export default logger;
