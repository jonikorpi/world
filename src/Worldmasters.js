import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";
import { Entity } from "aframe-react";

import Rotator from "./Rotator";

export default class Worldmasters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      worldmasters: undefined,
    }
  }

  componentDidMount() {
    this.bindFirebase();
  }

  bindFirebase() {
    this.bindAsArray(
      firebase.database().ref(`worldmasters`),
      "worldmasters",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({worldmasters: undefined})
      }.bind(this)
    );
  }

  render() {
    const worldmasters = this.state.worldmasters;

    return (
      <Rotator rotation={[15, 0, 0]}>
        {worldmasters && worldmasters.map((worldmaster, index) => {
          return (
            <Entity
              key={index}
              geometry={{
                primitive: "circle",
                radius: 0.05,
                segments: 3,
              }}
              material={{
                shader: "flat",
                color: "white",
              }}
              rotation={[0, 0, 90]}
              position={[
                0.75 * index,
                1,
                0,
              ]}
            />
          )
        })}
      </Rotator>
    );
  }
}

reactMixin(Worldmasters.prototype, ReactFire);
