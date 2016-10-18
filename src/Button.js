import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
import { Entity } from "aframe-react";
import "aframe-bmfont-text-component";

export default class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleStateAdded(event) {
    const name = event.detail.state;

    if (name) {
      this.setState({[name]: true});
    }
  }

  handleStateRemoved(event) {
    const name = event.detail.state;

    if (name) {
      this.setState({[name]: false});
    }
  }

  render() {
    const baseLineHeight = 0.12;
    const textSizeMultiplier = 200;

    const padding = this.props.padding || 0.1;
    const lineHeight = this.props.lineHeight ? this.props.lineHeight * baseLineHeight : baseLineHeight;

    const width = (this.props.width || 1.25) + padding*2;
    const height = lineHeight + padding*2;
    const color = this.props.color || "grey";
    const scale = this.props.scale || 0.5;

    const currentColor = this.state["cursor-hovered"] ? "black" : color;

    return (
      <Entity
        className="button clickable"
        onClick={this.props.onClick}
        onStateadded={this.handleStateAdded.bind(this)}
        onStateremoved={this.handleStateRemoved.bind(this)}
        position={this.props.position || [0,0,0]}
        geometry={{
          primitive: "plane",
          width: width,
          height: height,
        }}
        scale={[scale, scale, scale]}
        material={{
          shader: "flat",
          color: currentColor,
        }}
      >

        <Entity
          className="button-text"
          position={[width * -0.5, lineHeight * -0.5, 0.01]}
          onStateadded={this.handleStateAdded.bind(this)}
          onStateremoved={this.handleStateRemoved.bind(this)}
          bmfont-text={{
            text: this.props.text || "Quick brown fox",
            color: this.props.textColor || "white",
            lineHeight: lineHeight * textSizeMultiplier,
            width: width * textSizeMultiplier,
            letterSpacing: 0,
            align: "center",
          }}
          material={{
            shader: "flat",
            color: currentColor,
          }}
        />

        {this.props.children}

      </Entity>
    );
  }
}
