import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";

import Button from "../components/Button";
import Request from "../components/Request";

export default class Limbo extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      requests: [],
    };
  }

  spawn = (x, y) => {
    const request = [{
      id: Date.now(),
      token: this.props.userToken,
      userID: this.props.userID,
      action: "spawn",
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
    const {
      x, y,
      userID,
      playerID, locked, immuneUntil, type, turn, emote, action, health, attack,
    } = {...this.props};

    const requests = this.state.requests;

    return (
      <Entity>
        {requests.length === 0 && (
          <Button
            onClick={this.spawn}
            color="green"
            position={[0, 1, -2]}
          />
        )}

        {requests && requests.map((request) => {
          return (
            <Request
              key={request.id}
              request={request}
              removeRequest={this.removeRequest}
            />
          );
        })}
      </Entity>
    );
  }
}
