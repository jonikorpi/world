import React, { Component } from "react";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";

export default class PlayerPosition extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.bindFirebase(this.props.playerID);
  }

  bindFirebase = playerID => {
    this.unbindFirebase();

    this.bindAsObject(
      firebase.database().ref(`playerPositions/${playerID}`),
      "playerPosition",
      error => {
        // console.log("Unmounting player", playerID);
        // this.props.unmountPlayer(playerID);
      }
    );
  };

  unbindFirebase = () => {
    this.firebaseListeners.playerPosition && this.unbind("playerPosition");
  };

  render() {
    const { playerID } = { ...this.props };
    const playerPosition = this.state.playerPosition;

    if (!playerPosition || !playerPosition.x) {
      return null;
    }

    const xTransform = `calc( (${playerPosition.x} - var(--playerPositionX)) * var(--worldScale) )`;
    const yTransform = `calc( (${playerPosition.y} - var(--playerPositionY)) * var(--worldScale) )`;

    const transform = `translate3d(${xTransform}, ${yTransform}, 0)`;

    return (
      <div
        className="playerPosition"
        style={{
          WebkitTransform: transform,
          transform: transform
        }}
      >
        <style jsx>
          {
            `
          .playerPosition {
            position: absolute;
            left: 0; top: 0;
          }
        `
          }
        </style>

        {this.props.children}
      </div>
    );
  }
}

reactMixin(PlayerPosition.prototype, reactFire);
