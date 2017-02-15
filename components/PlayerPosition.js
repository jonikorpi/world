import React, { Component } from "react";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";
import { Body } from "react-game-kit";
import Matter from "matter-js";

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
      firebase.database().ref(`players/${playerID}/position`),
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
    const playerPosition = this.state.playerPosition;

    if (!playerPosition || playerPosition.x === null) {
      return null;
    }

    if (this.physics && this.physics.body) {
      Matter.Body.setPosition(this.physics.body, { x: playerPosition.x, y: playerPosition.y });
      Matter.Body.setVelocity(this.physics.body, { x: playerPosition.vx, y: playerPosition.vy });
    }

    const xTransform = `calc( (${playerPosition.x}vmin - (1vmin * var(--playerPositionX))) * var(--worldScale) )`;
    const yTransform = `calc( (${playerPosition.y}vmin - (1vmin * var(--playerPositionY))) * var(--worldScale) )`;

    const transform = `translate3d(${xTransform}, ${yTransform}, 0)`;

    return (
      <Body
        args={[
          playerPosition.x,
          playerPosition.y,
          1,
          1,
          {
            isStatic: true,
          },
        ]}
        ref={(c) => this.physics = c}
      >
        <div
          className="playerPosition"
          style={{
            WebkitTransform: transform,
            transform: transform
          }}
        >
          <style jsx>{`
            .playerPosition {
              position: absolute;
              left: 0; top: 0;
              will-change: transform;
            }
          `}</style>

          {this.props.children}
        </div>
      </Body>
    );
  }
}

reactMixin(PlayerPosition.prototype, reactFire);
