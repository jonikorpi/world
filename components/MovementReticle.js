import React, { PureComponent } from "react";

export default class MovementReticle extends PureComponent {
  render() {
    const xTransform = `calc( ((${this.props.x} * 10vmin) - (10vmin * var(--userPositionX))) * var(--worldScale) )`;
    const yTransform = `calc( ((${this.props.y} * 10vmin) - (10vmin * var(--userPositionY))) * var(--worldScale) )`;
    const transform = `translate3d(${xTransform}, ${yTransform}, 0) translate(-50%, -50%)`;

    return (
      <div
        className="movementReticle"
        style={{
          WebkitTransform: transform,
          transform: transform,
        }}
      >
        <style jsx>
          {
            `
          .movementReticle {
            width:  2vmin;
            height: 2vmin;
            border-radius: 50%;
            border: 0.382vmin solid yellow;
            will-change: transform;
            position: fixed;
            left: 50%; top: 50%;
          }
        `
          }
        </style>
      </div>
    );
  }
}
