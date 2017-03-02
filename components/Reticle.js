import React, { PureComponent } from "react";

export default class Reticle extends PureComponent {
  render() {
    const xTransform = `calc( ((${this.props.x} * 10vmin) - (10vmin * var(--cameraPositionX))) * var(--worldScale) )`;
    const yTransform = `calc( ((${this.props.y} * 10vmin) - (10vmin * var(--cameraPositionY))) * var(--worldScale) )`;
    const transform = `translate3d(${xTransform}, ${yTransform}, 0) translate(-50%, -50%)`;

    const scale = this.props.scale || 0.5;
    const iconTransform = `scale(${scale})`;

    return (
      <div
        className="reticle"
        style={{
          WebkitTransform: transform,
          transform: transform,
        }}
      >
        <style jsx>
          {
            `
          .reticle {
            width:  3vmin;
            height: 3vmin;
            will-change: transform;
            position: fixed;
            left: 50%; top: 50%;
          }

          .icon {
            width: 100%;
            height: 100%;
            will-change: transform;
            border-radius: 50%;
            border: 0.618vmin solid yellow;
          }
        `
          }
        </style>

        <div
          className="icon"
          style={{
            WebkitTransform: iconTransform,
            transform: iconTransform,
          }}
        />
      </div>
    );
  }
}
