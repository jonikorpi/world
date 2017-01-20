const size = 0.5;
const height = size * 2;
const width = Math.sqrt(3) / 2 * height;

let hex = {
  width: width,
  size: size,
  height: height,
};

hex.hexToCube = (hexID) => {
  const hex = hexID.split(",");
  const x = hex[0];
  const z = hex[1];
  const y = -x-z;

  return [x,y,z];
};

hex.listNeighbouringTiles = (locationID, range = 1) => {
  const centerX = +locationID.split(",")[0];
  const centerY = +locationID.split(",")[1];
  let neighbours = [];

  for ( let x = -range ; x <= range ; x++ ) {
    for ( let y = Math.max(-range, -x-range) ; y <= Math.min(range, -x+range) ; y++ ) {
      neighbours.push(`${centerX + x},${centerY + y}`);
    }
  }

  neighbours.splice(neighbours.indexOf(locationID), 1);

  return neighbours;
};

hex.distanceBetween = (aID, bID) => {
  const a = hex.hexToCube(aID);
  const b = hex.hexToCube(bID);

  return (
    Math.max(
      Math.abs(a[0] - b[0]),
      Math.abs(a[1] - b[1]),
      Math.abs(a[2] - b[2]),
    )
  );
};

export default hex;
