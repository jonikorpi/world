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

    this.state = {};

    this.updateFirebaseHandler = throttle(this.updateFirebase, 1000);
  }

  componentWillMount() {
    this.worldRef = document.querySelector("#world");
    this.positionRef = firebase.database().ref(`players/${this.props.userID}/position`);
  }

  componentDidMount() {
    this.fetchPosition();
    Matter.Events.on(this.context.engine, "afterUpdate", this.handleEngineUpdate);

    this.constraint = Matter.Constraint.create({
      bodyA: this.body.body,
      pointB: { x: 0, y: 0 },
    });
    Matter.World.add(this.context.engine.world, this.constraint);
  }

  componentWillUnmount() {
    Matter.Events.off(this.context.engine, "afterUpdate", this.handleEngineUpdate);
  }

  componentDidUpdate() {
    if (this.initialFetchDone) {
      this.updateFirebaseHandler();
    }
    else {
      this.initialFetchDone = true;
    }
  }

  fetchPosition = () => {
    this.positionRef.once("value").then(position => {
      this.setState({ ...position.val() });
    });
  }

  updateFirebase = () => {
    let state = { ...this.state };
    state["~x"] = Math.round(state.x);
    state["~y"] = Math.round(state.y);
    state.t = firebase.database.ServerValue.TIMESTAMP;

    this.positionRef.set(state, (error) => {
      if (error) {
        this.fetchPosition();
      }
    });
  }

  handleEngineUpdate = () => {
    const { body } = { ...this.body };
    const position = body && body.position;
    const velocity = body && body.velocity;

    // TODO: cap velocity
    // Matter.Body.setVelocity(body, { x: vx, y: vy });

    // TODO: handle angle

    if (position && velocity && position.x !== this.state.x && position.y !== this.state.y) {
      this.setState({
        x: position.x,
        y: position.y,
        vx: velocity.x,
        vy: velocity.y,
      });
    }
  }

  moveTowards = (relativeX, relativeY) => {
    this.constraint.pointB = {
      x: this.body.body.position.x + relativeX,
      y: this.body.body.position.y + relativeY,
    };
  }

  render() {
    const {x, y} = { ...this.state };

    if (x !== null && y !== null) {
      // TODO: render angle
      this.worldRef.style.setProperty("--playerPositionX", x);
      this.worldRef.style.setProperty("--playerPositionY", y);
    } else {
      return null;
    }

    return (
      <Body
        args={[0, 0, 1, 1]}
        ref={(c) => this.body = c}
      >
        <MovementPlane
          moveTowards={this.moveTowards}
          worldRef={this.worldRef}
        />
      </Body>
    );
  }
}
