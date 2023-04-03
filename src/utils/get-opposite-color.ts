
export const getOppositeColor = (color: string): string => {
  // Parse the RGB values from the color string
  const rgb = color.match(/\d+/g)?.map(Number);

  if (rgb && rgb.length === 3) {
    // Calculate the opposite color by subtracting each RGB value from 255
    return `rgb(${255 - rgb[0]}, ${255 - rgb[1]}, ${255 - rgb[2]})`;
  }

  // If the color string is invalid, return black as the opposite color
  return '#000000';
}
