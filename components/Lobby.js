import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import Limbo from "../components/Limbo";
import World from "../components/World";

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

  bindFirebase = (userID) => {
    this.bindAsObject(
      firebase.database().ref(`players/${userID}/sectorID`),
      "sectorID",
      (error) => {
        console.log(error);
        this.setState({ sectorID: undefined})
      }
    );
  }

  render() {
    const sectorID = this.state.sectorID && this.state.sectorID[".value"];

    if (sectorID) {
      return <World {...this.props} />;
    } else {
      return <Limbo {...this.props} />;
    };
  }
}

reactMixin(Lobby.prototype, reactFire);
