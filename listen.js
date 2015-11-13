/**
 * fb-messenger-to-slack
 * Copyright (C) 2015  Léo Lam
 * Refer to the included LICENSE file for the license.
 */

let moduleLogger = log.child();

// Configuration
const { email, password } = config.get("facebook");
if (!email || !password) {
  throw new Error("No email and/or password -- please configure the app correctly");
}
const slackHookUrl = config.get("slack.hookUrl");
if (!slackHookUrl) {
  throw new Error("No Slack hook URL -- please configure the app correctly");
}
const mapping = config.get("mapping");
if (!mapping || !Array.isArray(mapping) || !mapping.length) {
  throw new Error("No valid or empty mapping -- please configure the app correctly");
}
mapping.forEach(entry => {
  if (!entry.facebookThreadId || !entry.slackTargetChannel) {
    moduleLogger.fatal({ entry }, "Invalid mapping entry: no facebookThreadId or slackTargetChannel");
    throw new Error("Invalid mapping entry -- please configure the app correctly");
  }
});

let Slack = require("node-slack");
let slack = new Slack(slackHookUrl);
let login = require("facebook-chat-api");

// Used to prompt user for 2FA code if needed.
let readline = require("readline");
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


moduleLogger.info("Logging in");
login({ email, password, forceLogin: true }, (error, api) => {
  if (error) {
    if (error.error === "login-approval") {
      moduleLogger.warn(error, "Failed to log in: login approval needed");
      console.error("Enter 2FA code > ");
      rl.on("line", (line) => {
        error.continue(line);
        rl.close();
      });
      return;
    }
    moduleLogger.error(error, "Failed to log in");
    return;
  }
  moduleLogger.info("Logged in");
  api.setOptions({ logLevel: "silent", selfListen: true });
  listen(api);
});

let listen = (api) => {
  moduleLogger.info("Listening for events");
  api.listen((error, event) => {
    if (error) {
      moduleLogger.fatal(error, "Failed to listen for events, aborting");
      process.exit(1);
      return;
    }
    let mappingEntry = mapping.find(entry => entry.facebookThreadId.toString() === event.threadID.toString());
    if (event.threadID && !mappingEntry) {
      return;
    }
    switch (event.type) {
      case "message":
        sendToSlack(mappingEntry.slackTargetChannel, event);
        markAsRead(api, event);
        moduleLogger.debug({
          body: event.body,
          threadName: event.threadName,
          threadID: event.threadID,
          senderName: event.senderName,
          senderID: event.senderID,
        }, "New message");
        break;
      default:
        moduleLogger.info({ event }, "Unhandled event");
        break;
    }
  });
};

let sendToSlack = (channel, event) => {
  slack.send({
    text: event.body,
    channel,
    username: `${event.senderName} (${event.threadName})`,
    "icon_url": `https://graph.facebook.com/${event.senderID}/picture?type=square&width=200`,
    "unfurl_links": true,
    "link_names": 1,
  });
  if (Array.isArray(event.attachments)) {
    event.attachments
      .filter(attachment => attachment.type === "photo")
      .forEach(attachment => {
        let photoUrl = attachment.hiresUrl;
        slack.send({
          text: photoUrl,
          channel,
          username: `${event.senderName} (${event.threadName})`,
          "icon_url": `https://graph.facebook.com/${event.senderID}/picture?type=square&width=200`,
          "unfurl_links": true,
          "link_names": 1,
        });
      });

    event.attachments
      .filter(attachment => attachment.type === "file")
      .forEach(attachment => {
        slack.send({
          text: `${attachment.url} (${attachment.name}), ${attachment.mimeType})`,
          channel,
          username: `${event.senderName} (${event.threadName})`,
          "icon_url": `https://graph.facebook.com/${event.senderID}/picture?type=square&width=200`,
          "unfurl_links": true,
          "link_names": 1,
        });
      });
  }
};

let markAsRead = (api, event) => {
  api.markAsRead(event.threadID, (error) => {
    if (error) {
      moduleLogger.error(error, "Failed to mark message as read");
      return;
    }
  });
};
