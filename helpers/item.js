let item = {};

item.collection = [
  {
    name: "Cheap Blinking Item",
    type: "defense",
    maxDurability: 1,
    cost: 1,
    onUse: () => {
      // blink
    },
    onHit: undefined,
    onEquip: undefined,
    onBreak: undefined,
  },
];

export default item;
