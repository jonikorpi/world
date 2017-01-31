import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import "whatwg-fetch";

import hex from "../helpers/hex";

import Tooltip from "../components/Tooltip";

const version = process && process.env && process.env.GAME_VERSION;

export default class Action extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleStateEvent = (event) => {
    const name = event.detail.state;
    const type = event.type;
    let boolean;

    switch (type) {
      case "stateadded":
        boolean = true;
        break;
      case "stateremoved":
        boolean = false;
        break;
      default:
        console.log("Bad state event in Button");
        return;
    }

    if (name && type && this._reactInternalInstance) {
      this.setState({[name]: boolean});
    }
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;

    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  processAction = async () => {
    this.setState({ started: Date.now() });

    const headers = new Headers({
      "Content-Type": "application/json",
    });

    const response = await fetch("/", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        version: version,
        token: this.props.userToken,
        userID: this.props.userID,
        ...this.props.data,
      }),
    });

    console.log((Date.now() - this.state.started) / 1000, "seconds for", this.props.data);

    if (response.ok && this.mounted) {
      const message = await response.text();
      message && console.log(message)

      if (this.mounted) {
        this.setState({
          status: "success",
          message: message,
        });
      }
    }
    else if (this.mounted) {
      const error = await response.text();

      if (this.mounted) {
        this.setState({
          status: "error",
          message: error,
        });

        console.log(error);

        if (error === "Client is outdated. Refreshing!") {
          window.location.reload(true);
        }
      }
    }

    if (this.mounted) {
      this.timer = setTimeout(
        this.clearAction,
        3000,
      );
    }
  }

  clearAction = () => {
    if (this.mounted) {
      this.setState({
        message: undefined,
        status: undefined,
      })
    }
  }

  render() {
    const hovered = this.state["cursor-hovered"];

    let hue;
    switch (this.state.status) {
      case "success":
        hue = 280;
        break;
      case "error":
        hue = 0;
        break;
      default:
        hue = 200;
    }

    const lightness = hovered ? 85 : 50;
    const color = `hsl(${hue}, 50%, ${lightness}%)`;

    return (
      <a-entity className="action">
        <Entity
          className="interactable"
          geometry={{
            primitive: "circle",
            segments: 6,
            radius: hex.size,
          }}
          rotation={[-90, 0, 0]}
          position={[0, 0.01, 0]}
          material={{
            shader: "flat",
            transparent: true,
            opacity: 0,
          }}
          events={{
            click: this.processAction,
            stateadded: this.handleStateEvent,
            stateremoved: this.handleStateEvent,
          }}
        />

        <Entity
          geometry={{
            primitive: "ring",
            segmentsTheta: 6,
            radiusOuter: hex.size,
            radiusInner: hex.size * 0.91,
          }}
          rotation={[-90, 0, 0]}
          position={[0, 0.01, 0]}
          material={{
            shader: "flat",
            color: color,
          }}
        />

        {hovered && this.props.data.action === "action" && (
          <Tooltip/>
        )}
      </a-entity>
    );
  }
}
