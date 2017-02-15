import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import Limbo from "../components/Limbo";
import Sectors from "../components/Sectors";
import User from "../components/User";

const maxScale = 10;
const minScale = 1;

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

  handleScroll = (event) => {
    const scrolled = 1 - (window.pageYOffset / (document.body.clientHeight - window.innerHeight));
    const scale = scrolled * (maxScale - minScale) + minScale;
    this.worldRef.style.setProperty("--worldScale", `${scale}vmin`);
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
              --worldScale: ${maxScale}vmin;
            }
          `}</style>
          <User {...this.props} />
          <Sectors {...this.props} sectorID={sectorID} />
        </div>
      );
    } else {
      return <Limbo {...this.props} />;
    }
  }
}

reactMixin(Lobby.prototype, reactFire);
