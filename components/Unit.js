import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import Button from "../components/Button";

export default class Unit extends PureComponent {
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
        token: this.props.playerToken,
        playerID: this.props.playerID,
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
    const {tileSize, unit, playerID} = {...this.props};

    const isOwnUnit = playerID === unit.playerID;

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
        {isOwnUnit &&
          <Entity>
            <Button
              onClick={this.moveNorth}
              color="red"
              position={[0, 1, -tileSize]}
            />
            <Button
              onClick={this.moveSouth}
              color="grey"
              position={[0, 1, tileSize]}
            />

            <Button
              onClick={this.moveNorthWest}
              color="grey"
              position={[-1, 1, -tileSize*0.5]}
            />
            <Button
              onClick={this.moveNorthEast}
              color="grey"
              position={[1, 1, -tileSize*0.5]}
            />

            <Button
              onClick={this.moveSouthWest}
              color="grey"
              position={[-1, 1, tileSize*0.5]}
            />
            <Button
              onClick={this.moveSouthEast}
              color="grey"
              position={[1, 1, tileSize*0.5]}
            />
          </Entity>
        }

      </Entity>
    );
  }
}
