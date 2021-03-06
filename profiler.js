/**
 * fb-messenger-to-slack
 * Copyright (C) 2015  Léo Lam
 * Refer to the included LICENSE file for the license.
 */

let _ = require("lodash");

module.exports.start = (description, data) => {
  let start = process.hrtime();
  return {
    end: () => {
      let elapsed = process.hrtime(start)[1] / 1000000;
      let duration = parseFloat(process.hrtime(start)[0] + "." + elapsed.toFixed(0), 10);
      let message = description + " took " + duration + "s";
      log.trace(_.extend(data, {
        component: "profiler",
        description,
        duration,
      }), message);
    },
    reset: () => {
      start = process.hrtime();
    },
  };
};
