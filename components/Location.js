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
    const { x, y } = {...this.props};

    if (x && y) {
      this.bindFirebase(x, y);
    }
  }

  componentDidUpdate(nextProps, nextState) {
    if (nextState.location !== this.state.location && this.state.location) {
      console.log("Saving", this.state.location);
      this.props.saveLocation(this.state.location);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { x, y } = {...this.props};
    const savedLocation = nextProps.savedLocation;
    const xNext = nextProps.x;
    const yNext = nextProps.y;

    if (!savedLocation) {
      if (x !== xNext || y !== yNext) {
        this.bindFirebase(xNext, yNext);
      }
    }
    else {
      this.unbindFirebase();
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
    if (this.state.location) {
      this.unbind("location");
      this.setState({location: undefined});
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
    else {
      return (
        <Tile
          {...this.props}
          {...this.state.location}
        />
      );
    }
  }
}

reactMixin(Location.prototype, reactFire);
