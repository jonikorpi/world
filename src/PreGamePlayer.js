import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import Button from "./Button";

export default class PreGamePlayer extends PureComponent {
  removePlayer() {
    this.props.removePlayer(this.props.playerID);
  }

  render() {
    const direction = this.props.teamID === "1" ? -1 : 1;

    return (
      <Entity
        position={[0.75 * this.props.index * direction, -0.25, 0.5]}
        geometry={{
          primitive: "box",
          height: 0.25,
          width: 0.25,
          depth: 0.25,
        }}
      >
        {this.props.removable && (
          <Button
            onClick={this.removePlayer.bind(this)}
            text={this.props.isSelf ? "Leave" : "Kick"}
            position={[0, 0.375, 0]}
          />
        )}

        {this.props.children}
      </Entity>
    );
  }
}
