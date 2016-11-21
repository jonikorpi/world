import React, { Component } from "react";
import { Entity } from "aframe-react";
import "aframe-look-at-billboard-component";
import "aframe-faceset-component";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";

export default class Location extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const {x,y,z} = {...this.props};
    this.bindFirebase(x,y,z);
  }

  componentWillReceiveProps(nextProps) {
    const {x,y,z} = {...this.props};
    const {xNext,yNext,zNext} = {...nextProps};
    const thisLocation = [x,y,z];
    const nextLocation = [xNext,yNext,zNext];

    if (thisLocation !== nextLocation) {
      if (this.state.location) {
        this.unbind("location");
      }

      this.bindFirebase(xNext,yNext,zNext);
    }
  }

  bindFirebase = (x,y,z) => {
    this.bindAsObject(
      firebase.database().ref(`locations/${x}/${y}/${z}`),
      "location",
      (error) => {
        console.log("Player subscription cancelled:")
        console.log(error);
        this.setState({location: undefined})
      }
    );
  }

  handleStateEvent = (event) => {
    const name = event.detail.state;
    const type = event.type;
    // let boolean;
    //
    // switch (type) {
    //   case "stateadded":
    //     boolean = true;
    //     break;
    //   case "stateremoved":
    //     boolean = false;
    //     break;
    //   default:
    //     console.log("Bad state event in Button");
    //     return;
    // }
    //
    // if (name && type && this._reactInternalInstance) {
    //   this.setState({[name]: boolean});
    // }

    if (!this.props.isActive && type === "stateadded" && name === "cursor-hovered") {
      this.props.setActiveTileID(this.props.x, this.props.y, this.props.z);
    }
  }

  handleClick = (event) => {
    console.log(event);
  }

  render() {
    const {x,y,z} = {...this.props};
    const isActive = this.props.isActive;
    const tileSize = this.props.tileSize;
    const dotSize = 0.05;
    const hasObject = this.state.location && this.state.location.object;

    const position = [
      x * tileSize,
      y * tileSize,
      z * tileSize,
    ];

    return (
      <Entity
        id={this.props.id}
        className="tile"
      >
        {hasObject && (
          <Entity
            className="interactable"
            geometry={{
              primitive: "box",
              width: dotSize,
              height: dotSize,
              depth: dotSize,
              buffer: false,
              skipCache: true,
              mergeTo: "#dot",
            }}
            position={position}
            onStateadded={this.handleStateEvent}
            onClick={this.handleClick}
            // onStateremoved={this.handleStateEvent.bind(this)}
          />
        )}

        {isActive && (
          <Entity
            geometry={{
              primitive: "box",
              width: tileSize,
              height: tileSize,
              depth: tileSize,
            }}
            material={{
              shader: "flat",
              color: "grey",
              side: "back",
            }}
            position={position}
            // billboard
          />
        )}
      </Entity>
    );
  }
}

reactMixin(Location.prototype, reactFire);
