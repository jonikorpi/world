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
      const {x, y, vx, vy} = { ...position.val() };

      this.initialFetchDone = true;
      Matter.Body.setVelocity(body, { x: vx, y: vy });
      Matter.Body.setPosition(body, { x: x, y: y });
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
    const maxV = 1;

    if (target.x && target.y) {
      Matter.Body.applyForce(
        body,
        body.position,
        {
          x: (target.x - body.position.x) * 0.00000001,
          y: (target.y - body.position.y) * 0.00000001,
        },
      );
    }

    // TODO: handle angle

    // TODO: compare x+y together instead
    // if (velocity.x > maxV || velocity.y > maxV) {
    //   Matter.Body.setVelocity(body, {
    //     x: velocity.x > maxV ? maxV : velocity.x,
    //     y: velocity.y > maxV ? maxV : velocity.y,
    //   });
    // }
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
    this.worldRef.style.setProperty("--playerPositionX", position.x);
    this.worldRef.style.setProperty("--playerPositionY", position.y);
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
          args={[0, 0, 1, 1]}
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
