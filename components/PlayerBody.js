import React, { Component, PropTypes } from "react";
import { Body } from "react-game-kit";
import Matter from "matter-js";
import firebase from "firebase";

import MovementReticle from "../components/MovementReticle";

import rendering from "../helpers/rendering";
import movement from "../helpers/movement";

const xTransform = `calc( ((var(--playerPositionX) * 1vmin) - (1vmin * var(--userPositionX))) * var(--worldScale) )`;
const yTransform = `calc( ((var(--playerPositionY) * 1vmin) - (1vmin * var(--userPositionY))) * var(--worldScale) )`;

export default class PlayerBody extends Component {
  static contextTypes = {
    engine: PropTypes.object
  };

  constructor(props) {
    super(props);

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

  handleEngineBeforeUpdate = () => {
    const body = this.body.body;
    const target = { x: this.props.x, y: this.props.y };
    const shouldAccelerate = movement.shouldAccelerate(0.2, target, body.position);
    const maxAllowedPositionSkew = 1.5;

    if (
      Math.abs(this.props.x - body.position.x) > maxAllowedPositionSkew
      || Math.abs(this.props.y - body.position.y) > maxAllowedPositionSkew
    ) {
      Matter.Body.setPosition(body, {
        x: this.props.x,
        y: this.props.y,
      });
    }

    if (shouldAccelerate) {
      const speedLimit = 1 * 1.09;
      const magnitudeLimit = speedLimit / 60 / body.mass;

      const elapsedSeconds = (Date.now() - this.props.t + this.clockSkew) / 1000;
      const reckoning = elapsedSeconds > 1.15 ? 0 : (4 + elapsedSeconds) * 60;

      const velocityVector = Matter.Vector.mult({
        x: this.props.vx,
        y: this.props.vy,
      }, 1 + reckoning);

      let positionVector = {
        x: this.props.x + velocityVector.x,
        y: this.props.y + velocityVector.y,
      };

      let forceVector = {
        x: (positionVector.x - body.position.x) / body.mass,
        y: (positionVector.y - body.position.y) / body.mass,
      };

      const clampedForceVector = movement.clampSpeed(forceVector, magnitudeLimit);

      const targetAngle = Matter.Vector.angle(
        positionVector,
        body.position,
      );

      Matter.Body.applyForce(body, body.position, clampedForceVector);

      Matter.Body.setAngle(
        body,
        rendering.angleLerp(body.angle, targetAngle, 3 / 60),
      );
    }
  }

  handleEngineAfterUpdate = () => {
    const { body } = { ...this.body };
    const position = body && body.position;

    this.positionRef.style.setProperty("--playerPositionX", position.x);
    this.positionRef.style.setProperty("--playerPositionY", position.y);
    this.positionRef.style.setProperty("--playerAngle", body.angle - 1.5708 + "rad");
  }

  render() {
    const {x, y, vx, vy} = { ...this.props };

    return (
      <div className="playerBody">
        <Body
          args={[x, y, 1, 0.5, {
            //isStatic: true,
            inertia: Infinity,
            density: 106,
            frictionStatic: 0.01,
            frictionAir: 0.1,
            velocity: { x: vx, y: vy },
            angle: Matter.Vector.angle(
              { x: x, y: y },
              { x: x + vx, y: y + vy }
            ),
          }]}
          ref={(c) => this.body = c}
        >
          <div />
        </Body>

        <MovementReticle x={x} y={y} />

        <div
          className="playerPosition"
          ref={(c) => this.positionRef = c}
        >
          <style jsx>{`
            .playerPosition {
              position: absolute;
              left: 0; top: 0;
              will-change: transform;
              transform: translate3d(${xTransform}, ${yTransform}, 0);
            }
          `}</style>

          {this.props.children}
        </div>
      </div>
    );
  }
}
