import React, { Component } from "react";
import { Entity } from "aframe-react";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";

import hex from "../helpers/hex";

import Button from "../components/Button";
import Request from "../components/Request";

export default class Hero extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requests: [],
    };
  }

  componentWillMount() {
    this.bindFirebase(this.props.playerID);
  }

  bindFirebase = (playerID) => {
    this.unbindFirebase();

    this.bindAsObject(
      firebase.database().ref(`heroes/${playerID}`),
      "hero",
      (error) => {
        console.log("Location subscription cancelled:", error)
        this.unbindFirebase();
      }
    );
  }

  unbindFirebase = () => {
    this.firebaseListeners.hero && this.unbind("hero");
  }

  // componentDidMount() {
  //   const isOwnUnit = this.props.userID === this.props.unit.userID;
  //
  //   this.props.synth.triggerAttackRelease(isOwnUnit ? "C6" : "E6", "8n");
  // }
  //
  // componentWillUnmount() {
  //   const isOwnUnit = this.props.userID === this.props.unit.userID;
  //
  //   this.props.synth.triggerAttackRelease(isOwnUnit ? "C4" : "E4", "4n");
  // }

  moveNorth = () =>     { this.move(this.state.hero.x, this.state.hero.y-1); }
  moveSouth = () =>     { this.move(this.state.hero.x, this.state.hero.y+1); }
  moveNorthWest = () => { this.move(this.state.hero.x-1, this.state.hero.y); }
  moveSouthEast = () => { this.move(this.state.hero.x+1, this.state.hero.y); }
  moveNorthEast = () => { this.move(this.state.hero.x+1, this.state.hero.y-1); }
  moveSouthWest = () => { this.move(this.state.hero.x-1, this.state.hero.y+1); }

  move = (x, y) => {
    const request = [{
      id: Date.now(),
      token: this.props.userToken,
      userID: this.props.userID,
      action: "move",
      from: [this.state.hero.x, this.state.hero.y],
      to: [x, y],
    }];

    this.setState({
      requests: this.state.requests.concat(request),
    })
  }

  removeRequest = (id) => {
    const requests = this.state.requests.filter((request) => {
      return !request.id === id;
    });

    this.setState({
      requests: requests,
    });
  }

  render() {
    const { userID, playerID } = {...this.props};
    const hero = this.state.hero;
    const requests = this.state.requests;
    const isSelf = userID === playerID;

    const x = hero && hero.x || 0;
    const y = hero && hero.y || 0;

    const position = !hero ? [0,0,0] : [
      x * hex.size * 3/2,
      0,
      hex.size * Math.sqrt(3) * (y + x/2),
    ];

    return (
      <Entity
        className="unit"
        geometry={{
          primitive: "box",
          width: hex.width * 0.236,
          depth: hex.width * 0.5,
          height: hex.width * 0.236,
        }}
        position={position}
        material={{
          shader: "flat",
          color: hero ? (isSelf ? "green" : "red") : "grey",
        }}
      >
        {requests && requests.map((request) => {
          return (
            <Request
              key={request.id}
              request={request}
              removeRequest={this.removeRequest}
            />
          );
        })}

        {isSelf &&
          <Entity>
            <Button
              onClick={this.moveNorth}
              color="red"
              position={[0, 1, -hex.width]}
            />
            <Button
              onClick={this.moveSouth}
              color="grey"
              position={[0, 1, hex.width]}
            />

            <Button
              onClick={this.moveNorthWest}
              color="grey"
              position={[-1, 1, -hex.width*0.5]}
            />
            <Button
              onClick={this.moveNorthEast}
              color="grey"
              position={[1, 1, -hex.width*0.5]}
            />

            <Button
              onClick={this.moveSouthWest}
              color="grey"
              position={[-1, 1, hex.width*0.5]}
            />
            <Button
              onClick={this.moveSouthEast}
              color="grey"
              position={[1, 1, hex.width*0.5]}
            />
          </Entity>
        }

      </Entity>
    );
  }
}

reactMixin(Hero.prototype, reactFire);
