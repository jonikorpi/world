import { Vector } from "matter-js";

let movement = {
  shouldAccelerate: (stopWithin, targetVector, positionVector) => {
    const xDistance = Math.abs(targetVector.x - positionVector.x);
    const yDistance = Math.abs(targetVector.y - positionVector.y);

    const shouldIt = (
      targetVector.x && targetVector.y
      && (
        xDistance > stopWithin || yDistance > stopWithin
      )
    );

    return shouldIt;
  },

  clampSpeed: (forceVector, magnitudeLimit) => {
    const speed = Vector.magnitude(forceVector);

    if (speed > magnitudeLimit) {
      forceVector = Vector.div(forceVector, speed / magnitudeLimit);
    }

    return forceVector;
  },
};

export default movement;
