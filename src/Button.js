import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
import { Entity } from "aframe-react";

export default class Button extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <Entity
        className="button"
        onClick={this.props.onClick}
        position={this.props.position || [0,0,0]}
        geometry={{
          primitive: "circle",
          radius: 0.15,
          segments: 6,
        }}
        material={{
          shader: "flat",
          color: this.props.color || "grey",
        }}
      >
        {this.props.children}
      </Entity>
    );
  }
}
