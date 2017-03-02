import React, { PureComponent } from "react";

export default class Reticle extends PureComponent {
  render() {
    const { x, y, screenSpace } = { ...this.props };

    const xTransform = screenSpace
      ? `calc( ${x}px - 50vw )`
      : `calc( ((${x} * 10vmin) - (10vmin * var(--cameraPositionX))) * var(--worldScale) )`;
    const yTransform = screenSpace
      ? `calc( ${y}px - 50vh )`
      : `calc( ((${y} * 10vmin) - (10vmin * var(--cameraPositionY))) * var(--worldScale) )`;

    const transform = `translate3d(${xTransform}, ${yTransform}, 0)`;

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
            will-change: transform;
            position: fixed;
            left: 50%; top: 50%;
          }

          .icon {
            width: 5rem;
            height: 5rem;
            will-change: transform;
            border-radius: 50%;
            border: 0.618vmin solid yellow;
            animation: worldSpace 600ms ease-out;
          }

          @keyframes worldSpace {
            0% {
              transform: scale(1) translate(-50%, -50%);
            }
            100% {
              transform: scale(0.125) translate(-50%, -50%);
            }
          };

          @keyframes screenSpace {
            0% {
              transform: scale(0.125) translate(-50%, -50%);
            }
            100% {
              transform: scale(1) translate(-50%, -50%);
            }
          };
        `
          }
        </style>

        <div
          className="icon"
          style={{
            WebkitAnimationName: screenSpace ? "screenSpace" : "worldSpace",
            animationName: screenSpace ? "screenSpace" : "worldSpace",
          }}
        />
      </div>
    );
  }
}
