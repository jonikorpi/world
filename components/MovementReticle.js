import React, { PureComponent } from "react";

export default class MovementReticle extends PureComponent {
  render() {
    const xTransform = `calc( ((${this.props.x} * 1vmin) - (1vmin * var(--userPositionX))) * var(--worldScale) )`;
    const yTransform = `calc( ((${this.props.y} * 1vmin) - (1vmin * var(--userPositionY))) * var(--worldScale) )`;
    const transform = `translate3d(${xTransform}, ${yTransform}, 0) translate(-50%, -50%)`

    return (
      <div
        className="movementReticle"
        style={{
          WebkitTransform: transform,
          transform: transform,
        }}
      >
        <style jsx>{`
          .movementReticle {
            width:  calc(var(--worldScale) * 0.382vmin);
            height: calc(var(--worldScale) * 0.382vmin);
            border-radius: 50%;
            border: calc(var(--worldScale) * 0.09vmin) solid yellow;
            will-change: transform;
            position: fixed;
            left: 50%; top: 50%;
          }
        `}</style>
      </div>
    );
  }
}
