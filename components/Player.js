import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";

import hex from "../helpers/hex";

import Button from "../components/Button";
import Request from "../components/Request";

export default class Player extends PureComponent {
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
      firebase.database().ref(`players/${playerID}`),
      "player",
      (error) => {
        console.log("Location subscription cancelled:", error)
        this.unbindFirebase();
      }
    );
  }

  unbindFirebase = () => {
    this.firebaseListeners.player && this.unbind("player");
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

  moveNorth = () =>     { this.move(this.state.player.x, this.state.player.y-1); }
  moveSouth = () =>     { this.move(this.state.player.x, this.state.player.y+1); }
  moveNorthWest = () => { this.move(this.state.player.x-1, this.state.player.y); }
  moveSouthEast = () => { this.move(this.state.player.x+1, this.state.player.y); }
  moveNorthEast = () => { this.move(this.state.player.x+1, this.state.player.y-1); }
  moveSouthWest = () => { this.move(this.state.player.x-1, this.state.player.y+1); }

  move = (x, y) => {
    const request = [{
      id: Date.now(),
      token: this.props.userToken,
      userID: this.props.userID,
      action: "move",
      from: [this.props.x, this.props.y],
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
    const player = this.state.player;
    const requests = this.state.requests;
    const isSelf = userID === playerID;

    const x = player.x || 0;
    const y = player.y || 0;

    const position = !player ? [0,0,0] : [
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
          color: player ? (isSelf ? "green" : "red") : "grey",
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

reactMixin(Player.prototype, reactFire);
