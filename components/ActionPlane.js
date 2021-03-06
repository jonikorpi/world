import React, { PureComponent } from "react";
import Reticle from "../components/Reticle";

export default class ActionPlane extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      holdingDown: false,
      startedHoldingAt: undefined,
      x: undefined,
      y: undefined,
    };
  }

  componentWillMount() {
    document.addEventListener("keyup", this.handleKeyboard, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyboard);
  }

  handleKeyboard = event => {
    if (this.state.holdingDown) {
      this.cancel();
      event.stopPropagation();
      event.preventDefault();
    }
  };

  triggerMovement = () => {
    const { x, y } = { ...this.state };

    if (x && y) {
      const worldRef = this.props.worldRef;
      const width = worldRef.clientWidth;
      const height = worldRef.clientHeight;
      const center = [width / 2, height / 2];
      const scale = (+window.getComputedStyle(worldRef).getPropertyValue("--worldScale")) / 10;
      const scaleDimension = width < height ? width : height;
      const unit = scaleDimension * scale;

      this.props.moveTowards((x - center[0]) / unit, (y - center[1]) / unit);
    }
  };

  triggerAction = () => {
    console.log("triggering action at", this.state.x, this.state.y);
  };

  startHolding = () => {
    this.setState({ holdingDown: true, startedHoldingAt: Date.now() });
  };

  updatePosition = (x, y) => {
    this.setState({ x: x, y: y });
  };

  letGo = () => {
    if (this.state.holdingDown) {
      const heldDownFor = Date.now() - this.state.startedHoldingAt;

      if (heldDownFor < 300) {
        this.triggerMovement();
      } else if (heldDownFor >= 500) {
        this.triggerAction();
      }

      this.cancel();
    }
  };

  cancel = () => {
    if (this.state.holdingDown) {
      this.setState({ holdingDown: false, startedHoldingAt: undefined });
    }
  };

  handleMouseDown = reactEvent => {
    const event = reactEvent.nativeEvent;

    if (event.button === 0) {
      this.startHolding();
      this.updatePosition(event.clientX, event.clientY);
    } else {
      this.cancel();
    }
  };

  handleMouseMove = reactEvent => {
    if (this.state.holdingDown) {
      const event = reactEvent.nativeEvent;
      this.updatePosition(event.clientX, event.clientY);
    }
  };

  handleMouseOut = () => {
    this.cancel();
  };

  handleMouseUp = reactEvent => {
    this.letGo();
  };

  handleTouchStart = reactEvent => {
    const event = reactEvent.nativeEvent;
    reactEvent.nativeEvent.preventDefault();

    if (this.state.holdingDown) {
      this.cancel();
    } else {
      this.startHolding();
      this.updatePosition(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    }
  };

  handleTouchMove = reactEvent => {
    const event = reactEvent.nativeEvent;
    this.updatePosition(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
  };

  handleTouchCancel = () => {
    this.cancel();
  };

  handleTouchEnd = reactEvent => {
    this.letGo();
  };

  render() {
    const { holdingDown, x, y } = { ...this.state };

    return (
      <div
        id="actionPlaneContainer"
        style={{
          zIndex: holdingDown ? 10 : 0,
        }}
      >
        <style jsx>
          {
            `
            #actionPlaneContainer {
              position: fixed;
              left: 0; top: 0;
              width: 100%;
              height: 100%;
            }

            #actionPlane {
              display: block;
              width: 100%;
              height: 100%;
              cursor: crosshair;
              pointer-events: all;
            }
          `
          }
        </style>

        <button
          id="actionPlane"
          type="button"
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
          onMouseOut={this.handleMouseOut}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onTouchCancel={this.handleTouchCancel}
        />

        {holdingDown && <Reticle x={x} y={y} radius={2} screenSpace />}
      </div>
    );
  }
}
