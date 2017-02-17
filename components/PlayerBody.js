import React, { Component, PropTypes } from "react";
import { Body } from "react-game-kit";
import Matter from "matter-js";

export default class PlayerBody extends Component {
  static contextTypes = {
    engine: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      engineX: 0,
      engineY: 0,
    };
  }

  componentDidMount() {
    Matter.Events.on(this.context.engine, "beforeUpdate", this.handleEngineBeforeUpdate);
    Matter.Events.on(this.context.engine, "afterUpdate", this.handleEngineAfterUpdate);
  }

  componentWillUnmount() {
    Matter.Events.off(this.context.engine, "beforeUpdate", this.handleEngineBeforeUpdate);
    Matter.Events.off(this.context.engine, "afterUpdate", this.handleEngineAfterUpdate);
  }

  componentWillReceiveProps(nextProps) {
    const { body } = { ...this.body };
  }

  handleEngineBeforeUpdate = () => {
    const { body } = { ...this.body };
    // const timeElapsed = (Date.now() - this.props.t) / 1000;
    // console.log(this.context.engine.timing.timestamp, this.props.t, timeElapsed);

    // var test = 400 + 100 * Math.sin(this.context.engine.timing.timestamp);

    Matter.Body.applyForce(
      body,
      body.position,
      {
        x: ((this.props.x + this.props.vx) - body.position.x) / body.mass * 500,
        y: ((this.props.y + this.props.vy) - body.position.y) / body.mass * 500,
      }
    );

    // TODO: calculate angle with Matter.Vector.angle from velocity
  }

  handleEngineAfterUpdate = () => {
    const { body } = { ...this.body };
    const position = body && body.position;
    const {engineX, engineY} = { ...this.state };

    if (position && (engineX !== position.x || engineY !== position.y)) {
      this.setState({
        engineX: position.x,
        engineY: position.y,
      });
    }
  }

  render() {
    const {x, y, vx, vy} = { ...this.props };
    const {engineX, engineY} = { ...this.state };

    // TODO: modify CSS variable instead of re-rendering
    // TODO: render --playerAngle

    const xTransform = `calc( (${engineX}vmin - (1vmin * var(--userPositionX))) * var(--worldScale) )`;
    const yTransform = `calc( (${engineY}vmin - (1vmin * var(--userPositionY))) * var(--worldScale) )`;

    const transform = `translate3d(${xTransform}, ${yTransform}, 0)`;

    return (
      <Body
        args={[
          x, y, 1, 1,
          {
            //isStatic: true,
            velocity: { x: vx, y: vy },
            density: 7850,
            frictionStatic: 0.01,
            frictionAir: 0.1,
            inertia: Infinity,
          },
        ]}
        ref={(c) => this.body = c}
      >
        <div
          className="playerPosition"
          style={{
            WebkitTransform: transform,
            transform: transform
          }}
        >
          <style jsx>{`
            .playerPosition {
              position: absolute;
              left: 0; top: 0;
              will-change: transform;
            }
          `}</style>

          {this.props.children}
        </div>
      </Body>
    );
  }
}
