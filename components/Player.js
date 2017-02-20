import React, { PureComponent } from "react";

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
            will-change: transform;
            transform: translate3d(-50%, -50%, 0) rotate(var(--playerAngle));
          }
        `}</style>

        <div
          className="playerModel"
          style={{
            backgroundColor: isSelf ? "white" : "red",
          }}
        />
      </div>
    );
  }
}
