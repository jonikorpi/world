import React, { Component } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";

export default class Request extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: "sending",
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.processRequest();
  }

  componentWillUnmount() {
    this.mounted = false;

    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  processRequest = async () => {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    const response = await fetch("/", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({...this.props.request}),
    });

    if (response.ok && this.mounted) {
      const message = await response.text();

      if (this.mounted) {
        this.setState({
          status: "success",
          message: message,
        });
      }
    }
    else if (this.mounted) {
      this.setState({
        status: "error",
        message: response,
      });

      console.log(response);
    }

    if (this.mounted) {
      this.timer = setTimeout(
        this.removeRequest,
        2000,
      );
    }
  }

  removeRequest = () => {
    if (this.mounted) {
      this.props.removeRequest(this.props.request.id)
    }
  }

  render() {
    let color;

    switch (this.state.status) {
      case "success":
        color = "green";
      case "error":
        color = "red";
      default:
        color = "cyan";
    }

    return (
      <Entity
        geometry={{
          primitive: "ring",
          radiusOuter: hex.width * 0.382,
          radiusInner: hex.width * 0.5,
        }}
        rotation={[90, 0, 0]}
        position={[0, 0.01, 0]}
        material={{
          shader: "flat",
          color: color,
        }}
      />
    );
  }
}
