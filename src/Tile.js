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

    const size = 0.5;
    const height = size * 2;
    const width = Math.sqrt(3) / 2 * height;
    const xPosition = size * Math.sqrt(3) * (x + y/2);
    const zPosition = size * 3/2 * y;

    const comparisonLoc = [0, 0];
    const distance = (Math.abs(comparisonLoc[0] - x) + Math.abs(comparisonLoc[0] + comparisonLoc[1] - x - y) + Math.abs(comparisonLoc[1] - y)) / 2;

    const elevation = size / 5;
    const yPosition = (rock) * elevation; //distance * size / 13;
    const rotation = 0; //distance / 16;

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

        {/* {Object.keys(neighbours).map((index) => {
          const coneHeight = width/2;

          return (

          );
        })} */}

        <Entity key={null} rotation={[0, 0, 0]}>
          <Entity
            className="interactable"
            faceset={{
              vertices: [
                [0, 0, -height/2],
                [ width/2, 0, -height/4],
                [ width/2, 0,  height/4],
                [0, 0,  height/2],
                [-width/2, 0,  height/4],
                [-width/2, 0, -height/4],
                [0, yPosition, 0],
              ],
            }}
            position={[
              0,
              0.5,
              0,
            ]}
            material={{
              color: this.props.isActive ? "rgb(209, 205, 167)" : `hsl(${distance*8}, 50%, 38%)`,
              flatShading: true,
            }}
            // onStateadded={this.handleStateEvent.bind(this)}
            // onStateremoved={this.handleStateEvent.bind(this)}
          />
        </Entity>

        {/* {Math.random() < 0.2 && (
          <Entity
            geometry={{
              primitive: "box",
              width: size*0.5,
              depth: size*0.5,
              height: size*0.5,
            }}
            material={{
              shader: "standard",
            }}
            position={[
              0,
              yPosition + size*0.25,
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
