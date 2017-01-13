import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";

import Tile from "../components/Tile";

export default class Location extends PureComponent {
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

  // Warning: broken
  // componentWillReceiveProps(nextProps) {
  //   const { x, y } = {...this.props};
  //   const { xNext, yNext } = {...nextProps};
  //
  //   if (x !== xNext || y !== yNext) {
  //     this.bindFirebase(xNext, yNext);
  //   }
  // }

  bindFirebase = (x, y) => {
    if (this.state.location) {
      this.unbind("location");
    }

    this.bindAsObject(
      firebase.database().ref(`locations/${x},${y}`),
      "location",
      (error) => {
        console.log("Location subscription cancelled:", error)
        this.setState({location: undefined})
      }
    );
  }

  render() {
    if (this.state.location) {
      return (
        <Tile
          {...this.state.location}
          {...this.props}
        />
      );
    }
    else {
      return null;
    }
  }
}

reactMixin(Location.prototype, reactFire);
