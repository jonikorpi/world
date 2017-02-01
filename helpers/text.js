const text = (weight, style) => {
  weight = weight ? `-${weight}` : "";
  style =  style ? `-${style}` : "";

  return {
    align: "center",
    lineHeight: 64 * 1.236,
    font: `/static/fonts/alegreya${weight}${style}.fnt`,
    shader: "sdf",
  };
};

export default text;
