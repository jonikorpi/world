import React, { PureComponent } from "react";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";

import Tile from "../components/Tile";
import Action from "../components/Action";

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

  componentDidUpdate(previousProps, previousState) {
    if (this.props.visible && this.state.location) {
      sessionStorage.setItem(this.props.locationID, JSON.stringify(this.state.location));

      const playerID = this.state.location.playerID;
      // const previousPlayerID = previousState.location && previousState.location.playerID;
      const userID = this.props.userID;

      if (playerID && playerID !== userID/* && playerID !== previousPlayerID*/) {
        this.props.mountHero(playerID);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
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
    const { visible, locationID, x, y } = {...this.props};

    let state = {};
    state = visible ? this.state.location : JSON.parse(sessionStorage.getItem(locationID));

    if (state) {
      return (
        <Tile
          {...this.props}
          {...state}
        >
          {visible && this.state.location && !this.state.location.playerID && (
            <Action
              data={{
                action: "move",
                to: [x, y],
              }}
              {...this.props}
            />
          )}
        </Tile>
      );
    }
    else {
      return null;
    }
  }
}

reactMixin(Location.prototype, reactFire);
