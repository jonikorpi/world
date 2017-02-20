import React, { PureComponent } from "react";

import Reticle from "../components/Reticle";

export default class Player extends PureComponent {
  render() {
    const { isSelf } = { ...this.props };

    return (
      <div id={`player-${this.props[".key"]}`} className="player">
        <style jsx>{`
          .playerModel {
            width:  calc(var(--worldScale) * 0.5vmin);
            height: calc(var(--worldScale) * 1vmin);
            border-radius: 50% 50% 0 0;
            background: white;
            will-change: transform;
            transform: translate3d(-50%, -50%, 0) rotate(var(--playerAngle));
          }
        `}</style>

        <div className="playerModel" />

        {!isSelf && (
          <Reticle size={1}>
            {this.props.action}
          </Reticle>
        )}
      </div>
    );
  }
}
