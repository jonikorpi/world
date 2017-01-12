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
    const { x,y } = {...this.props};

    if (x && y) {
      this.bindFirebase(x,y);
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   const { x,y } = {...this.props};
  //   const { xNext,yNext } = {...nextProps};
  //   const thisLocation = [x,y];
  //   const nextLocation = [xNext,yNext];
  //
  //   if (thisLocation !== nextLocation) {
  //     this.bindFirebase(xNext,yNext);
  //   }
  // }

  // componentDidUpdate() {
  //   console.log("Location updated");
  // }
  //
  // componentWillUnmount() {
  //   console.log("Location unmounting");
  // }
  //
  // componentDidMount() {
  //   console.log("Location mounted");
  // }

  bindFirebase = (x,y) => {
    if (this.state.location) {
      this.unbind("location");
    }

    this.bindAsObject(
      firebase.database().ref(`locations/${x}/${y}`),
      "location",
      (error) => {
        console.log("Player subscription cancelled:")
        console.log(error);
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
      return this.props.children;
    }
  }
}

reactMixin(Location.prototype, reactFire);
