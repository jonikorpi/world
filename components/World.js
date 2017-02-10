import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import hex from "../helpers/hex";

import Camera from "../components/Camera";
import WorldContainer from "../components/WorldContainer";
import Hero from "../components/Hero";
import Action from "../components/Action";
import HeroPanel from "../components/HeroPanel";
import Assets from "../components/Assets";

export default class World extends Component {
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
    let centerPosition = [0,0,0];

    if (hasLocation) {
      const centerPositionArray = secretLocation.split(",");
      const centerCoordinates = [
        +centerPositionArray[0],
        +centerPositionArray[1],
      ];
      centerPosition = [
        -centerCoordinates[0] * hex.size * 3/2,
        0,
        -hex.size * Math.sqrt(3) * (centerCoordinates[1] + centerCoordinates[0]/2),
      ];
    }

    return (
      <a-entity id="world">
        <Camera
          inVR={this.props.inVR}
          mouseLock={this.props.mouseLock}
        />

        <WorldContainer
          {...this.props}
          locations={locations}
          centerPosition={centerPosition}
        >
          <Assets/>
          <Hero {...hero} isSelf={true} centerPosition={centerPosition}>
            <Action
              data={{ action: "endTurn" }}
              {...this.props}
            />
          </Hero>
        </WorldContainer>

        <HeroPanel
          {...hero}
          {...playerSecrets}
        />
      </a-entity>
    );
  }
}

reactMixin(World.prototype, reactFire);
