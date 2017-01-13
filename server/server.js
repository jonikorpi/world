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

// //
// // Task processing
//
// const prepareRequest = function(data, progress, resolve, reject) {
//   try {
//     if (data.request) {
//       console.log("Processing", data.request);
//       processRequest(data.request, progress, resolve, reject);
//     }
//     else {
//       console.log("Rejecting", data.request.action, "for", data.request.playerID);
//       reject("Missing request");
//     }
//   }
//   catch (error) {
//     console.log(error);
//   }
// }
//
// const processRequest = async function(request, progress, resolve, reject) {
//   let updates = {};
//
//   switch (request.action) {
//
//     // Spawn
//     case "spawn":
//       const player = await fetchPlayer(request.playerID);
//
//       // Make sure player hasn't spawned yet
//       if (player) {
//         error("Player has already spawned", request.playerID, updates, reject);
//         break;
//       }
//
//       // Find an empty island
//       let spawnFound = false;
//       let spawnLocation;
//
//       while (!spawnFound) {
//         spawnLocation = [
//           Math.floor(Math.random() * 20) - 10,
//           Math.floor(Math.random() * 20) - 10,
//         ];
//
//         if (await !fetchLocation(spawnLocation[0], spawnLocation[1]).units) {
//           spawnFound = true;
//         }
//       }
//
//       const location = `locations/${spawnLocation[0]},${spawnLocation[1]}`;
//       const unitKey = database.ref().push().key;
//
//       // Update player index
//       updates[`playerSecrets/${request.playerID}/locations/${spawnLocation[0]},${spawnLocation[1]}`] = true;
//       updates[`playerSecrets/${request.playerID}/message`] = "Successfully spawned";
//
//       // Add unit
//       updates[`${location}/units/${unitKey}`] = {
//         "x": 0,
//         "y": 0,
//         "playerID": request.playerID,
//         "type": "tower",
//         "actions": "1",
//         "action": "spawn",
//         "actionTime": Date.now(),
//         "emote": null,
//         "health": 30,
//         "orientation": 0,
//         "attack": "2 2 2 2 2 2",
//       };
//
//       // Level tile
//       updates[`${location}/tiles/0,0`] = {
//         rock: 1,
//       };
//
//       break;
//
//     // Move
//     case "move":
//       // //
//       // // Preliminary checks
//       //
//       // // Is the distance short enough?
//       // const distance = distanceBetween([request.origin.x, request.origin.y], [request.target.x, request.target.y]);
//       //
//       // if (distance > 1.5) {
//       //   error("Distance too great", request.playerID, updates, reject);
//       //   break;
//       // }
//       //
//       // //
//       // // Check origin and target
//       //
//       // const [origin, target] = await Promise.all([
//       //   fetchLocation(request.origin.x, request.origin.y),
//       //   fetchLocation(request.target.x, request.target.y)
//       // ]);
//       //
//       //
//       // // Does origin contain your unit?
//       // if (origin.unitOwner !== request.playerID) {
//       //   error("Can't move units you don't own", request.playerID, updates, reject);
//       //   break;
//       // }
//       //
//       // //
//       // // Try to perform the action on target
//       //
//       // const target = referenceLocation(request.target.x, request.target.y);
//       // let oldTargetValue;
//       //
//       // let targetTransaction = await target.transaction(async function(targetValue) {
//       //   // Save first target value
//       //   if (!oldTargetValue) {
//       //     oldTargetValue = targetValue;
//       //   }
//       //
//       //   // Is target occupied?
//       //   if (targetValue.unit) {
//       //     error("Can't move onto another unit", request.playerID, updates, reject);
//       //     return;
//       //   }
//       //
//       //   else {
//       //     targetValue.tileOwner = request.playerID;
//       //     targetValue.unit = fetchedOrigin.unit;
//       //     targetValue.unitOwner = fetchedOrigin.unitOwner;
//       //     targetValue.unitLastX = request.origin.x;
//       //     targetValue.unitLastY = request.origin.y;
//       //     targetValue.unitLastTurn = fetchedOrigin.unitLastTurn;
//       //     targetValue.unitLastAction = "move";
//       //
//       //     return targetValue;
//       //   }
//       // });
//       //
//       // if (!targetTransaction.committed) {
//       //   error("Action on the target failed", request.playerID, updates, reject);
//       //   break;
//       // }
//       //
//       // //
//       // // Try to inflict the consequences on origin
//       //
//       // const origin = referenceLocation(request.origin.x, request.origin.y);
//       // const newTargetValue = targetTransaction.snapshot;
//       //
//       // let originTransaction = await origin.transaction((originValue) => {
//       //   originValue.unit = null;
//       //   originValue.unitOwner = null;
//       //   originValue.unitLastX = null;
//       //   originValue.unitLastY = null;
//       //   originValue.unitLastTurn = null;
//       //   originValue.unitLastAction = null;
//       //
//       //   return originValue;
//       // });
//       //
//       // //
//       // // Update indexes
//       //
//       // updates[`playerSecrets/${request.playerID}/locations/x:${request.target.x},y:${request.target.y}`] = true;
//       //
//       // if (oldTargetValue.tileOwner) {
//       //   updates[`playerSecrets/${target.tileOwner}/locations/x:${request.target.x},y:${request.target.y}`] = null;
//       // }
//
//       break;
//
//     // Reject
//     default:
//       error("Unknown action", request.playerID, updates, reject);
//   }
//
//   if (Object.keys(updates).length > 0) {
//     return database.ref().update(updates).then(resolve).catch(reject);
//   }
//
//   console.log("Successfully processed in", Date.now() - request.time);
// }
