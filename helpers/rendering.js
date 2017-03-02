let rendering = {};

rendering.shortAngleDist = (a0, a1) => {
  var max = Math.PI * 2;
  var da = (a1 - a0) % max;
  return 2 * da % max - da;
};

rendering.angleLerp = (a0, a1, t) => {
  return a0 + rendering.shortAngleDist(a0, a1) * t;
};

rendering.lerp = (a, b, t) => {
  return a + (b - a) * t;
};

export default rendering;
