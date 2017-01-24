//
// Setup Firebase
const firebase = require("firebase-admin");
const serviceAccount = require("./secret.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://world-15e5d.firebaseio.com"
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
server.use(rollbar.errorHandler(
  "22fca22d3936434eb8b69cc0c453d040",
  {environment: process.env.NODE_ENV || "development"}
));

//
// Handle requests
app.prepare().then(() => {
  // Page requests
  server.get("*", (req, res) => {
    dev && console.log(req.method, req.originalUrl)
    return handle(req, res)
  })

  // Player requests
  server.post("*", async (req, res) => {
    if (dev) {
      console.log(req.method, req.originalUrl, req.body.userID, req.body.action);
    }
    try {
      await handleRequest(req.body) && res.send();
    } catch (error) {
      dev && console.log(error);
      res.status(500).send(error.message);
    }
  })

  // Start server
  server.listen(3000, (error) => {
    if (error) throw error;
    console.log("> Express & next.js ready on http://localhost:3000");
  })
});

//
// Handle and pass on requests
const handleRequest = async (request) => {
  // Version check
  if (request.version !== version) {
    throw new Error(`Client is outdated. Refreshing! (Version ${request.version} vs. ${version}.)`)
  }

  // Token vs. UID check
  const userID = request.userID;
  const token = request.token;

  const decodedToken = await firebase.auth().verifyIdToken(token);

  if (userID !== decodedToken.uid) {
    throw new Error("You are not authenticated as this player.")
  }

  // Start appropriate action
  const action = request.action;

  switch (action) {
    case "spawn":
      await spawn(userID);
      break;
    case "self-destruct":
      await selfDestruct(userID);
      break;
    case "move":
      await move(userID, request.from, request.to);
      break;
    default:
      throw new Error("Unknown action type.")
  }

  return true;
}

//
// Spawn
const spawn = async (userID) => {
  // Check if player already has a monument
  const locationsWithPlayers = await database.ref("locations")
    .orderByChild("player/playerID")
    .equalTo(userID)
    .once("value")
  ;

  if (locationsWithPlayers.numChildren() > 0) {
    throw new Error("Cannot spawn while you are still in the game.");
  }

  // Find a spawn location
  let spawnFound = false;
  let spawnLocation;

  while (!spawnFound) {
    spawnLocation = [
      Math.floor(Math.random() * 20) - 10,
      Math.floor(Math.random() * 20) - 10,
    ];

    const locationTransaction = await database.ref(`locations/${spawnLocation[0]},${spawnLocation[1]}/player`)
      .transaction((player) => {
        if (player === null) {
          return {
            playerID: userID,
            immuneUntil: Date.now() + 60*1000,
            actionType: "spawn",
            actionTurn: 0,
          };
        }
        else {
          return;
        }
      })
    ;

    if (locationTransaction.committed) {
      spawnFound = true;
    }
  }

  // Add spawnLocation to playerSecrets
  await database.ref(`playerSecrets/${userID}`)
    .update({
      location: `${spawnLocation[0]},${spawnLocation[1]}`,
    })
  ;
  return;
};

//
// Self-destruct
const selfDestruct = async (userID) => {
  // Find all player players
  const locationsWithPlayers = await database.ref("locations")
    .orderByChild("player/playerID")
    .equalTo(userID)
    .once("value")
  ;

  // Destroy all player players
  if (locationsWithPlayers.numChildren() > 0) {
    locationsWithPlayers.forEach((locationWithPlayer) => {
      locationWithPlayer.child("player").ref.transaction((player) => {
        if (player) {
          if (player.playerID === userID) {
            return null;
          }
          else {
            return;
          }
        }
        else {
          return null;
        }
      });
    });
  }

  // Remove player location index
  await database.ref(`playerSecrets/${userID}/location`).remove();
  return;
};

//
// Move

const move = async (userID, from, to) => {
  const fromReference = database.ref(`locations/${from[0]},${from[1]}/player`);
  const toReference = database.ref(`locations/${to[0]},${to[1]}/player`);

  // Lock moving player and make sure it can move
  const lockTransaction = await fromReference.transaction((player) => {
    if (player) {
      if (player.playerID === userID && !player.locked) {
        player.locked = true;
        return player;
      }
      else {
        return;
      }
    }
    else {
      return null;
    }
  });

  // If there was no player or the locking didn't work, stop
  let lockedPlayer = lockTransaction.snapshot.val();

  if (!lockedPlayer || !lockTransaction.committed) {
    throw new Error("Failed to start movement");
  }

  // Add moving player to target tile
  lockedPlayer.locked = null;

  const addTransaction = await toReference.transaction((player) => {
    if (player === null) {
      return lockedPlayer;
    }
    else {
      return;
    }
  });

  if (addTransaction.committed) {
    // If that worked, remove moving player from origin tile
    const removeTransaction = await fromReference.transaction((player) => {
      if (player) {
        if (player.playerID === userID) {
          return null;
        }
        else {
          return;
        }
      }
      else {
        return null;
      }
    });
  }
  else {
    // Else remove lock from moving player and stop
    const unlockTransaction = fromReference.transaction((player) => {
      if (player && player.playerID === userID) {
        player.locked = null;
        return player;
      }
      else {
        return null;
      }
    });

    throw new Error("Failed to add player to target tile");
  }

  // On ultimate success, update location index in playerSecrets
  await database.ref(`playerSecrets/${userID}`)
    .update({
      location: `${to[0]},${to[1]}`,
    })
  ;

  return;
};
