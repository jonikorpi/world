import React, { PureComponent } from "react";

import colors from "../helpers/colors";

export default class RangeIndicator extends PureComponent {
  render() {
    const { range } = { ...this.props };

    return (
      <div
        className="rangeIndicator"
        style={{
          width: `calc( var(--worldScale) * ${range * 20}vmin )`,
          height: `calc( var(--worldScale) * ${range * 20}vmin )`,
        }}
      >
        <style jsx>{`
          .rangeIndicator {
            pointer-events: none;
            position: absolute;
            left: 50%; top: 50%;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            border: 1px solid black;
            animation: entry 618ms ease-out;
          }

          @keyframes entry {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }
}
