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
    this.updateFirebaseHandler = throttle(this.updateFirebase, 1000, {});
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
        this.previousState = { x: 0, y: 0 };
      }
    });
  }

  updateFirebase = (x, y, vx, vy) => {
    if (
      this.initialFetchDone
      && (
        Math.abs(vx) > 0.001
        || Math.abs(vy) > 0.001
      )
      && (
        Math.abs(this.previousState.x - x) > 0.001
        || Math.abs(this.previousState.y - y) > 0.001
      )
    ) {
      const state = {
        x: x,
        y: y,
        vx: Math.abs(vx) > 0.001 ? vx : 0,
        vy: Math.abs(vy) > 0.001 ? vy : 0,
        "~x": Math.round(x),
        "~y": Math.round(y),
        t: firebase.database.ServerValue.TIMESTAMP,
      };

      this.previousState = state;
      // console.log("updating firebase");

      this.positionRef.set(state, (error) => {
        if (error) {
          this.fetchPosition();
        }
      });
    }
    else {
      // console.log("not updating firebase");
    }
  }

  handleEngineBeforeUpdate = () => {
    const body = this.body.body;
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
          x: (target.x - body.position.x) / body.mass / 26,
          y: (target.y - body.position.y) / body.mass / 26,
        },
      );
    }

    // TODO: compare x+y together instead
    const velocity = body && body.velocity;
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
            density: 100,
            frictionStatic: 0.01,
            frictionAir: 0.1,
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
