import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";

import Location from "../components/Location";
import PlayerContainer from "../components/PlayerContainer";

export default class WorldContainer extends PureComponent {
  mountHero = (playerID) => {
    if (!this.state[playerID]) {
      this.setState({ [playerID]: true });
    }
  }

  unmountHero = (playerID) => {
    this.setState({ [playerID]: undefined });
  }

  render() {
    const { centerPosition, locations } = {...this.props};
    const heroes = this.state;

    const userLocation = locations[0];
    const visibility = 3;

    return (
      <Entity
        id="world"
        position={centerPosition}
        lerp={{
          duration: 1000,
        }}
      >
        {this.props.children}

        {locations.map((locationID) => {
          const coordinates = locationID.split(",");
          return (
            <Location
              key={locationID}
              locationID={locationID}
              userID={this.props.userID}
              userToken={this.props.userToken}
              x={+coordinates[0]}
              y={+coordinates[1]}
              visible={hex.distanceBetween(locationID, userLocation) <= visibility}
              synth={this.props.synth}
              mountHero={this.mountHero}
            />
          )
        })}

        {heroes && Object.keys(heroes).map((playerID) => {
          return (
            <PlayerContainer
              key={playerID}
              playerID={playerID}
              userID={this.props.userID}
              userToken={this.props.userToken}
              unmountHero={this.unmountHero}
            />
          )
        })}
      </Entity>
    );
  }
}
