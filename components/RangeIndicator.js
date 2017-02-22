import React, { PureComponent } from "react";

import colors from "../helpers/colors";

export default class RangeIndicator extends PureComponent {
  render() {
    const { range, type } = { ...this.props };
    let border;

    switch (type) {
      case "danger":
        border = `1px solid red`;
        break;
      default:
        border = `1px dashed black`;
    }

    return (
      <div
        className="rangeIndicator"
        style={{
          border: border,
          width:  `calc( var(--worldScale) * ${range * 2}vmin )`,
          height: `calc( var(--worldScale) * ${range * 2}vmin )`,
        }}
      >
        <style jsx>{`
          .rangeIndicator {
            pointer-events: none;
            position: absolute;
            left: 50%; top: 50%;
            border-radius: 50%;
            transform: translate(-50%, -50%);
          }
        `}</style>
      </div>
    );
  }
}
