import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";

import Action from "../components/Action";

export default class Tile extends PureComponent {
  getCornerHeight(a, b, c) {
    if (a && b && c) {
      return Math.min(a, b, c);
    }
    else {
      return 0;
    }
  }

  render() {
    const { x, y, visible } = {...this.props};

    const position = [
      x * hex.size * 3/2,
      0,
      hex.size * Math.sqrt(3) * (y + x/2),
    ];

    return (
      <Entity position={position}>
        <Entity
          // geometry={{
          //   primitive: "circle",
          //   segments: 6,
          //   radius: hex.size,
          //   // buffer: false,
          //   // skipCache: true,
          //   // mergeTo: "#tile1",
          // }}
          // material={{
          //   shader: "flat",
          //   color: `hsl(0, 0%, ${visible ? 50 : 33}%)`,
          //   // transparent: true,
          //   // opacity: 0,
          // }}
          rotation={[-90, 0, 0]}
          // position={position}
        />

        <Action
          data={{
            action: "move",
            to: [x, y],
          }}
          {...this.props}
        />
      </Entity>
    );

    // const angleToOrigin = Math.atan2(xPosition, zPosition) * (180/Math.PI);
    // const comparisonLoc = [0,0];
    // const distance = this.distanceBetween(comparisonLoc, [x,y]);
    //
    // const elevation = hex.size / 5;
    // const baseHeight = 0.5;
    // const height = (rock + baseHeight) * elevation + (distance > wallEdge ? ((distance - wallEdge) * distanceElevation) : 0);

    // let bordersWater = false;
    // const neighbourHeights = Object.keys(neighbours).map((index) => {
    //   if (neighbours[index] && neighbours[index].attributes) {
    //     const thisDistance = this.distanceBetween(comparisonLoc, [neighbours[index].loc.x, neighbours[index].loc.y]);
    //
    //     return (
    //       (neighbours[index].attributes.rock + baseHeight) * elevation
    //       + thisDistance > wallEdge ? ((thisDistance - wallEdge) * distanceElevation) : 0
    //     );
    //   }
    //   else {
    //     bordersWater = true;
    //     return 0;
    //   }
    // });
    //
    // const heightN  = this.getCornerHeight(height, neighbourHeights[5], neighbourHeights[0]);
    // const heightNE = this.getCornerHeight(height, neighbourHeights[0], neighbourHeights[1]);
    // const heightSE = this.getCornerHeight(height, neighbourHeights[1], neighbourHeights[2]);
    // const heightS  = this.getCornerHeight(height, neighbourHeights[2], neighbourHeights[3]);
    // const heightSW = this.getCornerHeight(height, neighbourHeights[3], neighbourHeights[4]);
    // const heightNW = this.getCornerHeight(height, neighbourHeights[4], neighbourHeights[5]);

    // return (
    //   <Entity
    //     className="tile"
    //     position={position}
    //   >
    //     <Entity
    //       position={[
    //         halfhex.width,
    //         wireframeThickness * 0.005,
    //         halfhex.width,
    //       ]}
    //       faceset={{
    //         vertices: [
    //           [0,           0, -hex.height/4],
    //           [ hex.width/4, 0, -hex.height/8],
    //           [ hex.width/4, 0,  hex.height/8],
    //           [0,           0,  hex.height/4],
    //           [-hex.width/4, 0,  hex.height/8],
    //           [-hex.width/4, 0, -hex.height/8],
    //       //
    //       //     [0,           heightN,  -hex.height/2],
    //       //     [ hex.width/2, heightNE, -hex.height/4],
    //       //     [ hex.width/2, heightSE,  hex.height/4],
    //       //     [0,           heightS,   hex.height/2],
    //       //     [-hex.width/2, heightSW,  hex.height/4],
    //       //     [-hex.width/2, heightNW, -hex.height/4],
    //         ],
    //       }}
    //       meshline={{
    //         lineWidth: wireframeThickness,
    //         path: `
    //           0 0 0,
    //           0 0 ${-hex.width},
    //           ${-hex.width} 0 ${-hex.width},
    //           ${-hex.width} 0 0,
    //           0 0 0
    //         `,
    //         color: wireframeColor,
    //       }}
    //     />
    //   </Entity>
    // );
  }
}
