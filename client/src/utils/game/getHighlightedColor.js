const getHighlightColor = (rgbString, alpha = 0.6) => {
  const rgbValues = rgbString.match(/\d+/g);
  if (!rgbValues) return rgbString; // Return original if invalid

  let [r, g, b] = rgbValues.map(Number);

  // Lighten the color and push towards warm tones
  r = Math.min(r + 60, 255); // Increase Red significantly
  g = Math.min(g + 50, 255); // Increase Green
  b = Math.max(b - 40, 0); // Decrease Blue to make it warmer

  return `rgba(${r}, ${g}, ${b}, ${alpha})`; // Add transparency
};

export default getHighlightColor;
