import React, { PureComponent } from "react";
import firebase from "firebase";
import throttle from "lodash.throttle";

export default class MovementPlane extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};

    this.worldRef = document.querySelector("#world");
    this.updateFirebaseHandler = throttle(this.updateFirebase, 1000);
  }

  componentDidMount() {
    this.positionRef = firebase.database().ref(`players/${this.props.userID}/position`);
    this.fetchPosition();
  }

  fetchPosition = () => {
    this.positionRef.once("value").then(position => {
      this.setState({ ...position.val() });
    });
  }

  handleClick = (reactEvent) => {
    const width = this.worldRef.clientWidth;
    const height = this.worldRef.clientHeight;
    const center = [width / 2, height / 2];
    const scale = +window.getComputedStyle(this.worldRef).getPropertyValue("--worldScale") / 100;
    const scaleDimension = width < height ? width : height;
    const unit = scaleDimension * scale;

    const event = reactEvent.nativeEvent;
    const x = event.clientX;
    const y = event.clientY;

    const relativeCoordinates = [
      this.state.x + (x - center[0]) / unit,
      this.state.y + (y - center[1]) / unit,
    ];

    this.setState({
      x: relativeCoordinates[0],
      y: relativeCoordinates[1],
      t: firebase.database.ServerValue.TIMESTAMP,
      "~x": Math.round(relativeCoordinates[0]),
      "~y": Math.round(relativeCoordinates[1]),
    });
  }

  componentDidUpdate() {
    const {x, y} = { ...this.state };

    if (x !== null && y !== null) {
      this.worldRef.style.setProperty("--playerPositionX", x);
      this.worldRef.style.setProperty("--playerPositionY", y);
    }

    if (this.initialFetchDone) {
      this.updateFirebaseHandler();
    }
    else {
      this.initialFetchDone = true;
    }
  }

  updateFirebase = () => {
    this.positionRef.set(this.state, (error) => {
      if (error) {
        this.fetchPosition();
      }
    });
  }

  render() {
    return (
      <button
        id="movementPlane"
        type="button"
        onClick={this.handleClick}
      >
        <style jsx>{`
          #movementPlane {
            display: block;
            position: fixed;
            left: 0; top: 0;
            width: 100%;
            height: 100%;
            cursor: crosshair;
            pointer-events: all;
          }
        `}</style>

        {this.props.children}
      </button>
    );
  }
}
