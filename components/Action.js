import React, { PureComponent } from "react";
import "whatwg-fetch";

const version = process && process.env && process.env.GAME_VERSION;

export default class Action extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleStateEvent = event => {
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
      case "mouseenter":
        boolean = true;
        break;
      case "mouseleave":
        boolean = false;
        break;
      default:
        console.log("Bad state event in Button");
        return;
    }

    if (name && type && this._reactInternalInstance) {
      this.setState({ [name]: boolean });
    }
  };

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
    this.setState({
      started: Date.now(),
      status: "processing",
    });

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
      message && console.log(message);

      if (this.mounted) {
        this.setState({
          status: "success",
          message: message,
        });
      }
    } else if (this.mounted) {
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
      this.timer = setTimeout(this.clearAction, 3000);
    }
  };

  clearAction = () => {
    if (this.mounted) {
      this.setState({
        message: undefined,
        status: undefined,
      });
    }
  };

  render() {
    const hovered = this.state["cursor-hovered"];

    let hue = 0, saturation = 50, lightness = 50, opacity = 0;

    switch (this.state.status) {
      case "processing":
        hue = 50;
        break;
      case "success":
        hue = 280;
        break;
      case "error":
        hue = 0;
        break;
      default:
        saturation = 0;
        lightness = 0;
    }

    if (hovered) {
      opacity = 1;
    }
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    const texts = {
      spawn: "Click here to spawn.",
      move: "Click here to move.\nBeware: it’s buggy.",
      endTurn: "Clicking this does nothing. :)",
    };

    return (
      <button className="action" onClick={this.processAction}>
        <style jsx>{`
          .action {
            pointer-events: all;
          }
        `}</style>
        {this.props.data.action}
      </button>
    );
  }
}
