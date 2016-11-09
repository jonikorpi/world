import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import "aframe-look-at-billboard-component";
import "aframe-faceset-component";

export default class Tile extends PureComponent {
  constructor(props) {
    super(props);

    this.hasObject = Math.random() < 0.1;
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
    const baseHeight = 0.5;
    const height = (rock + baseHeight) * elevation;
    const rotation = 0;

    const neighbourHeights = Object.keys(neighbours).map((index) => {
      if (neighbours[index]) {
        return (neighbours[index].rock + baseHeight) * elevation;
      }
      else {
        return null;
      }
    });

    const heightN  = this.getCornerHeight(height, neighbourHeights[5], neighbourHeights[0]);
    const heightNE = this.getCornerHeight(height, neighbourHeights[0], neighbourHeights[1]);
    const heightSE = this.getCornerHeight(height, neighbourHeights[1], neighbourHeights[2]);
    const heightS  = this.getCornerHeight(height, neighbourHeights[2], neighbourHeights[3]);
    const heightSW = this.getCornerHeight(height, neighbourHeights[3], neighbourHeights[4]);
    const heightNW = this.getCornerHeight(height, neighbourHeights[4], neighbourHeights[5]);

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
              [0,           height, -hexHeight/4],
              [ hexWidth/4, height, -hexHeight/8],
              [ hexWidth/4, height,  hexHeight/8],
              [0,           height,  hexHeight/4],
              [-hexWidth/4, height,  hexHeight/8],
              [-hexWidth/4, height, -hexHeight/8],

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
            color: this.props.isActive ? `hsl(${100 - rock*15}, 62%, 50%)` : `hsl(${100 - rock*15}, 50%, 38%)`,
            flatShading: true,
          }}
          onStateadded={this.handleStateEvent.bind(this)}
          // onStateremoved={this.handleStateEvent.bind(this)}
        />

        {this.hasObject && (
          <Entity
            geometry={{
              primitive: "box",
              width: hexSize*0.5,
              depth: hexSize*0.5,
              height: hexSize*0.236,
            }}
            material={{
              shader: "standard",
            }}
            position={[
              0,
              height + hexSize*0.236/2,
              0.
            ]}
          />
        )}

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
            position={[0, height + 2, 0]}
            rotation={[0, 0, 0]}
            billboard
          />
        )}

      </Entity>
    );
  }
}
