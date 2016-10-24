import React, { Component } from "react";
import { Entity } from "aframe-react";

import Lights from "./Lights";

export default class World extends Component {
  render() {
    return (
      <Entity id="world">
        <Lights/>
      </Entity>
    );
  }
}
