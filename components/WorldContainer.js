import React, { PureComponent } from "react";
import { Loop, World } from "react-game-kit";

import Sectors from "../components/Sectors";
import User from "../components/User";

const maxScale = 10;
const minScale = 1;

export default class WorldContainer extends PureComponent {
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userID !== nextProps.userID) {
      if (this.props.userID) {
        this.unbind("sectorID");
      }

      if (nextProps.userID) {
        this.bindFirebase(nextProps.userID);
      }
    }
  }

  handleScroll = () => {
    requestAnimationFrame(this.updateScale);
  }

  updateScale = () => {
    const scrolled = 1 - (window.pageYOffset / (document.body.clientHeight - window.innerHeight));
    const scale = scrolled * (maxScale - minScale) + minScale;
    this.worldRef.style.setProperty("--worldScale", `${scale}`);
  }

  handleWorldInit = (engine) => {
    // engine.enableSleeping = true;
  }

  render() {
    return (
      <div id="world" ref={c => this.worldRef = c}>
        <style jsx>{`
          #world {
            user-select: none;
            pointer-events: none;
            width: 100%;
            height: 100vh;
            margin-bottom: 50vh;
            --userPositionX: 0;
            --userPositionY: 0;
            --userAngle: 0rad;
            --worldScale: ${maxScale};
          }
        `}</style>
        <Loop>
          <World gravity={{ x: 0, y: 0, }} onInit={this.handleWorldInit}>
            <User {...this.props} />
            <Sectors {...this.props} />
          </World>
        </Loop>
      </div>
    );
  }
}
