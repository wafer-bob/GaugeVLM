/* Geometry used by the explanatory widgets. No model inference or benchmark data. */
(function (root) {
  'use strict';
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const clock = value => ((value % 12) + 12) % 12;
  function position(distance, hour) {
    const angle = clock(hour) * Math.PI / 6;
    return { x: distance * Math.sin(angle), y: 0, z: -distance * Math.cos(angle) };
  }
  function relation(point) {
    const distance = Math.hypot(point.x, point.z);
    const continuousClock = clock(Math.atan2(point.x, -point.z) * 6 / Math.PI);
    return { distance, continuousClock, clock: clock(Math.round(continuousClock)) || 12 };
  }
  function error(truth, candidate) {
    if (!(truth.distance > 0) || !(candidate.distance > 0)) throw new RangeError('Distances must be positive.');
    const raw = Math.abs(clock(truth.clock) - clock(candidate.clock));
    const hours = Math.min(raw, 12 - raw);
    const direction = hours / 6;
    const distance = Math.min(Math.abs(Math.log(candidate.distance / truth.distance)), Math.log(5)) / Math.log(5);
    return { direction, distance, hours, margin: .5 * direction + .5 * distance };
  }
  function project(point, yaw, elevation = 34) {
    const a = yaw * Math.PI / 180;
    const e = elevation * Math.PI / 180;
    const side = Math.cos(a) * point.x - Math.sin(a) * point.z;
    const depth = Math.sin(a) * point.x + Math.cos(a) * point.z;
    return { x: 360 + side * 54, y: 235 + (depth * Math.sin(e) - point.y * Math.cos(e)) * 54, depth: depth * Math.cos(e) + point.y * Math.sin(e) };
  }
  const api = { clamp, clock, position, relation, error, project };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GaugeGeometry = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
