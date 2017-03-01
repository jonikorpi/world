const Vector = require("matter-js").Vector;

let maths = {
  shouldAccelerate: (stopWithin, targetVector, positionVector) => {
    const xDistance = Math.abs(targetVector.x - positionVector.x);
    const yDistance = Math.abs(targetVector.y - positionVector.y);

    const shouldIt = targetVector.x && targetVector.y && (xDistance > stopWithin || yDistance > stopWithin);

    return shouldIt;
  },

  clampSpeed: (forceVector, magnitudeLimit) => {
    const speed = Vector.magnitude(forceVector);

    if (speed > magnitudeLimit) {
      forceVector = Vector.div(forceVector, speed / magnitudeLimit);
    }

    return forceVector;
  },

  distanceBetween: (x, y, x2, y2, squared) => {
    const result = Math.pow(x - x2, 2) + Math.pow(y - y2, 2);

    return squared ? result : Math.sqrt(result);
  },
};

module.exports = maths;
