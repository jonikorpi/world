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

  componentWillMount() {
    const {x,y} = {...this.props};
    this.bindFirebase(x,y);
  }

  componentWillReceiveProps(nextProps) {
    const {x,y} = {...this.props};
    const {xNext,yNext} = {...nextProps};
    const thisLocation = [x,y];
    const nextLocation = [xNext,yNext];

    if (thisLocation !== nextLocation) {
      if (this.state.location) {
        this.unbind("location");
      }

      this.bindFirebase(xNext,yNext);
    }
  }

  bindFirebase = (x,y) => {
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

  handleStateEvent = (event) => {
    console.log(event);
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
      this.props.setActiveTileID(this.props.x, this.props.y);
    }
  }

  handleClick = (event) => {
    console.log(event);
  }

  render() {
    const {x,y} = {...this.props};
    const isActive = this.props.isActive;
    const tileSize = this.props.tileSize;
    const dotSize = 0.1;
    const hasObject = this.state.location && this.state.location.object;

    const position = [
      x * tileSize,
      0,
      y * tileSize,
    ];

    return (
      <Entity
        id={this.props.id}
        className="tile"
        position={position}
      >
        {hasObject && (
          <Entity
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
          />
        )}

        <Entity
          className="interactable"
          geometry={{
            primitive: "plane",
            width: tileSize,
            height: tileSize,
          }}
          material={{
            transparent: true,
            opacity: isActive ? 1 : 0.1,
            color: "yellow",
          }}
          rotation={[-90, 0, 0]}
          events={{
            click: this.handleClick,
            stateadded: this.handleStateEvent,
            stateremoved: this.handleStateEvent,
          }}
        />

        {isActive && (
          <Entity
            geometry={{
              primitive: "plane",
              width: tileSize,
              height: tileSize,
            }}
            material={{
              shader: "flat",
              color: "grey",
              side: "back",
            }}
            billboard
          />
        )}
      </Entity>
    );
  }
}

reactMixin(Location.prototype, reactFire);
