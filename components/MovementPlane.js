import React, { PureComponent } from "react";

export default class MovementPlane extends PureComponent {
  handleClick = (reactEvent) => {
    const worldRef = this.props.worldRef;
    const width = worldRef.clientWidth;
    const height = worldRef.clientHeight;
    const center = [width / 2, height / 2];
    const scale = +window.getComputedStyle(worldRef).getPropertyValue("--worldScale") / 100;
    const scaleDimension = width < height ? width : height;
    const unit = scaleDimension * scale;

    const event = reactEvent.nativeEvent;
    const x = event.clientX;
    const y = event.clientY;

    const relativeCoordinates = [
      (x - center[0]) / unit,
      (y - center[1]) / unit,
    ];

    this.props.moveTowards(relativeCoordinates[0], relativeCoordinates[1]);
  }

  render() {
    return (
      <button
        id="movementPlane"
        type="button"
        onClick={this.handleClick}
      >
        <style jsx>{`
          #movementPlane {
            display: block;
            position: fixed;
            left: 0; top: 0;
            width: 100%;
            height: 100%;
            cursor: crosshair;
            pointer-events: all;
          }
        `}</style>
      </button>
    );
  }
}
