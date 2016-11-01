import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import "aframe-bmfont-text-component";

export default class Text extends PureComponent {
  render() {
    let className = "text";
    const textSizeMultiplier = 200;

    if (this.props.className) {
      className += " " + this.props.className;
    }

    return (
      <Entity
        id={this.props.id}
        className={className}
        position={this.props.position || [0,0,0]}
        rotation={this.props.rotation || [0,0,0]}
        bmfont-text={{
          text: this.props.text || "Quick brown fox",
          color: this.props.textColor || "white",
          lineHeight: this.props.lineHeight * textSizeMultiplier || 24,
          width: this.props.width * textSizeMultiplier || 500,
          letterSpacing: this.props.letterSpacing || undefined,
          align: this.props.align || "center",
        }}
        scale={[this.props.scale, this.props.scale, this.props.scale]}
      />
    );
  }
}
