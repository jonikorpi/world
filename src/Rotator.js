import React, { PureComponent } from "react";
import {Entity} from "aframe-react";

export default class Rotator extends PureComponent {
  render() {
    return (
      <Entity
        className="rotator"
        rotation={this.props.rotation || [0,0,0]}
      >

        <Entity
          className="locator"
          position={[
            0,
            0,
            -this.props.distance,
          ]}
        >

          {this.props.children}

        </Entity>

      </Entity>
    );
  }

}
