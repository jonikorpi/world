import React, { PureComponent, PropTypes } from "react";
import firebase from "firebase";
import { Body } from "react-game-kit";
import Matter from "matter-js";
import throttle from "lodash.throttle";

import MovementPlane from "../components/MovementPlane";

export default class UserBody extends PureComponent {
  static contextTypes = {
    engine: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      target: {},
    };

    this.initialFetchDone = false;
    this.previousState = {};
    this.updateFirebaseHandler = throttle(this.updateFirebase, 1000, { leader: true });
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
      const {x, y, vx, vy} = { ...position.val() };

      Matter.Body.setPosition(body, { x: x, y: y });
      // TODO: set angle from velocity vector here or in engine update

      if (this.initialFetchDone) {
        Matter.Body.setVelocity(body, { x: vx, y: vy });
      }
      else {
        this.initialFetchDone = true;
      }
    });
  }

  updateFirebase = (x, y, vx, vy) => {
    if (this.initialFetchDone && (this.previousState.x !== x || this.previousState.y !== y)) {
      const state = {
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        "~x": Math.round(x),
        "~y": Math.round(y),
        t: firebase.database.ServerValue.TIMESTAMP,
      };

      console.log(state);

      this.previousState = state;

      this.positionRef.set(state, (error) => {
        if (error) {
          this.fetchPosition();
        }
      });
    }
  }

  handleEngineBeforeUpdate = () => {
    const body = this.body.body;
    const velocity = body && body.velocity;
    const target = this.state.target;

    const stopWithin = 0.2;
    const xDistance = Math.abs(target.x - body.position.x);
    const yDistance = Math.abs(target.y - body.position.y);
    const shouldAccelerate = (
      target.x && target.y
      && (
        xDistance > stopWithin || yDistance > stopWithin
      )
    );

    if (shouldAccelerate) {
      Matter.Body.applyForce(
        body,
        {
          x: body.position.x,
          y: body.position.y,
        },
        {
          x: (target.x - body.position.x) / body.mass * 500,
          y: (target.y - body.position.y) / body.mass * 500,
        },
      );
    }

    // TODO: compare x+y together instead
    const maxV = 0.1;
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
  }

  handleEngineAfterUpdate = () => {
    const body = this.body.body;
    const position = body && body.position;
    const velocity = body && body.velocity;

    this.updateFirebaseHandler(
      position.x,
      position.y,
      velocity.x,
      velocity.y,
    );

    // TODO: render angle
    this.worldRef.style.setProperty("--userPositionX", position.x);
    this.worldRef.style.setProperty("--userPositionY", position.y);
    this.worldRef.style.setProperty("--userAngle", body.angle + "rad");
  }

  moveTowards = (relativeX, relativeY) => {
    const body = this.body.body;

    console.log("moveTowards", relativeX, relativeY);

    this.setState({
      target: {
        x: body.position.x + relativeX,
        y: body.position.y + relativeY,
      },
    });
  }

  render() {
    return (
      <div id="userBody">
        <Body
          args={[0, 0, 1, 1, {
            density: 7850,
            frictionStatic: 0.01,
            frictionAir: 0.1,
            inertia: Infinity,
          }]}
          ref={(c) => this.body = c}
        >
          <div />
        </Body>

        <MovementPlane
          moveTowards={this.moveTowards}
          worldRef={this.worldRef}
        />
      </div>
    );
  }
}
