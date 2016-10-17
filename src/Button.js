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
        geometry={{
          primitive: "circle",
          radius: 0.3,
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
