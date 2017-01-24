import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";

import Button from "../components/Button";

export default class Player extends PureComponent {
  // componentDidMount() {
  //   const isOwnUnit = this.props.userID === this.props.unit.userID;
  //
  //   this.props.synth.triggerAttackRelease(isOwnUnit ? "C6" : "E6", "8n");
  // }
  //
  // componentWillUnmount() {
  //   const isOwnUnit = this.props.userID === this.props.unit.userID;
  //
  //   this.props.synth.triggerAttackRelease(isOwnUnit ? "C4" : "E4", "4n");
  // }

  moveNorth = () => { console.log("moveNorth"); this.move(this.props.x, this.props.y-1); }
  moveSouth = () => { console.log("moveSouth"); this.move(this.props.x, this.props.y+1); }

  moveNorthWest = () => { console.log("moveNorthWest"); this.move(this.props.x-1, this.props.y); }
  moveSouthEast = () => { console.log("moveSouthEast"); this.move(this.props.x+1, this.props.y); }

  moveNorthEast = () => { console.log("moveNorthEast"); this.move(this.props.x+1, this.props.y-1); }
  moveSouthWest = () => { console.log("moveSouthWest"); this.move(this.props.x-1, this.props.y+1); }


  move = async (x, y) => {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    const response = await fetch("/", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        token: this.props.userToken,
        userID: this.props.userID,
        action: "move",
        from: [this.props.x, this.props.y],
        to: [x, y],
      }),
    });

    if (response.ok) {
      console.log(await response.text());
    }
    else {
      console.log(response);
    }
  }

  render() {
    const {
      x, y,
      userID,
      playerID, locked, immuneUntil, type, turn, emote, action, health, attack,
    } = {...this.props};

    const position = [
      x * hex.size * 3/2,
      0,
      hex.size * Math.sqrt(3) * (y + x/2),
    ];

    const isOwnUnit = userID === playerID;

    return (
      <Entity
        className="unit"
        geometry={{
          primitive: "box",
          width: hex.width * 0.236,
          depth: hex.width * 0.5,
          height: hex.width * 0.236,
        }}
        position={position}
        material={{
          shader: "flat",
          color: isOwnUnit ? "green" : "red",
        }}
      >
        {isOwnUnit &&
          <Entity>
            <Button
              onClick={this.moveNorth}
              color="red"
              position={[0, 1, -hex.width]}
            />
            <Button
              onClick={this.moveSouth}
              color="grey"
              position={[0, 1, hex.width]}
            />

            <Button
              onClick={this.moveNorthWest}
              color="grey"
              position={[-1, 1, -hex.width*0.5]}
            />
            <Button
              onClick={this.moveNorthEast}
              color="grey"
              position={[1, 1, -hex.width*0.5]}
            />

            <Button
              onClick={this.moveSouthWest}
              color="grey"
              position={[-1, 1, hex.width*0.5]}
            />
            <Button
              onClick={this.moveSouthEast}
              color="grey"
              position={[1, 1, hex.width*0.5]}
            />
          </Entity>
        }

      </Entity>
    );
  }
}
