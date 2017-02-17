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
      position: {},
      target: {},
    };

    this.updateFirebaseHandler = throttle(this.updateFirebase, 1000);
  }

  componentWillMount() {
    this.worldRef = document.querySelector("#world");
    this.positionRef = firebase.database().ref(`players/${this.props.userID}/position`);
  }

  componentDidMount() {
    this.fetchPosition();
    Matter.Events.on(this.context.engine, "afterUpdate", this.handleEngineUpdate);
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
      this.setState({
        position: { ...position.val() },
      });
    });
  }

  updateFirebase = () => {
    let state = { ...this.state.position };
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
    const body = this.body.body;
    const position = body && body.position;
    const velocity = body && body.velocity;
    const maxV = 0.1;

    // TODO: compare x+y together instead
    if (velocity.x > maxV || velocity.y > maxV) {
      Matter.Body.setVelocity(body, {
        x: velocity.x > maxV ? maxV : velocity.x,
        y: velocity.y > maxV ? maxV : velocity.y,
      });
    }

    // TODO: handle angle

    const state = this.state.position;

    if (position && velocity && position.x !== state.x && position.y !== state.y) {
      this.setState({
        position: {
          x: position.x,
          y: position.y,
          vx: velocity.x,
          vy: velocity.y,
        },
      });
    }
  }

  moveTowards = (relativeX, relativeY) => {
    const body = this.body.body;

    this.setState({
      target: {
        x: body.position.x + relativeX,
        y: body.position.y + relativeY,
      },
    });
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
