import React, { Component } from "react";
import { Entity } from "aframe-react";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";

import Tile from "../components/Tile";

export default class TileContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    const {x,y} = {...this.props};
    this.bindFirebase(x,y);
  }

  componentWillReceiveProps(nextProps) {
    const {x,y} = {...this.props};
    const {xNext,yNext} = {...nextProps};
    const thisTile = [x,y];
    const nextTile = [xNext,yNext];

    if (thisTile !== nextTile) {
      if (this.state.tile) {
        this.unbind("tile");
      }

      this.bindFirebase(xNext,yNext);
    }
  }

  bindFirebase = (x,y) => {
    this.bindAsObject(
      firebase.database().ref(`locations/${x}/${y}`),
      "tile",
      (error) => {
        console.log("Player subscription cancelled:")
        console.log(error);
        this.setState({tile: undefined})
      }
    );
  }

  render() {
    return (
      <Tile
        {...this.state.tile}
        {...this.props}
      />
    );
  }
}

reactMixin(TileContainer.prototype, reactFire);
