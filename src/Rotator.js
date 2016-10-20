import React, { PureComponent } from "react";
import {Entity} from "aframe-react";

import constants from "./constants";

export default class Rotator extends PureComponent {
  render() {
    return (
      <Entity
        class="rotator"
        rotation={this.props.rotation || [0,0,0]}
      >

        <Entity
          class="locator"
          position={[
            0,
            0,
            -this.props.distance || -constants.UIRadius,
          ]}
        >

          {this.props.children}

        </Entity>

      </Entity>
    );
  }

}
