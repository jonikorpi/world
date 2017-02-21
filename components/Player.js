import React, { PureComponent } from "react";

import colors from "../helpers/colors";

export default class Player extends PureComponent {
  render() {
    const { isSelf, health, immuneUntil } = { ...this.props };

    const immune = immuneUntil > Date.now();

    return (
      <div id={`player-${this.props[".key"]}`} className="player">
        <style jsx>{`
          .playerModel {
            position: absolute;
            width:  calc(var(--worldScale) * 0.5vmin);
            height: calc(var(--worldScale) * 1vmin);
            border-radius: 38% 38% 23% 23%;
            will-change: transform;
            transform: translate3d(-50%, -50%, 0) rotate(var(--playerAngle));
            background: black;
          }

          .health {
            transform: rotate( calc(var(--playerAngle) * -1) );
            font-weight: bold;
            font-size: calc(var(--worldScale) * 0.5vmin);
            width: 100%;
            text-align: center;
            line-height: 2.25;
          }
        `}</style>

        <div
          className="playerModel"
          style={{
            color: isSelf || immune ? colors.bright : "red",
          }}
        >
          <div className="health">{health}</div>
        </div>

      </div>
    );
  }
}
