import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import { Loop, World } from "react-game-kit";

import Limbo from "../components/Limbo";
import Sectors from "../components/Sectors";
import User from "../components/User";

const maxScale = 1;
const minScale = 0.1;

export default class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    if (this.props.userID) {
      this.bindFirebase(this.props.userID);
    }
  }

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

  bindFirebase = userID => {
    this.bindAsObject(firebase.database().ref(`players/${userID}/sectorID`), "sectorID", error => {
      console.log(error);
      this.setState({ sectorID: undefined });
    });
  };

  render() {
    const sectorID = this.state.sectorID && this.state.sectorID[".value"];

    if (sectorID) {
      return (
        <div id="world" ref={c => this.worldRef = c}>
          <style jsx>{`
            #world {
              user-select: none;
              pointer-events: none;
              width: 100%;
              height: 100vh;
              margin-bottom: 50vh;
              --playerPositionX: 0;
              --playerPositionY: 0;
              --worldScale: ${maxScale};
            }
          `}</style>
          <Loop>
            <World gravity={{ x: 0, y: 0, }}>
              <User {...this.props} />
              <Sectors {...this.props} sectorID={sectorID} />
            </World>
          </Loop>
        </div>
      );
    } else {
      return <Limbo {...this.props} />;
    }
  }
}

reactMixin(Lobby.prototype, reactFire);
