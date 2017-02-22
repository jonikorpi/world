const firebase = require("firebase-admin");
const database = firebase.database();

const maths = require("../helpers/maths.js");

let actions = {};

//
// Spawn
actions.spawn = async userID => {
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
        meleeRange: 4,
        rangedRange: 9,
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
actions.selfDestruct = async userID => {
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
// Attacks
actions.attack = async (userID, request, rangeType, damageModifier) => {
  const attackerFetch = await database.ref(`players/${userID}`).once("value");
  const attacker = attackerFetch.val();

  const attackTransaction = await database.ref(`players/${request.playerID}`).transaction((player) => {
    if (player === null) {
      return null;
    }

    if (
      maths.distanceBetween(
        attacker.position.x, attacker.position.y,
        player.position.x, player.position.y
      )
      >
      attacker.state[rangeType]
    ) {
      return;
    }
    else {
      player.state.health -= 1 * damageModifier;
      return player;
    }
  });

  if (!attackTransaction.snapshot.val() || !attackTransaction.committed) {
    throw new Error("Failed to attack");
  }

  return;
}

actions.meleeAttack = async (userID, request) => {
  await actions.attack(userID, request, "meleeRange", 2);
  return;
}

actions.rangedAttack = async (userID, request) => {
  await actions.attack(userID, request, "rangedRange", 1);
  return;
}

//
// Move

// actions.move = async (userID, to) => {
//   if (typeof to[0] !== "number" || typeof to[1] !== "number") {
//     throw new Error(`Invalid movement coordinates: ${to[0]},${to[1]}`);
//   }

//   const playerReference = database.ref(`heroes/${userID}`);
//   let from;

//   // Lock moving player
//   // TODO: make sure the player can move and remove resources
//   const lockTransaction = await playerReference.transaction(player => {
//     if (player) {
//       if (!player.locked) {
//         player.locked = true;
//         player.lastActed = Date.now();
//         from = [player.x, player.y];
//         return player;
//       } else {
//         return;
//       }
//     } else {
//       return null;
//     }
//   });

//   // If there was no player or the locking didn't work, stop
//   const lockedHero = lockTransaction.snapshot.val();

//   if (!lockedHero || !lockTransaction.committed) {
//     throw new Error("Failed to start movement");
//   }

//   // Add moving player to target tile
//   const fromReference = database.ref(`locations/${from[0]},${from[1]}/playerID`);
//   const toReference = database.ref(`locations/${to[0]},${to[1]}/playerID`);

//   const addTransaction = await toReference.transaction(playerID => {
//     if (playerID === null) {
//       return userID;
//     } else {
//       return;
//     }
//   });

//   if (addTransaction.committed) {
//     // If that worked, remove moving player from origin tile
//     fromReference.transaction(playerID => {
//       if (playerID === null) {
//         return null;
//       } else {
//         if (playerID === userID) {
//           return null;
//         } else {
//           return;
//         }
//       }
//     });
//   } else {
//     // Else remove lock from the player and stop
//     // TODO: refund resources
//     await playerReference.transaction(player => {
//       if (player) {
//         player.locked = null;
//         return player;
//       } else {
//         return null;
//       }
//     });

//     throw new Error("Failed to add player to target tile");
//   }

//   // On ultimate success, update the player
//   await playerReference.transaction(player => {
//     if (player) {
//       player.x = to[0];
//       player.y = to[1];
//       player.locked = null;
//       return player;
//     } else {
//       return null;
//     }
//   });

//   return;
// };

module.exports = actions;
