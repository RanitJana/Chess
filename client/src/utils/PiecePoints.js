export default function piecePoint(name = "") {
  const points = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  return points[name.toLowerCase()] || 0;
}
