import React, { PureComponent } from "react";

const reticleThickness = 0.125;
const reticleColor = "red";

export default class Reticle extends PureComponent {
  componentDidMount() {
    this.mounted = true;
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
  }

  handleUntarget = () => {
    this.timer = setTimeout(this.untarget, 414);
  }

  untarget = () => {
    if (this.mounted) {
      this.setState({ targeted: false });
    }
  }

  handleMouseEnter = () => { this.target(); }
  handleMouseLeave = () => { this.handleUntarget(); }
  handleTouchEnd = () => { this.handleUntarget(); }

  handleTouchStart = (event) => {
    if (!this.state.targeted) {
      event.preventDefault();
      this.target();
    }
  }

  render() {
    const { size, transform, hideBorders } = { ...this.props };
    const { targeted } = { ...this.state };

    const reticleSize = targeted ? `${size * 2}rem` : `calc(var(--worldScale) * ${size * 1.5}vmin)`

    return (
      <div
        className={`reticle ${targeted ? "targeted" : "not-targeted"}`}
        style={{
          width: reticleSize,
          height: reticleSize,
          WebkitTransform: `${transform || ""} translate(-50%, -50%)`,
          transform: `${transform || ""} translate(-50%, -50%)`,
          borderWidth: hideBorders ? 0 : reticleThickness,
        }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onClick={this.handleClick}
      >
        <style jsx>{`
          .reticle {
            pointer-events: all;
            position: absolute;
            left: 0; top: 0;
            will-change: transform;
            border: 0 solid transparent;
            z-index: 3;
            transition: border 162ms ease-in-out;
          }

          .reticle.targeted {
            border-color: ${reticleColor};
            z-index: 4;
          }
        `}</style>

        {targeted && this.props.children}
      </div>
    );
  }
}
