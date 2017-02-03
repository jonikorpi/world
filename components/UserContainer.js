import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import hex from "../helpers/hex";

import Limbo from "../components/Limbo";
import WorldContainer from "../components/WorldContainer";
import Hero from "../components/Hero";
import Action from "../components/Action";
import HeroPanel from "../components/HeroPanel";

export default class UserContainer extends Component {
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
        this.unbind("hero");
        this.unbind("playerSecrets");
        this.unbind("playerSettings");
      }

      if (nextProps.userID) {
        this.bindFirebase(nextProps.userID);
      }
    }
  }

  bindFirebase = (userID) => {
    this.bindAsObject(
      firebase.database().ref(`playerSettings/${userID}`),
      "playerSettings",
      (error) => {
        console.log(error);
        this.setState({playerSettings: undefined})
      }
    );
    this.bindAsObject(
      firebase.database().ref(`playerSecrets/${userID}`),
      "playerSecrets",
      (error) => {
        console.log(error);
        this.setState({playerSecrets: undefined})
      }
    );

    this.bindAsObject(
      firebase.database().ref(`heroes/${userID}`),
      "hero",
      (error) => {
        console.log(error);
        this.setState({hero: undefined})
      }
    );
  }

  getLocations = (secretLocation) => {
    let locations = { [secretLocation]: true };

    for (const neighbourID of hex.listNeighbouringTiles(secretLocation, 16)) {
      locations[neighbourID] = true;
    }

    return locations;
  }

  render() {
    const hero = this.state.hero;
    const playerSettings = this.state.playerSettings;
    const playerSecrets = this.state.playerSecrets || {};

    const hasLocation = hero && typeof hero.x === "number" && typeof hero.y === "number";
    const secretLocation = hasLocation && `${hero.x},${hero.y}`;
    const locations = secretLocation ? Object.keys(this.getLocations(secretLocation)) : [];

    if (hero && hasLocation) {
      return (
        <a-entity>
          <WorldContainer
            {...this.props}
            locations={locations}
            centerOn={secretLocation}
          />

          <Hero {...hero} isSelf={true}>
            <Action
              data={{ action: "endTurn" }}
              {...this.props}
            />

            <HeroPanel
              {...hero}
              {...playerSecrets}
            />
          </Hero>
        </a-entity>
      );
    }
    else if (playerSettings) {
      return <Limbo {...this.props}/>
    }
    else {
      return null;
    }
  }
}

reactMixin(UserContainer.prototype, reactFire);
