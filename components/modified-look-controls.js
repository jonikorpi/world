const AFRAME = require("aframe");
const THREE = require("aframe/src/lib/three");
const isMobile = require("aframe/src/utils/").device.isMobile();
const bind = require("aframe/src/utils/bind");

// To avoid recalculation at every mouse movement tick
const PI_2 = Math.PI / 2;
const radToDeg = THREE.Math.radToDeg;

!AFRAME.components["modified-look-controls"] && AFRAME.registerComponent("modified-look-controls", {
  dependencies: ["position", "rotation"],

  schema: {
    enabled: {default: true},
    hmdEnabled: {default: true},
    reverseMouseDrag: {default: false},
    standing: {default: true},
    sensitivity: {default: 1}
  },

  init: function () {
    // var sceneEl = this.el.sceneEl;

    this.previousHMDPosition = new THREE.Vector3();
    this.setupMouseControls();
    this.setupHMDControls();
    this.bindMethods();

    // Enable grab cursor class on canvas.
    // function enableGrabCursor () { sceneEl.canvas.classList.add("a-grab-cursor"); }
    // if (!sceneEl.canvas) {
    //   sceneEl.addEventListener("render-target-loaded", enableGrabCursor);
    // } else {
    //   enableGrabCursor();
    // }
  },

  update: function (oldData) {
    var data = this.data;
    var hmdEnabled = data.hmdEnabled;
    if (!data.enabled) { return; }
    if (!hmdEnabled && oldData && hmdEnabled !== oldData.hmdEnabled) {
      this.pitchObject.rotation.set(0, 0, 0);
      this.yawObject.rotation.set(0, 0, 0);
    }
    this.controls.standing = data.standing;
    this.controls.update();
    this.updateOrientation();
    this.updatePosition();
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.releaseMouse();
    this.removeEventListeners();
  },

  tick: function (t) {
    this.update();
  },

  remove: function () {
    this.pause();
  },

  bindMethods: function () {
    this.onMouseDown = bind(this.onMouseDown, this);
    this.onMouseMove = bind(this.onMouseMove, this);
    this.releaseMouse = bind(this.releaseMouse, this);
    this.onTouchStart = bind(this.onTouchStart, this);
    this.onTouchMove = bind(this.onTouchMove, this);
    this.onTouchEnd = bind(this.onTouchEnd, this);

    this.onLockChange = bind(this.onLockChange, this);
    this.captureMouse = bind(this.captureMouse, this);
  },

  setupMouseControls: function () {
    // The canvas where the scene is painted
    // this.mouseDown = false;
    this.pointerlocked = false;
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 10;
    this.yawObject.add(this.pitchObject);
    this.lockIsSupported = (
         "pointerLockElement" in document
      || "mozPointerLockElement" in document
      || "webkitPointerLockElement" in document
    );
  },

  setupHMDControls: function () {
    this.dolly = new THREE.Object3D();
    this.euler = new THREE.Euler();
    this.controls = new THREE.VRControls(this.dolly);
    this.controls.userHeight = 0.0;
  },

  addEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl.canvas;

    // listen for canvas to load.
    if (!canvasEl) {
      sceneEl.addEventListener("render-target-loaded", bind(this.addEventListeners, this));
      return;
    }

    // Mouse Events
    canvasEl.addEventListener("mousedown", this.onMouseDown, false);
    // window.addEventListener("mousemove", this.onMouseMove, false);
    // window.addEventListener("mouseup", this.releaseMouse, false);

    // Touch events
    canvasEl.addEventListener("touchstart", this.onTouchStart);
    window.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("touchend", this.onTouchEnd);

    // Locked mouse events
    if (this.lockIsSupported) {
      document.addEventListener("pointerlockchange", this.onLockChange, false);
      document.addEventListener("mozpointerlockchange", this.onLockChange, false);
      document.addEventListener("webkitpointerlockchange", this.onLockChange, false);

      document.addEventListener("pointerlockerror", this.onLockError, false);
      document.addEventListener("mozpointerlockerror", this.onLockError, false);
      document.addEventListener("webkitpointerlockerror", this.onLockError, false);
    }
  },

  removeEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl && sceneEl.canvas;
    if (!canvasEl) { return; }

    // Mouse Events
    canvasEl.removeEventListener("mousedown", this.onMouseDown);
    // canvasEl.removeEventListener("mousemove", this.onMouseMove);
    // canvasEl.removeEventListener("mouseup", this.releaseMouse);
    // canvasEl.removeEventListener("mouseout", this.releaseMouse);

    // Touch events
    canvasEl.removeEventListener("touchstart", this.onTouchStart);
    canvasEl.removeEventListener("touchmove", this.onTouchMove);
    canvasEl.removeEventListener("touchend", this.onTouchEnd);

    // Locked mouse events
    if (this.lockIsSupported) {
      document.removeEventListener("pointerlockchange", this.onLockChange.bind(this));
      document.removeEventListener("mozpointerlockchange", this.onLockChange.bind(this));
      document.removeEventListener("webkitpointerlockchange", this.onLockChange.bind(this));

      document.removeEventListener("pointerlockerror", this.onLockError);
      document.removeEventListener("mozpointerlockerror", this.onLockError);
      document.removeEventListener("webkitpointerlockerror", this.onLockError);
    }
  },

  updateOrientation: (function () {
    var hmdEuler = new THREE.Euler();
    return function () {
      var currentRotation;
      var deltaRotation;
      var pitchObject = this.pitchObject;
      var yawObject = this.yawObject;
      var hmdQuaternion = this.calculateHMDQuaternion();
      var sceneEl = this.el.sceneEl;
      var rotation;
      hmdEuler.setFromQuaternion(hmdQuaternion, "YXZ");
      if (isMobile) {
        // In mobile we allow camera rotation with touch events and sensors
        rotation = {
          x: radToDeg(hmdEuler.x) + radToDeg(pitchObject.rotation.x),
          y: radToDeg(hmdEuler.y) + radToDeg(yawObject.rotation.y),
          z: radToDeg(hmdEuler.z)
        };
      } else if (!sceneEl.is("vr-mode") || isNullVector(hmdEuler) || !this.data.hmdEnabled) {
        currentRotation = this.el.getAttribute("rotation");
        deltaRotation = this.calculateDeltaRotation();
        // Mouse look only if HMD disabled or no info coming from the sensors
        if (this.data.reverseMouseDrag) {
          rotation = {
            x: currentRotation.x - deltaRotation.x,
            y: currentRotation.y - deltaRotation.y,
            z: currentRotation.z
          };
        } else {
          rotation = {
            x: currentRotation.x + deltaRotation.x,
            y: currentRotation.y + deltaRotation.y,
            z: currentRotation.z
          };
        }
      } else {
        // Mouse rotation ignored with an active headset.
        // The user head rotation takes priority
        rotation = {
          x: radToDeg(hmdEuler.x),
          y: radToDeg(hmdEuler.y),
          z: radToDeg(hmdEuler.z)
        };
      }
      this.el.setAttribute("rotation", rotation);
    };
  })(),

  calculateDeltaRotation: (function () {
    var previousRotationX;
    var previousRotationY;
    return function () {
      var currentRotationX = radToDeg(this.pitchObject.rotation.x);
      var currentRotationY = radToDeg(this.yawObject.rotation.y);
      var deltaRotation;
      previousRotationX = previousRotationX || currentRotationX;
      previousRotationY = previousRotationY || currentRotationY;
      deltaRotation = {
        x: currentRotationX - previousRotationX,
        y: currentRotationY - previousRotationY
      };
      previousRotationX = currentRotationX;
      previousRotationY = currentRotationY;
      return deltaRotation;
    };
  })(),

  calculateHMDQuaternion: (function () {
    var hmdQuaternion = new THREE.Quaternion();
    return function () {
      hmdQuaternion.copy(this.dolly.quaternion);
      return hmdQuaternion;
    };
  })(),

  updatePosition: (function () {
    var deltaHMDPosition = new THREE.Vector3();
    return function () {
      var el = this.el;
      var currentPosition = el.getAttribute("position");
      var currentHMDPosition;
      var previousHMDPosition = this.previousHMDPosition;
      var sceneEl = this.el.sceneEl;
      currentHMDPosition = this.calculateHMDPosition();
      deltaHMDPosition.copy(currentHMDPosition).sub(previousHMDPosition);
      if (!sceneEl.is("vr-mode") || isNullVector(deltaHMDPosition)) { return; }
      previousHMDPosition.copy(currentHMDPosition);
      // Do nothing if we have not moved.
      if (!sceneEl.is("vr-mode")) { return; }
      el.setAttribute("position", {
        x: currentPosition.x + deltaHMDPosition.x,
        y: currentPosition.y + deltaHMDPosition.y,
        z: currentPosition.z + deltaHMDPosition.z
      });
    };
  })(),

  calculateHMDPosition: function () {
    var dolly = this.dolly;
    var position = new THREE.Vector3();
    dolly.updateMatrix();
    position.setFromMatrixPosition(dolly.matrix);
    return position;
  },

  onMouseMove: function (event) {
    var pitchObject = this.pitchObject;
    var yawObject = this.yawObject;
    // var previousMouseEvent = this.previousMouseEvent;

    if (/*!this.mouseDown ||*/ !this.data.enabled) { return; }

    var movementX = event.movementX || event.mozMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || 0;

    // if (movementX === undefined || movementY === undefined) {
    //   movementX = event.screenX - previousMouseEvent.screenX;
    //   movementY = event.screenY - previousMouseEvent.screenY;
    // }
    // this.previousMouseEvent = event;

    yawObject.rotation.y -= movementX * 0.002   * 1.5 * this.data.sensitivity;
    pitchObject.rotation.x -= movementY * 0.002 * 1.5 * this.data.sensitivity;
    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
  },

  onMouseDown: function (event) {
    // this.mouseDown = true;
    // this.previousMouseEvent = event;
    // document.body.classList.add("a-grabbing");

    if (!this.pointerlocked) {
      this.captureMouse();
    }
  },

  releaseMouse: function () {
    // this.mouseDown = false;
    // document.body.classList.remove("a-grabbing");

    document.exitPointerLock = (
         document.exitPointerLock
      || document.mozExitPointerLock
      || document.webkitExitPointerLock
    );
    document.exitPointerLock && document.exitPointerLock();
  },

  onTouchStart: function (e) {
    if (e.touches.length !== 1) { return; }
    this.touchStart = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    };
    this.touchStarted = true;
  },

  onTouchMove: function (e) {
    var deltaY;
    var yawObject = this.yawObject;
    if (!this.touchStarted) { return; }
    deltaY = 2 * Math.PI * (e.touches[0].pageX - this.touchStart.x) /
            this.el.sceneEl.canvas.clientWidth;
    // Limits touch orientaion to to yaw (y axis)
    yawObject.rotation.y -= deltaY * 0.5;
    this.touchStart = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    };
  },

  onTouchEnd: function () {
    this.touchStarted = false;
  },

  captureMouse: function () {
    var canvasEl = this.el.sceneEl.canvas;

    if (canvasEl.requestPointerLock) {
      canvasEl.requestPointerLock();
    } else if (canvasEl.mozRequestPointerLock) {
      canvasEl.mozRequestPointerLock();
    }
  },

  onLockChange: function (e) {
    var canvas = this.el.sceneEl.canvas;

    if (
         document.pointerLockElement === canvas
      || document.mozPointerLockElement === canvas
    ) {
      this.pointerlocked = true;
      document.addEventListener("mousemove", this.onMouseMove, false);
    } else {
      this.pointerlocked = false;
      document.removeEventListener("mousemove", this.onMouseMove);
    }
  },

  onLockError: function (error) {
    this.pointerlocked = false;
    console.trace(error);
  },
});

function isNullVector (vector) {
  return vector.x === 0 && vector.y === 0 && vector.z === 0;
}
