import React, { PureComponent } from "react";

export default class Tooltip extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.mounted = true;

    this.timer = setTimeout(this.show, 262);
  }

  componentWillUnmount() {
    this.mounted = false;

    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  show = () => {
    if (this.mounted) {
      this.setState({ visible: true });
    }
  };

  render() {
    if (this.state.visible) {
      return (
        <div className="tooltip">
          {this.props.text}
        </div>
      );
    } else {
      return null;
    }
  }
}
