import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";

import Tile from "../components/Tile";
import Player from "../components/Player";

export default class Location extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    if (this.props.visible) {
      this.bindFirebase(this.props.x, this.props.y);
    }
  }

  componentDidUpdate() {
    if (this.props.visible) {
      sessionStorage.setItem(this.props.locationID, JSON.stringify(this.state.location));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { x, y } = {...this.props};
    const visible = nextProps.visible;
    const xNext = nextProps.x;
    const yNext = nextProps.y;

    if (!visible) {
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
    this.firebaseListeners.location && this.unbind("location");
  }

  render() {
    const { visible, locationID, userID } = {...this.props};

    let state = {};
    state = visible ? this.state.location : JSON.parse(sessionStorage.getItem(locationID));

    if (state) {
      return (
        <a-entity class="location">
          <Tile
            {...this.props}
            {...state}
          />

          {visible && state.playerID && state.playerID !== userID && (
            <Player
              {...this.props}
              playerID={state.playerID}
            />
          )}
        </a-entity>
      );
    }
    else {
      return null;
    }
  }
}

reactMixin(Location.prototype, reactFire);
