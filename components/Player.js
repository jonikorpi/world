import React, { PureComponent } from "react";

export default class Player extends PureComponent {
  // componentDidMount() {
  //   const isOwnUnit = this.props.userID === this.props.unit.userID;
  //
  //   this.props.synth.triggerAttackRelease(isOwnUnit ? "C6" : "E6", "8n");
  // }
  //
  // componentWillUnmount() {
  //   const isOwnUnit = this.props.userID === this.props.unit.userID;
  //
  //   this.props.synth.triggerAttackRelease(isOwnUnit ? "C4" : "E4", "4n");
  // }

  render() {
    const { x, y, isSelf, centerPosition } = { ...this.props };

    // const position = isSelf ? [
    //   centerPosition[0]*-1,
    //   centerPosition[1]*-1,
    //   centerPosition[2]*-1,
    // ] : [
    //   x * hex.size * 3/2,
    //   0,
    //   hex.size * Math.sqrt(3) * (y + x/2),
    // ];

    return (
      <div id={`player-${this.props[".key"]}`} className="player">
        <style jsx>{`
          .playerModel {
            width: 1rem;
            height: 1rem;
            border-radius: 50% 50% 0 0;
            background: white;
            will-change: transform;
            transform: translate3d(-50%, -50%, 0) scale(var(--worldScale));
          }
        `}</style>

        <div className="playerModel" />

        {this.props.children}

      </div>
    );
  }
}
