import React, { Component, PropTypes } from "react";
import { Body } from "react-game-kit";
import Matter from "matter-js";

export default class PlayerBody extends Component {
  static contextTypes = {
    engine: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      engineX: 0,
      engineY: 0,
    };
  }

  componentDidMount() {
    this.updateEngine(this.props);
    Matter.Events.on(this.context.engine, "afterUpdate", this.handleEngineUpdate);
  }

  componentWillUnmount() {
    Matter.Events.off(this.context.engine, "afterUpdate", this.handleEngineUpdate);
  }

  componentWillReceiveProps(nextProps) {
    this.updateEngine(nextProps);
  }

  updateEngine = (props) => {
    const { body } = { ...this.body };

    Matter.Body.setPosition(body, { x: props.x, y: props.y });
    Matter.Body.setVelocity(body, { x: props.vx, y: props.vy });
  }

  handleEngineUpdate = () => {
    const { body } = { ...this.body };
    const position = body && body.position;
    const {engineX, engineY} = { ...this.state };

    if (position && (engineX !== position.x || engineY !== position.y)) {
      this.setState({
        engineX: position.x,
        engineY: position.y,
      });
    }
  }

  render() {
    const {x, y, vx, vy} = { ...this.props };
    const {engineX, engineY} = { ...this.state };

    const xTransform = `calc( (${engineX}vmin - (1vmin * var(--playerPositionX))) * var(--worldScale) )`;
    const yTransform = `calc( (${engineY}vmin - (1vmin * var(--playerPositionY))) * var(--worldScale) )`;

    const transform = `translate3d(${xTransform}, ${yTransform}, 0)`;

    return (
      <Body
        args={[
          x, y, 1, 1,
          {
            isStatic: true,
            velocity: { x: vx, y: vy },
          },
        ]}
        ref={(c) => this.body = c}
      >
        <div
          className="playerPosition"
          style={{
            WebkitTransform: transform,
            transform: transform
          }}
        >
          <style jsx>{`
            .playerPosition {
              position: absolute;
              left: 0; top: 0;
              will-change: transform;
            }
          `}</style>

          {this.props.children}
        </div>
      </Body>
    );
  }
}
