import React, { Component, PropTypes } from "react";
import { Body } from "react-game-kit";
import Matter from "matter-js";
import firebase from "firebase";

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

    this.clockSkew = 0;
  }

  componentWillMount() {
    firebase.database().ref("/.info/serverTimeOffset").on("value", (value) => {
      this.clockSkew = value.val();
    });
  }

  componentDidMount() {
    Matter.Events.on(this.context.engine, "beforeUpdate", this.handleEngineBeforeUpdate);
    Matter.Events.on(this.context.engine, "afterUpdate", this.handleEngineAfterUpdate);
  }

  componentWillUnmount() {
    Matter.Events.off(this.context.engine, "beforeUpdate", this.handleEngineBeforeUpdate);
    Matter.Events.off(this.context.engine, "afterUpdate", this.handleEngineAfterUpdate);
    firebase.database().ref("/.info/serverTimeOffset").off("value");
  }

  componentWillReceiveProps(nextProps) {
    const { body } = { ...this.body };
  }

  handleEngineBeforeUpdate = () => {
    const { body } = { ...this.body };
    const elapsedSeconds = (Date.now() - this.props.t + this.clockSkew) / 1000;
    const timeBoost = elapsedSeconds > 5 ? 0 : elapsedSeconds * 10;

    Matter.Body.applyForce(
      body,
      body.position,
      {
        x: (this.props.x + (this.props.vx * timeBoost) - body.position.x) / body.mass * 500,
        y: (this.props.y + (this.props.vy * timeBoost) - body.position.y) / body.mass * 500,
      }
    );

    // TODO: compare x+y together instead
    const velocity = body && body.velocity;
    const maxV = 0.15;
    const absoluteX = Math.abs(velocity.x);
    const absoluteY = Math.abs(velocity.y);
    const xIsTooFast = absoluteX > maxV;
    const yIsTooFast = absoluteY > maxV;

    if (xIsTooFast || yIsTooFast) {
      Matter.Body.setVelocity(body, {
        x: xIsTooFast ? (maxV * Math.sign(velocity.x)) : velocity.x,
        y: yIsTooFast ? (maxV * Math.sign(velocity.y)) : velocity.y,
      });
    }

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
            inertia: Infinity,
            density: 7850,
            frictionStatic: 0.01,
            frictionAir: 0.1,
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
