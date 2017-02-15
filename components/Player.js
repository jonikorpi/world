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
          .player {
            width: calc( var(--worldScale) * 0.5 );
            height: calc( var(--worldScale) * 0.5 );
            border-radius: 50%;
            background: white;
            transform: translate(-50%, -50%);
          }
        `}</style>

        {this.props.children}

      </div>
    );
  }
}
