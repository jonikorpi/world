import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";

import Tile from "../components/Tile";
import Unit from "../components/Unit";

export default class Location extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.bindFirebase(this.props.x, this.props.y);
  }

  componentDidUpdate(previousProps, previousState) {
    if (this.state.tile && !this.props.savedLocation) {
      this.props.saveLocation(this.props.x, this.props.y, this.state.tile);
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
      if (!this.firebaseListeners.tile && !this.firebaseListeners.unit) {
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
      firebase.database().ref(`locations/${x},${y}/unit`),
      "unit",
      (error) => {
        console.log("Location subscription cancelled:", error)
        this.unbindFirebase();
      }
    );
  }

  unbindFirebase = () => {
    this.firebaseListeners.tile && this.unbind("tile");
    this.firebaseListeners.unit && this.unbind("unit");
  }

  render() {
    const { savedLocation, ...otherProps } = {...this.props};
    const tileProps = savedLocation ? {...savedLocation} : {...this.state.tile};
    const hasUnit = this.state.unit && this.state.unit.ownerID;

    return (
      <a-entity class="location">
        <Tile
          {...otherProps}
          {...tileProps}
          isVisible={savedLocation ? false : true}
        />

        {hasUnit && (
          <Unit
            {...otherProps}
            {...this.state.unit}
          />
        )}
      </a-entity>
    );
  }
}

reactMixin(Location.prototype, reactFire);
