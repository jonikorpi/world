import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import "aframe-look-at-billboard-component";
import "aframe-faceset-component";

export default class Tile extends PureComponent {
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {};
  // }

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
      // this.props.setActiveTileID(this.props.x, this.props.y);
    }
  }

  render() {
    const {x, y, rock, water, flora, heat, neighbours} = this.props;

    const hexSize = 0.618;
    const hexHeight = hexSize * 2;
    const hexWidth = Math.sqrt(3) / 2 * hexHeight;
    const xPosition = hexSize * Math.sqrt(3) * (x + y/2);
    const zPosition = hexSize * 3/2 * y;

    const comparisonLoc = [0, 0];
    const distance = (Math.abs(comparisonLoc[0] - x) + Math.abs(comparisonLoc[0] + comparisonLoc[1] - x - y) + Math.abs(comparisonLoc[1] - y)) / 2;

    const elevation = hexSize / 4;
    const height = rock * elevation;
    const rotation = 0;

    const neighbourHeights = Object.keys(neighbours).map((index) => {
      if (neighbours[index]) {
        return neighbours[index].rock * elevation;
      }
      else {
        return 0;
      }
    });

    const heightN  = (height + neighbourHeights[5] + neighbourHeights[0]) / 3;
    const heightNE = (height + neighbourHeights[0] + neighbourHeights[1]) / 3;
    const heightSE = (height + neighbourHeights[1] + neighbourHeights[2]) / 3;
    const heightS  = (height + neighbourHeights[2] + neighbourHeights[3]) / 3;
    const heightSW = (height + neighbourHeights[3] + neighbourHeights[4]) / 3;
    const heightNW = (height + neighbourHeights[4] + neighbourHeights[5]) / 3;

    return (
      <Entity
        id={`x${x}y${y}`}
        className="tile"
        position={[
          xPosition,
          0,
          zPosition,
        ]}
      >

        <Entity
          className="interactable"
          faceset={{
            vertices: [
              [0, height, 0],

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
            color: this.props.isActive ? "rgb(209, 205, 167)" : `hsl(${100 - rock*15}, 50%, 38%)`,
            flatShading: true,
            side: "double",
          }}
          // onStateadded={this.handleStateEvent.bind(this)}
          // onStateremoved={this.handleStateEvent.bind(this)}
        />

        {/* {Math.random() < 0.2 && (
          <Entity
            geometry={{
              primitive: "box",
              width: hexSize*0.5,
              depth: hexSize*0.5,
              height: hexSize*0.5,
            }}
            material={{
              shader: "standard",
            }}
            position={[
              0,
              height + hexSize*0.25,
              0.
            ]}
          />
        )} */}

        {this.props.isActive && (
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
            position={[0, 1, 0]}
            rotation={[0, 0, 0]}
            billboard
          />
        )}

      </Entity>
    );
  }
}
