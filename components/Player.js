import React, { PureComponent } from "react";

import colors from "../helpers/colors";

export default class Player extends PureComponent {
  render() {
    const { isSelf, health, immuneUntil, inMeleeRange, inRangedRange } = { ...this.props };
    const immune = immuneUntil > Date.now();

    return (
      <div id={`player-${this.props[".key"]}`} className="player">
        <style jsx>
          {
            `
          .playerModel {
            position: absolute;
            width:  5vmin;
            height: 10vmin;
            border-radius: 38% 38% 23% 23%;
            will-change: transform;
            transform:
              translate3d(-50%, -50%, 0)
              rotate(var(--playerAngle))
              scale( var(--worldScale) )
            ;
            background: black;
            border: 1px solid transparent;
            transition: border 262ms ease-in;
          }

          .health {
            position: absolute;
            font-weight: bold;
            font-size: 1.5rem;
            line-height: 1;
            will-change: transform;
            transform-origin: -5vmin -5vmin;
            transform: translate(5vmin, 5vmin) scale(var(--worldScale));
          }
        `
          }
        </style>

        <div
          className="playerModel"
          style={{
            color: isSelf || immune ? colors.bright : "red",
            borderColor: inRangedRange ? inMeleeRange ? "red" : "yellow" : "transparent",
          }}
        />

        <div className="health">{health}</div>

      </div>
    );
  }
}
