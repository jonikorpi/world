import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import Player from "../components/Player";
import UserBody from "../components/UserBody";
import Reticle from "../components/Reticle";
import RangeIndicator from "../components/RangeIndicator";

const xTransform = `calc( ((var(--userPositionX) * 10vmin) - (10vmin * var(--cameraPositionX))) * var(--worldScale) )`;
const yTransform = `calc( ((var(--userPositionY) * 10vmin) - (10vmin * var(--cameraPositionY))) * var(--worldScale) )`;
const transform = `translate3d(${xTransform}, ${yTransform}, 0)`;

export default class UserState extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    if (this.props.userID) {
      this.bindFirebase(this.props.userID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userID !== nextProps.userID) {
      if (this.props.userID) {
        this.unbind("player");
        this.unbind("playerSecrets");
        this.unbind("playerSettings");
      }

      if (nextProps.userID) {
        this.bindFirebase(nextProps.userID);
      }
    }
  }

  bindFirebase = userID => {
    this.bindAsObject(firebase.database().ref(`playerSettings/${userID}`), "playerSettings", error => {
      console.log(error);
      this.setState({ playerSettings: undefined });
    });
    this.bindAsObject(firebase.database().ref(`playerSecrets/${userID}`), "playerSecrets", error => {
      console.log(error);
      this.setState({ playerSecrets: undefined });
    });

    this.bindAsObject(firebase.database().ref(`players/${userID}/state`), "player", error => {
      console.log(error);
      this.setState({ player: undefined });
    });
  };

  render() {
    const player = this.state.player;
    const playerSettings = this.state.playerSettings || {};
    const playerSecrets = this.state.playerSecrets || {};

    const meleeRange = (player && player.meleeRange) || 0;
    const rangedRange = (player && player.rangedRange) || 0;

    this.props.setUserRanges(meleeRange, rangedRange);

    if (player) {
      return (
        <div id="user">
          <UserBody
            userID={this.props.userID}
            setWorldAttributes={this.props.setWorldAttributes}
            meleeRange={meleeRange}
            rangedRange={rangedRange}
          />

          <div id="userCenterer">
            <style jsx>
              {
                `
              #userCenterer {
                position: fixed;
                left: 50%; top: 50%;
                transform: ${transform};
              }
            `
              }
            </style>

            <Player {...player} isSelf={true} />

            <Reticle size={10} hideBorders>
              <RangeIndicator range={meleeRange} />
              <RangeIndicator range={rangedRange} />
            </Reticle>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

reactMixin(UserState.prototype, reactFire);
