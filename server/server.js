//
// Setup Firebase
const firebase = require("firebase-admin");
const serviceAccount = require("./.secret.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://valtameri-e1fd0.firebaseio.com"
});

//
// Setup next
const version = process.env.GAME_VERSION;
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

//
// Setup express
const express = require("express");
const bodyParser = require("body-parser");
const server = express();
server.use(bodyParser.json());

//
// Setup rollbar
const rollbar = require("rollbar");
server.use(
  rollbar.errorHandler("22fca22d3936434eb8b69cc0c453d040", {
    environment: process.env.NODE_ENV || "development"
  })
);

//
// Process and pass on requests
const actions = require("./actions.js");
const processRequest = async request => {
  // Version check
  if (request.version !== version) {
    throw new Error(`Client is outdated. Refreshing! (Version ${request.version} vs. ${version}.)`);
  }

  // Token vs. UID check
  const userID = request.userID;
  const token = await firebase.auth().verifyIdToken(request.token);

  if (userID !== token.uid) {
    throw new Error("You are not authenticated as this player.");
  }

  if ( typeof actions[request.action] === typeof Function ) {
    await actions[request.action](userID, request);
  }
  else {
    throw new Error("Unknown action type.");
  }

  return true;
};

//
// Handle requests
app.prepare().then(() => {
  // Page requests
  server.get("*", (req, res) => {
    try {
      dev && console.log(req.method, req.originalUrl);
      return handle(req, res);
    } catch (error) {
      dev && console.log(error);
      rollbar.handleError(error);
    }
  });

  // Game requests
  server.post("*", async (req, res) => {
    if (dev) {
      console.log(req.method, req.originalUrl, req.body.userID, req.body.action);
    }
    try {
      (await processRequest(req.body)) && res.send();
    } catch (error) {
      dev && console.log(error);
      rollbar.handleError(error);
      res.status(500).send(error.message);
    }
  });

  // Start server
  server.listen(3000, error => {
    if (error) throw error;
    console.log("> Express & next.js ready on http://localhost:3000");
  });
});
