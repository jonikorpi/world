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
    const { centerOn, userHeight, groundLevel, locations } = {...this.props};
    const heroes = this.state;

    const userLocation = locations[0];
    const visibility = 3;
    const centerOnArray = centerOn.split(",");
    const centerOnX = +centerOnArray[0];
    const centerOnY = +centerOnArray[1];

    const currentPosition = [
      -centerOnX * hex.size * 3/2,
      userHeight + groundLevel,
      -hex.size * Math.sqrt(3) * (centerOnY + centerOnX/2),
    ];

    return (
      <Entity
        id="world"
        {...{[`animation__${centerOnX}-${centerOnY}`]: {
          property: "position",
          to: `${currentPosition[0]} ${currentPosition[1]} ${currentPosition[2]}`,
          easing: "easeInOutQuad",
          dur: 2000,
        }}}
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
