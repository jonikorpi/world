import React, { PureComponent } from "react";
import "whatwg-fetch";

import colors from "../helpers/colors";

const version = process && process.env && process.env.GAME_VERSION;
const outlineSize = 2;

export default class Action extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
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
    let hue = 0, saturation = 50, lightness = 50;

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
        lightness = 100;
    }

    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    const texts = {
      spawn: "Spawn",
      meleeAttack: "Melee attack",
      rangedAttack: "Ranged attack",
    };

    return (
      <button
        className="action"
        onClick={this.processAction}
        style={{
          color: color,
        }}
      >
        <style jsx>{`
          .action {
            pointer-events: all;
            position: absolute;
            left: 0; top: 0; bottom: 0;
            width: 100%;
            outline: none;
            text-shadow:
               ${outlineSize}px  ${outlineSize}px 0 ${colors.sea},
              -${outlineSize}px -${outlineSize}px 0 ${colors.sea},
               ${outlineSize}px -${outlineSize}px 0 ${colors.sea},
              -${outlineSize}px  ${outlineSize}px 0 ${colors.sea},
              -${outlineSize}px  0px 0 ${colors.sea},
               ${outlineSize}px  0px 0 ${colors.sea},
               0px -${outlineSize}px 0 ${colors.sea},
               0px  ${outlineSize}px 0 ${colors.sea}
            ;
          }

          .actionLabel {
            pointer-events: none;
            position: absolute;
            left: 50%; bottom: 100%;
            white-space: nowrap;
            transform: translate(-50%, -0.382rem);
          }
        `}</style>

        <div className="actionLabel">
          {texts[this.props.data.action]}
        </div>
      </button>
    );
  }
}
