import React, { Component } from "react";
import { Entity } from "aframe-react";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";

import Tile from "../components/Tile";

export default class Location extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.bindFirebase(this.props.x, this.props.y);
  }

  componentDidUpdate(nextProps, nextState) {
    if (this.state.location && nextState.location !== this.state.location) {
      this.props.saveLocation(this.state.location);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { x, y } = {...this.props};
    const savedLocation = nextProps.savedLocation;
    const xNext = nextProps.x;
    const yNext = nextProps.y;

    if (savedLocation) {
      this.unbindFirebase();
    }
    else {
      if (!this.firebaseListeners.location) {
        this.bindFirebase(xNext, yNext);
      }
    }
  }

  bindFirebase = (x, y) => {
    this.unbindFirebase();

    this.bindAsObject(
      firebase.database().ref(`locations/${x},${y}`),
      "location",
      (error) => {
        console.log("Location subscription cancelled:", error)
        this.unbindFirebase();
      }
    );
  }

  unbindFirebase = () => {
    if (this.firebaseListeners.location) {
      this.unbind("location");
    }
  }

  render() {
    if (this.props.savedLocation) {
      return (
        <Tile
          {...this.props}
          {...this.props.savedLocation}
        />
      );
    }
    else if (this.state.location) {
      return (
        <Tile
          {...this.props}
          {...this.state.location}
        />
      );
    }
    else {
      return null;
    }
  }
}

reactMixin(Location.prototype, reactFire);
