import React, { PureComponent, PropTypes } from "react";
import firebase from "firebase";
import { Body } from "react-game-kit";
import Matter from "matter-js";
import throttle from "lodash.throttle";

import MovementPlane from "../components/MovementPlane";
import MovementReticle from "../components/MovementReticle";

import rendering from "../helpers/rendering";
import maths from "../helpers/maths";

export default class UserBody extends PureComponent {
  static contextTypes = {
    engine: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      target: {},
    };

    this.initialFetchDone = false;
    this.cameraPosition = { x: 0, y: 0 };
    this.updateFirebaseHandler = throttle(this.updateFirebase, 1000);
  }

  componentWillMount() {
    this.worldRef = document.querySelector("#world");
    this.positionRef = firebase.database().ref(`players/${this.props.userID}/position`);
  }

  componentDidMount() {
    this.fetchPosition();
    Matter.Events.on(this.context.engine, "beforeUpdate", this.handleEngineBeforeUpdate);
    Matter.Events.on(this.context.engine, "afterUpdate", this.handleEngineAfterUpdate);
  }

  componentWillUnmount() {
    Matter.Events.off(this.context.engine, "beforeUpdate", this.handleEngineBeforeUpdate);
    Matter.Events.off(this.context.engine, "afterUpdate", this.handleEngineAfterUpdate);
  }

  fetchPosition = () => {
    const body = this.body.body;

    this.positionRef.once("value").then(position => {
      const { x, y } = { ...position.val() };

      Matter.Body.setPosition(body, { x: x, y: y });
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
      this.updateFirebase(x, y, 0, 0);

      if (!this.initialFetchDone) {
        this.previousState = { x: 0, y: 0 };
        this.initialFetchDone = true;
      }
    });
  };

  tryUpdatingFirebase = (x, y, vx, vy) => {
    if (
      this.initialFetchDone &&
      (Math.abs(vx) > 0.001 || Math.abs(vy) > 0.001) &&
      (Math.abs(this.previousState.x - x) > 0.001 || Math.abs(this.previousState.y - y) > 0.001)
    ) {
      this.updateFirebaseHandler(x, y, vx, vy);
    }
  };

  updateFirebase = (x, y, vx, vy) => {
    const roundedX = Math.floor(x);
    const roundedY = Math.floor(y);
    const sectorX = Math.floor(roundedX / 100) * 100;
    const sectorY = Math.floor(roundedY / 100) * 100;

    const state = {
      x: x,
      y: y,
      vx: Math.abs(vx) > 0.001 ? vx : 0,
      vy: Math.abs(vy) > 0.001 ? vy : 0,
      "~x": roundedX,
      "~y": roundedY,
      "~xy": roundedX + "," + roundedY,
      "~~x": sectorX,
      "~~y": sectorY,
      "~~xy": sectorX + "," + sectorY,
      t: firebase.database.ServerValue.TIMESTAMP,
    };

    this.previousState = state;

    this.positionRef.set(state, error => {
      if (error) {
        this.fetchPosition();
      }
    });
  };

  handleEngineBeforeUpdate = () => {
    const body = this.body.body;
    const target = this.state.target;
    const shouldAccelerate = maths.shouldAccelerate(0.2, this.state.target, body.position);

    if (shouldAccelerate) {
      const speedLimit = 1;
      const magnitudeLimit = speedLimit / 60 / body.mass;

      const targetAngle = Matter.Vector.angle({ x: target.x, y: target.y }, body.position);

      Matter.Body.setAngle(body, rendering.angleLerp(body.angle, targetAngle, 4 / 60));

      const forceVector = {
        x: (target.x - body.position.x) / body.mass,
        y: (target.y - body.position.y) / body.mass,
      };

      const clampedForceVector = maths.clampSpeed(forceVector, magnitudeLimit);

      Matter.Body.applyForce(body, body.position, Matter.Vector.rotate(clampedForceVector, body.angle - targetAngle));
    }
  };

  handleEngineAfterUpdate = () => {
    const body = this.body.body;
    const position = body && body.position;
    const velocity = body && body.velocity;

    const cameraPosition = {
      x: rendering.lerp(this.cameraPosition.x, position.x, 2 / 60),
      y: rendering.lerp(this.cameraPosition.y, position.y, 2 / 60),
    };

    this.props.setWorldAttributes({
      "--cameraPositionX": cameraPosition.x,
      "--cameraPositionY": cameraPosition.y,
      "--userPositionX": position.x,
      "--userPositionY": position.y,
      "--playerVelocity": Math.abs(velocity.x) + Math.abs(velocity.y),
      "--playerAngle": body.angle - 1.5708 + "rad",
    });

    this.cameraPosition = cameraPosition;
    this.tryUpdatingFirebase(position.x, position.y, velocity.x, velocity.y);
  };

  moveTowards = (relativeX, relativeY) => {
    this.setState({
      target: {
        x: this.cameraPosition.x + relativeX,
        y: this.cameraPosition.y + relativeY,
      },
    });
  };

  render() {
    return (
      <div id="userBody">
        <Body
          args={[
            0,
            0,
            1,
            0.5,
            {
              density: 106,
              frictionStatic: 0.01,
              frictionAir: 0.1,
              angle: 90 * (Math.PI / 180),
              collisionFilter: {
                mask: 0x0001,
              },
            },
          ]}
          ref={c => this.body = c}
        >
          <div />
        </Body>

        <MovementPlane moveTowards={this.moveTowards} worldRef={this.worldRef} />

        {this.state.target.x && <MovementReticle {...this.state.target} />}
      </div>
    );
  }
}
