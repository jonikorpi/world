import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

export default class Sky extends PureComponent {
  constructor(props) {
    super(props);

    if (!AFRAME.shaders.gradient) {
      AFRAME.registerShader("gradient", {
        schema: {
          topColor: {type: "vec3", default: "1 0 0", is: "uniform"},
          bottomColor: {type: "vec3", default: "0 0 1", is: "uniform"},
          offset: {type: "float", default: "400", is: "uniform"},
          exponent: {type: "float", default: "0.6", is: "uniform"}
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
          }
        `,
        fragmentShader: `
          uniform vec3 bottomColor;
          uniform vec3 topColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          void main() {
           float h = normalize( vWorldPosition + offset ).y;
           gl_FragColor = vec4(
             mix(
               bottomColor,
               topColor,
               max( pow( max(h, 0.0 ), exponent ), 0.0 )
             ), 1.0
           );
          }
        `
      });
    }
  }

  render() {

    return (
      <a-entity id="skyContainer">
        <Entity
          id="sky"
          geometry={{
            primitive: "sphere",
            radius: this.props.far,
          }}
          material={{
            shader: "gradient",
            topColor:    "0.090, 0.090, 0.090",
            bottomColor: "0.236, 0.236, 0.236",
            exponent: 0.382,
            offset: 0,
          }}
          scale={[1, 1, -1]}
        />

        <Entity
          id="ambientLight"
          light={{
            type: "ambient",
            color: "hsl(218, 91%, 62%)",
          }}
        />
      </a-entity>
    );
  }
}
