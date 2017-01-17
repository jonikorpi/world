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
      console.log(req.method, req.originalUrl, req.body.playerID, req.body.action);
    }
    try {
      await handleRequest(req.body) && res.send("ok");
    } catch (error) {
      console.log(error);
      res.send(error.message);
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
  const playerID = request.playerID;
  const token = request.token;

  const decodedToken = await firebase.auth().verifyIdToken(token);

  if (playerID !== decodedToken.uid) {
    throw new Error("You are not authenticated as this player.")
  }

  const action = request.action;

  switch (action) {
    case "spawn":
      await spawn(playerID);
      break;
    case "self-destruct":
      await selfDestruct(playerID);
      break;
    case "move":
      await move(playerID, request.from, request.to);
      break;
    default:
      throw new Error("Unknown action type.")
  }

  return true;
}

//
// Spawn
const spawn = async (playerID) => {
  // Check if player already has a monument
  const locationsWithUnits = await database.ref("locations")
    .orderByChild("unit/playerID")
    .equalTo(playerID)
    .once("value")
  ;

  if (locationsWithUnits.numChildren() > 0) {
    locationsWithUnits.forEach((location) => {
      if (location.val().unit.type === "monument") {
        throw new Error("Cannot spawn while you have a monument. Destroy it first.");
      }
    });
  }

  // Find a spawn location
  let spawnFound = false;
  let spawnLocation;

  while (!spawnFound) {
    spawnLocation = [
      Math.floor(Math.random() * 20) - 10,
      Math.floor(Math.random() * 20) - 10,
    ];

    const locationTransaction = await database.ref(`locations/${spawnLocation[0]},${spawnLocation[1]}/unit`)
      .transaction((unit) => {
        if (unit === null) {
          return {
            playerID: playerID,
            type: "monument",
            turn: 0,
            immuneUntil: Date.now() + 45*1000,
            action: {
              type: "spawn",
              turn: 0,
            },
            health: {
              originalMax: 30,
              max:         30,
              current:     30,
            },
            attack: {
              original: 0,
              current:  0,
            },
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
  await database.ref(`playerSecrets/${playerID}/locations`)
    .update({
      [`${spawnLocation[0]},${spawnLocation[1]}`]: true
    })
  ;
  return;
};

//
// Self-destruct
const selfDestruct = async (playerID) => {
  // Find all player units
  const locationsWithUnits = await database.ref("locations")
    .orderByChild("unit/playerID")
    .equalTo(playerID)
    .once("value")
  ;

  // Destroy all player units
  if (locationsWithUnits.numChildren() > 0) {
    locationsWithUnits.forEach((locationWithUnit) => {
      locationWithUnit.child("unit").ref.transaction((unit) => {
        if (unit) {
          if (unit.playerID === playerID) {
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

  // Remove all unit location indexes
  await database.ref(`playerSecrets/${playerID}/locations`).remove();
  return;
};

//
// Move

const move = async (playerID, from, to) => {
  const fromReference = database.ref(`locations/${from[0]},${from[1]}/unit`);
  const toReference = database.ref(`locations/${to[0]},${to[1]}/unit`);

  // Lock moving unit and make sure it can move
  const lockTransaction = await fromReference.transaction((unit) => {
    if (unit && unit.playerID === playerID && !unit.moving) {
      unit.locked = true;
      return unit;
    }
    else {
      return null;
    }
  });

  // If that didn't work, stop
  let lockedUnit = lockTransaction.snapshot.val();

  if (!lockedUnit) {
    throw new Error("Failed to start movement");
  }

  // Add moving unit to target tile
  lockedUnit.locked = null;

  const addTransaction = await toReference.transaction((unit) => {
    if (unit === null) {
      return lockedUnit;
    }
    else {
      return;
    }
  });

  if (addTransaction.committed) {
    // If that worked, remove moving unit from origin tile
    const removeTransaction = await fromReference.transaction((unit) => {
      if (unit) {
        if (unit.playerID === playerID) {
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
    // Else remove lock from moving unit and stop
    const unlockTransaction = fromReference.transaction((unit) => {
      if (unit && unit.playerID === playerID) {
        unit.locked = null;
        return unit;
      }
      else {
        return null;
      }
    });

    throw new Error("Failed to add unit to target tile");
  }

  // On ultimate success, update location index in playerSecrets
  const indexUpdates = {
    [`playerSecrets/${playerID}/locations/${from[0]},${from[1]}`]: null,
    [`playerSecrets/${playerID}/locations/${to[0]},${to[1]}`]: true,
  };

  await database.ref().update(indexUpdates);

  return;
};
