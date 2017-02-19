import React, { Component, PropTypes } from "react";
import { Body } from "react-game-kit";
import Matter from "matter-js";
import firebase from "firebase";

import rendering from "../helpers/rendering";

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
    const { body } = { ...this.body };
    const elapsedSeconds = (Date.now() - this.props.t + this.clockSkew) / 1000;
    const timeBoost = elapsedSeconds > 2.2 ? 0 : (1 + elapsedSeconds) * 60;
    const maxAllowedPositionSkew = 2;

    const stopWithin = 0.2;
    const xDistance = Math.abs(this.props.x - body.position.x);
    const yDistance = Math.abs(this.props.y - body.position.y);
    const shouldAccelerate = (
      this.props.x && this.props.y
      && (
        xDistance > stopWithin || yDistance > stopWithin
      )
    );

    if (
      timeBoost === 0
      && (
        Math.abs(this.props.x - body.position.x) > maxAllowedPositionSkew
        || Math.abs(this.props.y - body.position.y) > maxAllowedPositionSkew
      )
    ) {
      Matter.Body.setPosition(body, {
        x: this.props.x,
        y: this.props.y,
      });
    }

    let positionVector = {
      x: this.props.x + (this.props.vx * timeBoost),
      y: this.props.y + (this.props.vy * timeBoost),
    };

    let forceVector = {
      x: (positionVector.x - body.position.x) / body.mass,
      y: (positionVector.y - body.position.y) / body.mass,
    };

    if (shouldAccelerate) {
      const speedLimit = 1 * 1.146;
      const magnitudeLimit = speedLimit / 60 / body.mass;

      const speed = Matter.Vector.magnitude(forceVector);

      if (speed > magnitudeLimit) {
        forceVector = Matter.Vector.div(forceVector, speed / magnitudeLimit);
      }

      Matter.Body.applyForce(body, body.position, forceVector);
    }

    const targetAngle = Matter.Vector.angle(
      positionVector,
      body.position,
    );

    Matter.Body.setAngle(
      body,
      rendering.angleLerp(body.angle, targetAngle, 4 / 60),
    );
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
      <Body
        args={[x, y, 0.5, 1, {
          //isStatic: true,
          velocity: { x: vx, y: vy },
          inertia: Infinity,
          density: 105.414,
          frictionStatic: 0.01,
          frictionAir: 0.1,
        }]}
        ref={(c) => this.body = c}
      >
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
      </Body>
    );
  }
}
