import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import Unit from "../components/Unit";

export default class Tile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleStateEvent = (event) => {
    const name = event.detail.state;
    const type = event.type;
    let boolean;

    switch (type) {
      case "stateadded":
        boolean = true;
        break;
      case "stateremoved":
        boolean = false;
        break;
      default:
        console.log("Bad state event in Button");
        return;
    }

    if (name && type && this._reactInternalInstance) {
      this.setState({[name]: boolean});
    }
  }

  // componentDidUpdate() {
  //   console.log("Tile updated");
  // }
  //
  // componentWillUnmount() {
  //   console.log("Tile unmounting");
  // }
  //
  // componentDidMount() {
  //   console.log("Tile mounted");
  // }

  handleClick = (event) => {
    console.log(event);
  }

  getCornerHeight(a, b, c) {
    if (a && b && c) {
      return Math.min(a, b, c);
    }
    else {
      return 0;
    }
  }

  distanceBetween(a, b) {
    return (Math.abs(a[0] - b[0]) + Math.abs(a[0] + a[1] - b[0] - b[1]) + Math.abs(a[1] - b[1])) / 2;
  }

  render() {
    const {x, y, tileOwner, tileSize, unit, playerID} = {...this.props};

    const wireframeHue = tileOwner === playerID ? 50 : 355;
    const wireframeSaturation = tileOwner ? 100 : 0;
    const wireframeLightness = this.state["cursor-hovered"] ? 50 : 15;
    const wireframeColor = `hsl(${wireframeHue}, ${wireframeSaturation}%, ${wireframeLightness}%)`;
    const wireframeThickness = this.state["cursor-hovered"] ? 5 : (tileOwner ? 3 : 1);

    // const halfTileSize = tileSize * 0.5;

    // HEXES
    const hexSize = tileSize / 2;
    const hexHeight = hexSize * 2;
    const hexWidth = Math.sqrt(3) / 2 * hexHeight;

    const position = [
      x * hexSize * Math.sqrt(3) * (x + y/2),
      0,
      hexSize * 3/2 * y,
    ];

    // const angleToOrigin = Math.atan2(xPosition, zPosition) * (180/Math.PI);
    // const comparisonLoc = [0,0];
    // const distance = this.distanceBetween(comparisonLoc, [x,y]);
    //
    const elevation = hexSize / 5;
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

    return (
      <Entity
        className="tile"
        position={position}
      >
        {unit && (
          <Unit
            {...this.props}
          />
        )}

        <Entity
          className="interactable"
          events={{
            click: this.handleClick,
            stateadded: this.handleStateEvent,
            stateremoved: this.handleStateEvent,
          }}
          geometry={{
            primitive: "circle",
            segments: 6,
            radius: hexSize * 0.944,
          }}
          material={{
            shader: "flat",
            color: `hsl(${150 - position[0] * 20}, 50%, 50%)`,
            // transparent: true,
            // opacity: 0,
          }}
          rotation={[-90, 90, 0]}
        />
{/*
        <Entity
          position={[
            halfTileSize,
            wireframeThickness * 0.005,
            halfTileSize,
          ]}
          faceset={{
            vertices: [
              [0,           0, -hexHeight/4],
              [ hexWidth/4, 0, -hexHeight/8],
              [ hexWidth/4, 0,  hexHeight/8],
              [0,           0,  hexHeight/4],
              [-hexWidth/4, 0,  hexHeight/8],
              [-hexWidth/4, 0, -hexHeight/8],
          //
          //     [0,           heightN,  -hexHeight/2],
          //     [ hexWidth/2, heightNE, -hexHeight/4],
          //     [ hexWidth/2, heightSE,  hexHeight/4],
          //     [0,           heightS,   hexHeight/2],
          //     [-hexWidth/2, heightSW,  hexHeight/4],
          //     [-hexWidth/2, heightNW, -hexHeight/4],
            ],
          }}
          meshline={{
            lineWidth: wireframeThickness,
            path: `
              0 0 0,
              0 0 ${-tileSize},
              ${-tileSize} 0 ${-tileSize},
              ${-tileSize} 0 0,
              0 0 0
            `,
            color: wireframeColor,
          }}
        /> */}
      </Entity>
    );
  }
}
