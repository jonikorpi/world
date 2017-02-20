import React, { PureComponent } from "react";

const reticleThickness = 0.125;
const reticleColor = "red";

export default class Reticle extends PureComponent {
  handleMouseEnter = () => {
    this.setState({ targeted: true });
  }

  handleMouseLeave = () => {
    this.setState({ targeted: false });
  }

  render() {
    const { size } = { ...this.props };
    const { targeted } = { ...this.state };

    const reticleSize = targeted ? `${size * 2}rem` : `calc(var(--worldScale) * ${size}vmin)`

    return (
      <div
        className={`reticle ${targeted ? "targeted" : "not-targeted"}`}
        style={{
          width: reticleSize,
          height: reticleSize,
        }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <style jsx>{`
          .reticle {
            pointer-events: all;
            position: absolute;
            left: 0; top: 0;
            transform: translate(-50%, -50%);
            background-image:
              linear-gradient(to right, ${reticleColor} ${reticleThickness * 6}rem, transparent ${reticleThickness * 6}rem),
              linear-gradient(to right, ${reticleColor} ${reticleThickness * 6}rem, transparent ${reticleThickness * 6}rem),
              linear-gradient(to bottom, ${reticleColor} ${reticleThickness * 6}rem, transparent ${reticleThickness * 6}rem),
              linear-gradient(to bottom, ${reticleColor} ${reticleThickness * 6}rem, transparent ${reticleThickness * 6}rem)
            ;
            background-size:
              100% ${reticleThickness}rem,
              100% ${reticleThickness}rem,
              ${reticleThickness}rem 100%,
              ${reticleThickness}rem 100%
            ;
            background-position:
              -${reticleThickness * 3}rem 0%,
              -${reticleThickness * 3}rem 100%,
              0% -${reticleThickness * 3}rem,
              100% -${reticleThickness * 3}rem
            ;
            background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
            opacity: 0;
            will-change: opacity, width, height, z-index;
          }

          .reticle.targeted {
            opacity: 1;
            z-index: 100;
          }
        `}</style>

        {targeted && this.props.children}
      </div>
    );
  }
}
