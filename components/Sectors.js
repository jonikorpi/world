import React, { PureComponent } from "react";

import Sector from "../components/Sector";

const getAdjascentSectorIDs = (centerX, centerY) => {
  let sectorIDs = [`${centerX},${centerY}`];

  for   (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      sectorIDs.push(`${centerX + x},${centerY + y}`);
    }
  }

  return sectorIDs;
};

export default class Sectors extends PureComponent {
  render() {
    const [sectorX, sectorY] = this.props.sectorID.split(",");
    const sectorIDs = getAdjascentSectorIDs(+sectorX, +sectorY);

    return (
      <div id="sectors">
        {sectorIDs.map((sectorID) => {
          return (
            <Sector
              key={sectorID}
              sectorID={sectorID}
              userID={this.props.userID}
              userToken={this.props.userToken}
            />
          )
        })}
      </div>
    );
  }
}
