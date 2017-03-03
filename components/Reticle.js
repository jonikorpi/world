import React, { PureComponent } from "react";

export default class Reticle extends PureComponent {
  render() {
    const { x, y, screenSpace, radius } = { ...this.props };

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
            position: fixed;
            left: 50%; top: 50%;
          }

          .icon {
            border-radius: 50%;
            border: 0.236rem solid yellow;
            animation: none 500ms ease-out;
            animation-fill-mode: forwards;
          }

          .screenSpace {
            animation-name: screenSpace;
          }

          .worldSpace {
            animation-name: worldSpace;
            animation-duration: 162ms;
          }

          @keyframes worldSpace {
            0% {
              transform: translate3d(-50%, -50%, 0) scale(1);
            }
            100% {
              transform: translate3d(-50%, -50%, 0) scale(0.5);
            }
          };

          @keyframes screenSpace {
            0% {
              transform: translate3d(-50%, -50%, 0) scale(0);
              border-color: white;
            }
            91% {
              border-color: white;
            }
            100% {
              transform: translate3d(-50%, -50%, 0) scale(1);
              border-color: yellow;
            }
          };
        `
          }
        </style>

        <div
          className={`icon ${screenSpace ? "screenSpace" : "worldSpace"}`}
          style={{
            width: radius ? `${radius * 10 * 2}vmin` : "5vmin",
            height: radius ? `${radius * 10 * 2}vmin` : "5vmin",
          }}
        />
      </div>
    );
  }
}
