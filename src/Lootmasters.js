import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";
import { Entity } from "aframe-react";

import Rotator from "./Rotator";

export default class Lootmasters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lootmasters: undefined,
    }
  }

  componentDidMount() {
    this.bindFirebase();
  }

  bindFirebase() {
    this.bindAsArray(
      firebase.database().ref(`lootmasters`),
      "lootmasters",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({lootmasters: undefined})
      }.bind(this)
    );
  }

  render() {
    const lootmasters = this.state.lootmasters;

    return (
      <Rotator rotation={[15, 0, 0]}>
        {lootmasters && lootmasters.map((lootmaster, index) => {
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

reactMixin(Lootmasters.prototype, ReactFire);
