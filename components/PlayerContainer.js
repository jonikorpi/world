import React, { Component } from "react";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";

import Hero from "../components/Hero";
import Action from "../components/Action";

export default class PlayerContainer extends Component {
  componentWillMount() {
    this.bindFirebase(this.props.playerID);
  }

  bindFirebase = (playerID) => {
    this.unbindFirebase();

    this.bindAsObject(
      firebase.database().ref(`heroes/${playerID}`),
      "hero",
      (error) => {
        this.props.unmountHero(playerID);
      }
    );
  }

  unbindFirebase = () => {
    this.firebaseListeners.hero && this.unbind("hero");
  }

  render() {
    const { playerID } = {...this.props};
    const hero = this.state.hero;

    if (!hero) {
      return null;
    }

    return (
      <Hero {...hero}>
        <Action
          data={{
            action: "attack",
            playerID: playerID
          }}
          {...this.props}
        />
      </Hero>
    );
  }
}

reactMixin(PlayerContainer.prototype, reactFire);
