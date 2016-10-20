import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import "aframe-bmfont-text-component";

export default class Text extends PureComponent {
  render() {
    const className = "text";

    if (this.props.className) {
      className += " " + this.props.className;
    }

    return (
      <Entity
        id={this.props.id || undefined}
        className={className}
        position={this.props.position}
        bmfont-text={{
          text: this.props.text,
          color: this.props.textColor || "white",
          lineHeight: this.props.lineHeight || 24,
          width: this.props.width,
          letterSpacing: this.props.letterSpacing,
          align: this.props.align || "center",
        }}
      />
    );
  }
}
