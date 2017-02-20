//
// Setup Firebase
const firebase = require("firebase-admin");
const serviceAccount = require("./.secret.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://valtameri-e1fd0.firebaseio.com"
});

const database = firebase.database();

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

  // Start appropriate action
  switch (request.action) {
    case "spawn":
      await spawn(userID);
      break;
    case "self-destruct":
      await selfDestruct(userID);
      break;
    case "move":
      await move(userID, request.to);
      break;
    default:
      throw new Error("Unknown action type.");
  }

  return true;
};

//
// Spawn
const spawn = async userID => {
  // Check if player is already ingame
  const existingPlayer = await database.ref(`players/${userID}`).once("value");

  if (existingPlayer.val() !== null) {
    throw new Error("Cannot spawn while you are still in the game.");
  }

  // Generate a spawn location
  // TODO:
  // - avoid collisions with entities
  // - make this non-random
  // - use system specified in design
  const radius = 3;
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const roundedX = Math.round(x);
  const roundedY = Math.round(y);

  // Create player
  const now = firebase.database.ServerValue.TIMESTAMP;
  const updates = {
    [`players/${userID}`]: {
      // sectorID: `${roundedX},${roundedY}`,
      sectorID: "0,0",
      state: {
        health: 10,
        immuneUntil: Date.now() + 10 * 1000,
      },
      position: {
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        t: now,
        "~x": roundedX,
        "~y": roundedY
      }
    },
    [`playerSecrets/${userID}`]: true,
    // [`sectorPlayers/${roundedX},${roundedY}/${userID}`]: true
    [`sectorPlayers/0,0/${userID}`]: true
  };

  await database.ref().update(updates);

  return;
};

//
// Self-destruct
const selfDestruct = async userID => {
  // Find all sectors that have indexed this player
  const sectorsWithPlayer = await database
    .ref("sectorPlayers")
    .orderByChild(userID)
    .startAt(true)
    .once("value");

  // Destroy all of those indexes
  if (sectorsWithPlayer.numChildren() > 0) {
    sectorsWithPlayer.forEach(sector => {
      sector.child(userID).ref.remove();
    });
  }

  // Remove player
  const updates = {
    [`players/${userID}`]: null,
    [`playerSecrets/${userID}`]: null
  };

  await database.ref().update(updates);

  return;
};

//
// Move

const move = async (userID, to) => {
  if (typeof to[0] !== "number" || typeof to[1] !== "number") {
    throw new Error(`Invalid movement coordinates: ${to[0]},${to[1]}`);
  }

  const playerReference = database.ref(`heroes/${userID}`);
  let from;

  // Lock moving player
  // TODO: make sure the player can move and remove resources
  const lockTransaction = await playerReference.transaction(player => {
    if (player) {
      if (!player.locked) {
        player.locked = true;
        player.lastActed = Date.now();
        from = [player.x, player.y];
        return player;
      } else {
        return;
      }
    } else {
      return null;
    }
  });

  // If there was no player or the locking didn't work, stop
  const lockedHero = lockTransaction.snapshot.val();

  if (!lockedHero || !lockTransaction.committed) {
    throw new Error("Failed to start movement");
  }

  // Add moving player to target tile
  const fromReference = database.ref(`locations/${from[0]},${from[1]}/playerID`);
  const toReference = database.ref(`locations/${to[0]},${to[1]}/playerID`);

  const addTransaction = await toReference.transaction(playerID => {
    if (playerID === null) {
      return userID;
    } else {
      return;
    }
  });

  if (addTransaction.committed) {
    // If that worked, remove moving player from origin tile
    fromReference.transaction(playerID => {
      if (playerID === null) {
        return null;
      } else {
        if (playerID === userID) {
          return null;
        } else {
          return;
        }
      }
    });
  } else {
    // Else remove lock from the player and stop
    // TODO: refund resources
    await playerReference.transaction(player => {
      if (player) {
        player.locked = null;
        return player;
      } else {
        return null;
      }
    });

    throw new Error("Failed to add player to target tile");
  }

  // On ultimate success, update the player
  await playerReference.transaction(player => {
    if (player) {
      player.x = to[0];
      player.y = to[1];
      player.locked = null;
      return player;
    } else {
      return null;
    }
  });

  return;
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

  // Hero requests
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
