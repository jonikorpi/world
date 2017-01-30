import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";

import Location from "../components/Location";
import PlayerContainer from "../components/PlayerContainer";

export default class WorldContainer extends PureComponent {
  mountHero = (playerID) => {
    this.setState({
      [playerID]: true
    });
  }

  unmountHero = (playerID) => {
    this.setState({
      [playerID]: undefined
    });
  }

  render() {
    const { centerOn, userHeight, seaLevel, locations } = {...this.props};
    const heroes = this.state;

    const userLocation = locations[0];
    const visibility = 3;
    const centerOnArray = centerOn.split(",");
    const centerOnX = +centerOnArray[0] + visibility / 1.5;
    const centerOnY = +centerOnArray[1] + visibility / 1.5;

    return (
      <Entity
        id="world"
        position={[
          -centerOnX * hex.size * 3/2,
          userHeight + seaLevel,
          -hex.size * Math.sqrt(3) * (centerOnY + centerOnX/2),
        ]}
      >
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

        {this.props.children}
      </Entity>
    );
  }
}
