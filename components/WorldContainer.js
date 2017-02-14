import React, { PureComponent } from "react";

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

    return (
      <div
        id="world"
      >
        {this.props.children}

        {/*{locations.map((locationID) => {
          const coordinates = locationID.split(",");
          return (
            <Location
              key={locationID}
              locationID={locationID}
              userID={this.props.userID}
              userToken={this.props.userToken}
              x={+coordinates[0]}
              y={+coordinates[1]}
              synth={this.props.synth}
              mountHero={this.mountHero}
            />
          )
        })}*/}

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
      </div>
    );
  }
}
