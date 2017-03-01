import React, { PureComponent } from "react";
import { Loop, World } from "react-game-kit";

import Sectors from "../components/Sectors";
import UserState from "../components/UserState";

const maxScale = 0.5;
const minScale = maxScale / 10;

export default class WorldContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      userMeleeRange: 0,
      userRangedRange: 0,
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    requestAnimationFrame(this.updateScale);
  };

  updateScale = () => {
    const scrolled = 1 - window.pageYOffset / (document.body.clientHeight - window.innerHeight);
    const scale = scrolled * (maxScale - minScale) + minScale;
    this.setWorldAttributes({ "--worldScale": scale });
  };

  setWorldAttributes = attributes => {
    if (this.worldRef) {
      Object.keys(attributes).map(prop => {
        return this.worldRef.style.setProperty(prop, attributes[prop]);
      });
    }
  };

  setUserRanges = (melee, ranged) => {
    this.setState({
      userMeleeRange: melee,
      userRangedRange: ranged,
    });
  };

  handleWorldInit = engine => {
    // engine.enableSleeping = true;
  };

  render() {
    return (
      <div id="world" ref={c => this.worldRef = c}>
        <style jsx>
          {
            `
          #world {
            user-select: none;
            pointer-events: none;
            width: 100%;
            height: 100vh;
            margin-bottom: 50vh;
            --userPositionX: 0;
            --userPositionY: 0;
            --playerVelocity: 0;
            --playerAngle: 0rad;
            --worldScale: ${maxScale};
          }
        `
          }
        </style>
        <Loop>
          <World gravity={{ x: 0, y: 0 }} onInit={this.handleWorldInit}>
            <UserState
              userID={this.props.userID}
              userToken={this.props.userToken}
              setWorldAttributes={this.setWorldAttributes}
              setUserRanges={this.setUserRanges}
            />

            <Sectors
              setWorldAttributes={this.setWorldAttributes}
              userID={this.props.userID}
              userToken={this.props.userToken}
              sectorID={this.props.sectorID}
              {...this.state}
            />
          </World>
        </Loop>
      </div>
    );
  }
}
