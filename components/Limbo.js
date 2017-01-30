import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

// import hex from "../helpers/hex";

import Action from "../components/Action";

export default class Limbo extends PureComponent {
  render() {
    return (
      <Entity className="limbo">
        <Action
          {...this.props}
          data={{
            type: "spawn"
          }}
        />
      </Entity>
    );
  }
}
