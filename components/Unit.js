import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import firebase from "firebase";

import Button from "../components/Button";

export default class Unit extends PureComponent {
  moveNorth = () => { this.move(this.props.x,   this.props.y-1); }
  moveWest  = () => { this.move(this.props.x-1, this.props.y); }
  moveEast  = () => { this.move(this.props.x+1, this.props.y); }
  moveSouth = () => { this.move(this.props.x,   this.props.y+1); }

  move = (x, y) => {
    firebase.database().ref("actionQueue/tasks").push({
      request: {
        playerID: this.props.playerID,
        action: "move",
        origin: {
          x: this.props.x,
          y: this.props.y,
        },
        target: {
          x: x,
          y: y,
        },
        time: firebase.database.ServerValue.TIMESTAMP,
      }
    });
  }

  render() {
    const {x, y, tileOwner, isActive, tileSize, unit} = {...this.props};
    const {entityOwner, entityType, entityLastX, entityLastY, entityLastTurn} = {...this.props};

    return (
      <Entity
        className="unit"
        geometry={{
          primitive: "box",
          width: tileSize * 0.382,
          depth: tileSize * 0.382,
          height: tileSize * 0.618,
        }}
        position={[
          0,
          tileSize * 0.618 * 0.5,
          0,
        ]}
      >

        {/* <Button
          onClick={this.moveNorth}
          color="red"
          position={[0, 1, -tileSize]}
        />
        <Button
          onClick={this.moveWest}
          color="grey"
          position={[-tileSize, 1, 0]}
        />
        <Button
          onClick={this.moveEast}
          color="grey"
          position={[tileSize, 1, 0]}
        />
        <Button
          onClick={this.moveSouth}
          color="grey"
          position={[0, 1, tileSize]}
        /> */}

      </Entity>
    );
  }
}
