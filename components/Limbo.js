import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

// import hex from "../helpers/hex";

import Action from "../components/Action";

export default class Limbo extends PureComponent {
  render() {
    const { userHeight, groundLevel } = {...this.props};

    return (
      <Entity className="limbo" position={[-2.5, userHeight + groundLevel, -4]}>
        <Action
          {...this.props}
          data={{
            action: "spawn"
          }}
        />
      </Entity>
    );
  }
}
