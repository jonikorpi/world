import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import "aframe-look-at-billboard-component";
import "aframe-faceset-component";
// import { Motion, spring } from "react-motion";
// import { ReactMotionLoop } from "react-motion-loop";

export default class Tile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      x: this.props.x,
      y: this.props.y,
      rock: this.props.rock,
      water: this.props.water,
      flora: this.props.flora,
      heat: this.props.heat,
      neighbours: this.props.neighbours,
      object: Math.random() < 0.1,
    };
  }

  handleStateEvent(event) {
    const name = event.detail.state;
    const type = event.type;
    // let boolean;
    //
    // switch (type) {
    //   case "stateadded":
    //     boolean = true;
    //     break;
    //   case "stateremoved":
    //     boolean = false;
    //     break;
    //   default:
    //     console.log("Bad state event in Button");
    //     return;
    // }
    //
    // if (name && type && this._reactInternalInstance) {
    //   this.setState({[name]: boolean});
    // }

    if (!this.props.isActive && type === "stateadded" && name === "cursor-hovered") {
      this.props.setActiveTileID(this.props.x, this.props.y);
    }
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
    const { x, y, rock, water, flora, heat, neighbours, object } = this.state;
    const { isActive } = this.props;

    const hexSize = 0.764;
    const hexHeight = hexSize * 2;
    const hexWidth = Math.sqrt(3) / 2 * hexHeight;
    const xPosition = hexSize * Math.sqrt(3) * (x + y/2);
    const zPosition = hexSize * 3/2 * y;

    const angleToOrigin = Math.atan2(xPosition, zPosition) * (180/Math.PI);

    const comparisonLoc = [0,0];
    const distance = this.distanceBetween(comparisonLoc, [x,y]);

    const elevation = hexSize / 5;
    const wallEdge = 5;
    const distanceElevation = hexSize / 3;

    // const distanceRotation = distance > distanceFalloff ? 90 : 0;
    // const distanceElevation = distance > distanceFalloff ? Math.sin(distanceRotation) * hexWidth/4 : 0;

    const baseHeight = 0.5;
    const height = (rock + baseHeight) * elevation + (distance > wallEdge ? ((distance - wallEdge) * distanceElevation) : 0);
    const pedestalHeight = height;//isActive ? (rock + baseHeight*6) * elevation * distance : height;
    let bordersWater = false;
    // const waveConfig = {stiffness: 2+(rock/5), damping: 1+(water/10), precision: 0.001};

    const neighbourHeights = Object.keys(neighbours).map((index) => {
      if (neighbours[index] && neighbours[index].attributes) {
        const thisDistance = this.distanceBetween(comparisonLoc, [neighbours[index].loc.x, neighbours[index].loc.y]);

        return (
          (neighbours[index].attributes.rock + baseHeight) * elevation
          + thisDistance > wallEdge ? ((thisDistance - wallEdge) * distanceElevation) : 0
        );
      }
      else {
        bordersWater = true;
        return 0;
      }
    });

    const heightN  = this.getCornerHeight(height, neighbourHeights[5], neighbourHeights[0]);
    const heightNE = this.getCornerHeight(height, neighbourHeights[0], neighbourHeights[1]);
    const heightSE = this.getCornerHeight(height, neighbourHeights[1], neighbourHeights[2]);
    const heightS  = this.getCornerHeight(height, neighbourHeights[2], neighbourHeights[3]);
    const heightSW = this.getCornerHeight(height, neighbourHeights[3], neighbourHeights[4]);
    const heightNW = this.getCornerHeight(height, neighbourHeights[4], neighbourHeights[5]);

    return (
      // <Motion style={{
      //   pedestalHeight: spring(pedestalHeight),
      // }}>{interpolation =>
        <Entity
          id={`x${x}y${y}`}
          className="tile"
          position={[
            xPosition,
            0,
            zPosition,
          ]}
          rotation={[
            0,
            angleToOrigin,
            0
          ]}
        >
          <Entity rotation={[0, -angleToOrigin, 0]}>
            <Entity
              className="interactable"
              faceset={{
                vertices: [
                  [0,           pedestalHeight, -hexHeight/4],
                  [ hexWidth/4, pedestalHeight, -hexHeight/8],
                  [ hexWidth/4, pedestalHeight,  hexHeight/8],
                  [0,           pedestalHeight,  hexHeight/4],
                  [-hexWidth/4, pedestalHeight,  hexHeight/8],
                  [-hexWidth/4, pedestalHeight, -hexHeight/8],

                  [0,           heightN,  -hexHeight/2],
                  [ hexWidth/2, heightNE, -hexHeight/4],
                  [ hexWidth/2, heightSE,  hexHeight/4],
                  [0,           heightS,   hexHeight/2],
                  [-hexWidth/2, heightSW,  hexHeight/4],
                  [-hexWidth/2, heightNW, -hexHeight/4],
                ],
              }}
              position={[
                0,
                0,
                0,
              ]}
              material={{
                color: isActive ? `hsl(${100 - rock*15}, 62%, 50%)` : `hsl(${100 - rock*15}, 50%, 38%)`,
                flatShading: true,
                roughness: 10 + rock/4,
                metalness: 0,
                // side: "double",
              }}
              onStateadded={this.handleStateEvent.bind(this)}
              // onStateremoved={this.handleStateEvent.bind(this)}
            />

            {bordersWater && (
              // <ReactMotionLoop
              //   styleFrom={{radius: spring(hexWidth / 1.70,              waveConfig)}}
              //     styleTo={{radius: spring(hexWidth / (1.65 - water/80), waveConfig)}}
              // >{interpolation =>
                <Entity
                  className="water-line"
                  geometry={{
                    primitive: "circle",
                    radius: hexWidth / 1.66,
                    segments: 6,
                  }}
                  material={{
                    shader: "flat",
                    color: "white",
                  }}
                  rotation={[
                    -90,
                    30,
                    0,
                  ]}
                />
              // }</ReactMotionLoop>
            )}

            {object && (
              <Entity
                geometry={{
                  primitive: "box",
                  width: hexSize*0.5,
                  depth: hexSize*0.5,
                  height: hexSize*0.236,
                }}
                material={{
                  color: `hsl(${230 - heat*30}, 38%, 50%)`,
                  flatShading: true,
                  roughness: 0.236,
                  metalness: 0.618,
                }}
                position={[
                  0,
                  pedestalHeight + hexSize*0.236/2,
                  0.
                ]}
                rotation={[0, 0, 0]}
              />
            )}

            {/* {isActive && (
              <Entity
                className="interactable"
                geometry={{
                  primitive: "plane",
                  width: "1",
                  height: "1",
                }}
                material={{
                  shader: "flat",
                  color: "white",
                }}
                position={[0, height + 2, 0]}
                rotation={[0, 0, 0]}
                billboard
              />
            )} */}
          </Entity>
        </Entity>
      // }</Motion>
    );
  }
}
