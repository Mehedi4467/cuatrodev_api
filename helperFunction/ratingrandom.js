export function getRndFloat(min, max) {
  return (Math.random() * (max - min) + min).toFixed(1);
}
