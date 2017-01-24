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
      sessionStorage.setItem(this.props.locationID, JSON.stringify(this.state));
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
      if (!this.firebaseListeners.tile && !this.firebaseListeners.player) {
        this.bindFirebase(xNext, yNext);
      }
    }
  }

  bindFirebase = (x, y) => {
    this.unbindFirebase();

    this.bindAsObject(
      firebase.database().ref(`locations/${x},${y}/tile`),
      "tile",
      (error) => {
        console.log("Location subscription cancelled:", error)
        this.unbindFirebase();
      }
    );

    this.bindAsObject(
      firebase.database().ref(`locations/${x},${y}/player`),
      "player",
      (error) => {
        console.log("Location subscription cancelled:", error)
        this.unbindFirebase();
      }
    );
  }

  unbindFirebase = () => {
    this.firebaseListeners.tile && this.unbind("tile");
    this.firebaseListeners.player && this.unbind("player");
  }

  render() {
    const { visible, locationID } = {...this.props};

    let state = {};
    state = visible ? this.state : JSON.parse(sessionStorage.getItem(locationID));

    const tileProps = state && state.tile && {...state.tile};
    const playerProps = state && state.player && {...state.player};

    if (tileProps || playerProps) {
      return (
        <a-entity class="location">
          {tileProps && (
            <Tile
              {...this.props}
              {...tileProps}
            />
          )}

          {playerProps && playerProps.playerID && (
            <Player
              {...this.props}
              {...playerProps}
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
