import React, { PureComponent } from "react";

const reticleThickness = 0.125;
const reticleColor = "red";

export default class Tooltip extends PureComponent {
  componentDidMount() {
    this.mounted = true;

    this.state = {};
  }

  componentWillUnmount() {
    this.mounted = false;

    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  target = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.setState({ targeted: true });
  };

  handleUntarget = () => {
    this.timer = setTimeout(this.untarget, 1618);
    // this.untarget();
  };

  untarget = () => {
    if (this.mounted) {
      this.setState({ targeted: false });
    }
  };

  handleMouseEnter = () => {
    this.target();
  };
  handleMouseLeave = () => {
    this.untarget();
  };
  handleTouchEnd = () => {
    this.handleUntarget();
  };

  handleTouchStart = event => {
    if (!this.state.targeted) {
      event.preventDefault();
      this.target();
    }
  };

  render() {
    const { size, transform, hideBorders } = { ...this.props };
    const { targeted } = { ...this.state };

    const reticleSize = `calc(var(--worldScale) * ${size * 2}vmin)`;

    return (
      <div
        className={`reticleContainer ${targeted ? "targeted" : "not-targeted"}`}
        style={{
          WebkitTransform: transform,
          transform: transform,
        }}
      >
        <style jsx>
          {
            `
          .reticleContainer {
            position: absolute;
            left: 0; top: 0;
            z-index: 3;
          }

          .targeted {
            z-index: 4;
          }

          .reticle {
            pointer-events: all;
            position: absolute;
            will-change: transform;
            border: 0 solid transparent;
            transition: 162ms ease-in-out;
            transition-property: border-color, transform, opacity;
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }

          .targeted .reticle {
            border-color: ${reticleColor};
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        `
          }
        </style>

        <div
          className="reticle"
          style={{
            width: reticleSize,
            height: reticleSize,
            borderWidth: hideBorders ? 0 : reticleThickness,
          }}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
          onClick={this.handleClick}
        >
          {targeted && this.props.children}
        </div>
      </div>
    );
  }
}
