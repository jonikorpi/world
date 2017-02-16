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
      x: 0,
      y: 0,
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
      this.setState({ ...position.val() });
    });
  }

  updateFirebase = () => {
    // this.positionRef.set(this.state, (error) => {
    //   if (error) {
    //     this.fetchPosition();
    //   }
    // });
  }

  updateState = (x, y) => {
    this.setState({
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      t: firebase.database.ServerValue.TIMESTAMP,
      "~x": Math.round(x),
      "~y": Math.round(y),
    });
  }

  handleEngineUpdate = () => {
    const { body } = { ...this.body };
    const position = body && body.position;

    if (position) {
      this.setState({
        x: position.x,
        x: position.y,
      });
    }
  }

  moveTowards = (relativeX, relativeY) => {
    const { body } = { ...this.body };

    console.log(this.state.x + relativeX, this.state.y + relativeY);

    // Matter.Body.setPosition(body, { x: props.x, y: props.y });
    // Matter.Body.setVelocity(body, { x: props.vx, y: props.vy });
  }

  render() {
    const {x, y} = { ...this.state };

    if (x !== null && y !== null) {
      this.worldRef.style.setProperty("--playerPositionX", x);
      this.worldRef.style.setProperty("--playerPositionY", y);
    }

    return (
      <Body
        args={[x, y, 1, 1]}
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
