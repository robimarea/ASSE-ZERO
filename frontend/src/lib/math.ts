/**
 * Clamps a value between a minimum and maximum range.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Linearly interpolates between two values.
 */
export function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount;
}

/**
 * Smoothly interpolates between 0 and 1 using a cubic hermite spline.
 */
export function smoothstep(min: number, max: number, value: number): number {
  const t = clamp((value - min) / Math.max(max - min, 0.0001), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Frame-rate independent damping (interpolation towards a target).
 * @param current Current value
 * @param target Target value
 * @param lambda Smoothing factor (higher is faster)
 * @param dt Delta time in seconds
 */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/**
 * Maps a value from one range to another.
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((outMax - outMin) * (value - inMin)) / (inMax - inMin);
}
