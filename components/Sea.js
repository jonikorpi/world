import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

export default class Sea extends PureComponent {
  constructor(props) {
    super(props);

    if (!AFRAME.components.ocean) {
      AFRAME.registerComponent("ocean", {
        schema: {
          // Dimensions of the ocean area.
          width: {default: 10, min: 0},
          depth: {default: 10, min: 0},

          // Density of waves.
          density: {default: 10},

          // Wave amplitude and variance.
          amplitude: {default: 0.1},
          amplitudeVariance: {default: 0.3},

          // Wave speed and variance.
          speed: {default: 1},
          speedVariance: {default: 2},

          // Material.
          color: {default: 0x7AD2F7},
          opacity: {default: 0.8}
        },

        play: function () {
          var el = this.el,
              data = this.data,
              material = el.components.material;

          var geometry = new THREE.PlaneGeometry(data.width, data.depth, data.density, data.density);
          geometry.mergeVertices();
          this.waves = [];
          for (var v, i = 0, l = geometry.vertices.length; i < l; i++) {
            v = geometry.vertices[i];
            this.waves.push({
              z: v.z,
              ang: Math.random() * Math.PI * 2,
              amp: data.amplitude + Math.random() * data.amplitudeVariance,
              speed: (data.speed + Math.random() * data.speedVariance) / 1000 // radians / frame
            });
          }

          this.mesh = new THREE.Mesh(geometry, material.material);
          el.setObject3D('mesh', this.mesh);
        },

        remove: function () {
          this.el.removeObject3D('mesh');
        },

        tick: function (t, dt) {
          if (!dt) return;

          var verts = this.mesh.geometry.vertices;
          for (var v, vprops, i = 0; (v = verts[i]); i++){
            vprops = this.waves[i];
            v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;
            vprops.ang += vprops.speed * dt;
          }
          this.mesh.geometry.verticesNeedUpdate = true;
        }
      });
    }
  }

  render() {
    const size = 250;
    const amplitude = 0.5;
    const color = "black";

    return (
      <a-entity>
        <Entity
          ocean={{
            width: size,
            depth: size,
            density: size / 5,
            amplitude: amplitude,
            amplitudeVariance: 0.1,
            speed: 0.5,
            speedVariance: 1,
          }}
          material={{
            color: color,
            flatShading: true,
            transparent: true,
            opacity: 0.5,
          }}
          rotation={[-90, 0, 0]}
          position={[0, -amplitude*2, 0]}
        />
      </a-entity>
    );
  }
}
