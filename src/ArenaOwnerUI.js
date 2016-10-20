import React, { PureComponent } from "react";
// import { Entity } from "aframe-react";

import Button from "./Button";
import Rotator from "./Rotator";

export default class ArenaOwnerUI extends PureComponent {
  render() {
    return (
      <Rotator rotation={[15, 0, 0]}>
        {!this.props.hasGame && (
          <Button onClick={this.props.createGame} text="Open a game"/>
        )}
      </Rotator>
    );
  }
}
