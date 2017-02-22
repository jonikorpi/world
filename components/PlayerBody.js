import React, { Component, PropTypes } from "react";
import { Body } from "react-game-kit";
import Matter from "matter-js";
import firebase from "firebase";

// import MovementReticle from "../components/MovementReticle";
import Player from "../components/Player";
import Reticle from "../components/Reticle";
import RangeIndicator from "../components/RangeIndicator";
import Action from "../components/Action";

import rendering from "../helpers/rendering";
import maths from "../helpers/maths";

const xTransform = `calc( ((var(--playerPositionX) * 1vmin) - (1vmin * var(--userPositionX))) * var(--worldScale) )`;
const yTransform = `calc( ((var(--playerPositionY) * 1vmin) - (1vmin * var(--userPositionY))) * var(--worldScale) )`;
const transform = `translate3d(${xTransform}, ${yTransform}, 0)`;

export default class PlayerBody extends Component {
  static contextTypes = {
    engine: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {};

    this.clockSkew = 0;
  }

  componentWillMount() {
    this.worldRef = document.querySelector("#world");
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
    const shouldAccelerate = maths.shouldAccelerate(0.2, target, body.position);
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

      const clampedForceVector = maths.clampSpeed(forceVector, magnitudeLimit);

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
    const velocity = body && body.velocity;

    this.positionRef.style.setProperty("--playerPositionX", position.x);
    this.positionRef.style.setProperty("--playerPositionY", position.y);
    this.positionRef.style.setProperty("--playerVelocity", Math.abs(velocity.x) + Math.abs(velocity.y));
    this.positionRef.style.setProperty("--playerAngle", body.angle - 1.5708 + "rad");

    this.updateRanges(position);
  }

  updateRanges = (position) => {
    const styles = window.getComputedStyle(this.worldRef);
    const userX = styles.getPropertyValue("--userPositionX");
    const userY = styles.getPropertyValue("--userPositionY");
    const distance = maths.distanceBetween(userX, userY, position.x, position.y);
    const inMeleeRange = this.props.userMeleeRange - distance >= 0;
    const inRangedRange = this.props.userRangedRange - distance >= 0;

    if (this.state.inMeleeRange !== inMeleeRange || this.state.inRangedRange !== inRangedRange) {
      this.setState({
        inMeleeRange: this.props.userMeleeRange - distance >= 0,
        inRangedRange: this.props.userRangedRange - distance >= 0,
      });
    }
  }

  render() {
    const {x, y, vx, vy, userID, userToken, playerID, meleeRange, rangedRange} = { ...this.props };
    const {inMeleeRange, inRangedRange} = { ...this.state };

    const actionProps = {
      userID: userID,
      userToken: userToken,
    };

    return (
      <div className="playerBody" ref={(c) => this.positionRef = c}>
        <style jsx>{`
          .playerPosition {
            position: absolute;
            left: 0; top: 0;
            will-change: transform;
            transform: ${transform};
            z-index: 2;
          }
        `}</style>

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

        {/*<MovementReticle x={x} y={y} />*/}

        <div className="playerPosition">
          <Player
            {...this.props}
            {...this.state}
          />
        </div>

        <Reticle size={1} transform={transform}>
          <RangeIndicator range={meleeRange}/>
          <RangeIndicator range={rangedRange}/>

          {(inRangedRange && !inMeleeRange ) && (
            <Action
              data={{
                action: "rangedAttack",
                playerID: playerID
              }}
              {...actionProps}
            />
          )}

          {(inMeleeRange ) && (
            <Action
              data={{
                action: "meleeAttack",
                playerID: playerID
              }}
              {...actionProps}
            />
          )}
        </Reticle>
      </div>
    );
  }
}
