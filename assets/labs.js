/* Interactive illustrations of GaugeVLM's geometry; no VLM is run here. */
(() => {
  'use strict';
  const G = window.GaugeGeometry;
  const byId = id => document.getElementById(id);
  const scene = byId('lab-scene');
  if (!G || !scene) return;
  const ns = 'http://www.w3.org/2000/svg';
  const state = { yaw: 35, distance: 2, clock: 2 };
  let truth = { distance: 2, clock: 2 };
  let announceTimer;
  const number = value => Number(value).toFixed(2);
  const el = (name, attrs, text) => {
    const node = document.createElementNS(ns, name);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const project = point => G.project(point, state.yaw);
  const pointString = points => points.map(point => {
    const projected = project(point);
    return `${projected.x.toFixed(2)},${projected.y.toFixed(2)}`;
  }).join(' ');
  const line = (a, b, attrs = {}) => {
    const start = project(a), end = project(b);
    return el('line', { x1: start.x, y1: start.y, x2: end.x, y2: end.y, ...attrs });
  };

  function cube(position, palette, label) {
    const half = .32, low = 0, high = .64;
    const point = (dx, y, dz) => ({ x: position.x + dx, y, z: position.z + dz });
    const faces = [
      { color: palette[0], points: [point(-half, high, -half), point(half, high, -half), point(half, high, half), point(-half, high, half)] },
      { color: palette[1], points: [point(-half, low, -half), point(half, low, -half), point(half, high, -half), point(-half, high, -half)] },
      { color: palette[2], points: [point(half, low, -half), point(half, low, half), point(half, high, half), point(half, high, -half)] },
      { color: palette[1], points: [point(half, low, half), point(-half, low, half), point(-half, high, half), point(half, high, half)] },
      { color: palette[2], points: [point(-half, low, half), point(-half, low, -half), point(-half, high, -half), point(-half, high, half)] }
    ];
    faces.forEach(face => { face.depth = face.points.reduce((sum, p) => sum + project(p).depth, 0) / 4; });
    faces.sort((a, b) => a.depth - b.depth);
    const group = el('g');
    const shadow = project({ ...position, y: 0 });
    group.append(el('ellipse', { cx: shadow.x, cy: shadow.y + 5, rx: 31, ry: 13, fill: '#2d4264', opacity: '.08' }));
    faces.forEach(face => group.append(el('polygon', { points: pointString(face.points), fill: face.color, stroke: '#ffffff', 'stroke-width': '.75', 'stroke-opacity': '.55', 'stroke-linejoin': 'round' })));
    const labelPoint = project({ ...position, y: 1.02 });
    group.append(el('text', { x: labelPoint.x, y: labelPoint.y, 'text-anchor': 'middle', class: 'lab-cube-label' }, label));
    return group;
  }

  function renderScene(source = 'initial') {
    byId('lab-yaw').value = String(state.yaw);
    byId('lab-distance-input').value = String(state.distance);
    byId('lab-direction').value = String(state.clock);
    byId('lab-yaw-value').textContent = `${Math.round(state.yaw)}°`;
    byId('lab-distance-value').textContent = `${number(state.distance)} m`;
    byId('lab-direction-value').textContent = `${state.clock} o’clock`;
    byId('lab-camera-caption').textContent = `Camera · ${Math.round(state.yaw)}°`;
    byId('lab-distance').innerHTML = `${number(state.distance)} <small>m</small>`;
    byId('lab-clock').innerHTML = `${state.clock} <small>o’clock</small>`;
    document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(Math.round(state.yaw) % 360 === Number(button.dataset.view))));
    const target = G.position(state.distance, state.clock);
    const nodes = [];
    const floor = [ { x: -3.7, y: 0, z: -3.7 }, { x: 3.7, y: 0, z: -3.7 }, { x: 3.7, y: 0, z: 3.7 }, { x: -3.7, y: 0, z: 3.7 } ];
    nodes.push(el('polygon', { points: pointString(floor), fill: '#f3f5f8', stroke: '#d9dee6', 'stroke-width': '1' }));
    for (let index = -3; index <= 3; index++) {
      nodes.push(line({ x: index, y: 0, z: -3.7 }, { x: index, y: 0, z: 3.7 }, { stroke: '#e0e4ea', 'stroke-width': '.8' }));
      nodes.push(line({ x: -3.7, y: 0, z: index }, { x: 3.7, y: 0, z: index }, { stroke: '#e0e4ea', 'stroke-width': '.8' }));
    }
    const ring = Array.from({ length: 73 }, (_, i) => G.position(state.distance, i / 6));
    nodes.push(el('polyline', { points: pointString(ring), fill: 'none', stroke: '#bdc6d7', 'stroke-width': '1', 'stroke-dasharray': '3 5' }));
    nodes.push(line({ x: 0, y: .025, z: 0 }, { x: 0, y: .025, z: -3.15 }, { stroke: '#477ac6', 'stroke-width': '1.5', 'marker-end': 'url(#lab-arrow)' }));
    [12, 3, 6, 9].forEach(hour => {
      const label = project(G.position(3.95, hour));
      nodes.push(el('text', { x: label.x, y: label.y + 4, 'text-anchor': 'middle', class: 'lab-floor-label' }, `${hour}`));
    });
    nodes.push(line({ x: 0, y: .02, z: 0 }, { ...target, y: .02 }, { class: 'lab-distance-line' }));
    const cubes = [ { position: { x: 0, y: 0, z: 0 }, palette: ['#b5c8e6', '#7194c6', '#4d70a6'], label: 'A' }, { position: target, palette: ['#d1c8e4', '#a394c4', '#8170a8'], label: 'B' } ];
    cubes.sort((a, b) => project(a.position).depth - project(b.position).depth);
    cubes.forEach(item => nodes.push(cube(item.position, item.palette, item.label)));
    byId('lab-world').replaceChildren(...nodes);
    byId('lab-scene-description').textContent = `Camera at ${Math.round(state.yaw)} degrees. Purple target B is ${number(state.distance)} meters from blue anchor A, at ${state.clock} o'clock in the fixed anchor frame. Drag horizontally or use the left and right arrow keys to orbit the camera.`;
    const isObject = source === 'object';
    byId('lab-relation-badge').textContent = isObject ? 'Relation updated' : 'Fixed reference frame';
    byId('lab-relation-note').textContent = isObject ? 'Moving B changes its relation to anchor A.' : 'Spatial measurements stay constant as the camera moves.';
    clearTimeout(announceTimer);
    if (source !== 'initial') announceTimer = setTimeout(() => {
      byId('lab-announcement').textContent = isObject ? `New relation: ${number(state.distance)} m at ${state.clock} o’clock.` : `View changed. Still ${number(state.distance)} m at ${state.clock} o’clock.`;
    }, 220);
  }

  byId('lab-yaw').addEventListener('input', event => { state.yaw = Number(event.target.value); renderScene('camera'); });
  byId('lab-distance-input').addEventListener('input', event => { state.distance = Number(event.target.value); renderScene('object'); });
  byId('lab-direction').addEventListener('input', event => { state.clock = Number(event.target.value); renderScene('object'); });
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => { state.yaw = Number(button.dataset.view); renderScene('camera'); }));
  byId('lab-reset').addEventListener('click', () => {
    Object.assign(state, { yaw: 35, distance: 2, clock: 2 });
    renderScene();
    clearTimeout(announceTimer);
    byId('lab-announcement').textContent = 'Scene reset to 2.00 m at 2 o’clock.';
  });
  let drag = null;
  scene.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.isPrimary === false) return;
    drag = { id: event.pointerId, x: event.clientX, yaw: state.yaw };
    scene.setPointerCapture(event.pointerId);
    scene.focus({ preventScroll: true });
  });
  scene.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    state.yaw = Math.round(((drag.yaw + (event.clientX - drag.x) * .55) % 360 + 360) % 360);
    renderScene('camera');
  });
  const release = event => {
    if (!drag || event.pointerId !== drag.id) return;
    if (scene.hasPointerCapture?.(event.pointerId)) scene.releasePointerCapture(event.pointerId);
    drag = null;
  };
  scene.addEventListener('pointerup', release);
  scene.addEventListener('pointercancel', release);
  scene.addEventListener('lostpointercapture', () => { drag = null; });
  scene.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return;
    event.preventDefault();
    state.yaw = event.key === 'Home' ? 35 : (state.yaw + (event.key === 'ArrowRight' ? 5 : -5) + 360) % 360;
    renderScene('camera');
  });

  let marginTimer;
  function renderMargin(announce = false) {
    const candidate = { distance: Number(byId('margin-distance').value), clock: Number(byId('margin-direction').value) };
    const error = G.error(truth, candidate);
    byId('margin-truth').textContent = `${number(truth.distance)} m · ${truth.clock} o’clock`;
    byId('margin-distance-value').textContent = `${number(candidate.distance)} m`;
    byId('margin-direction-value').textContent = `${candidate.clock} o’clock`;
    byId('margin-score').textContent = error.margin.toFixed(3);
    byId('margin-meter').setAttribute('aria-valuenow', error.margin.toFixed(3));
    byId('margin-meter').setAttribute('aria-valuetext', `${error.margin.toFixed(3)} out of 1`);
    byId('margin-direction-fill').style.width = `${error.direction * 50}%`;
    byId('margin-distance-fill').style.width = `${error.distance * 50}%`;
    byId('margin-direction-component').textContent = (error.direction * .5).toFixed(3);
    byId('margin-distance-component').textContent = (error.distance * .5).toFixed(3);
    byId('margin-direction-explanation').textContent = `${error.hours} hours / 6 × 0.5`;
    byId('margin-distance-explanation').textContent = `min(|ln(${number(candidate.distance)} / ${number(truth.distance)})| / ln 5, 1) × 0.5`;
    const verdict = byId('margin-verdict');
    verdict.textContent = error.margin < .0001 ? 'Correct answer' : error.margin >= .5 ? 'Larger error' : 'Measured error';
    verdict.dataset.level = error.margin >= .5 ? 'large' : 'small';
    byId('margin-insight').textContent = error.margin < .0001 ? 'The candidate matches the measured truth: both error contributions are zero.' : error.distance >= 1 ? 'The distance contribution saturates at a 5× ratio. Direction still contributes independently.' : error.hours > 0 && Math.abs((G.clock(truth.clock) || 12) - (G.clock(candidate.clock) || 12)) > 6 ? 'Clock errors wrap around: 12 and 1 o’clock are neighbors. The shortest arc determines the direction error.' : 'The training preference gap grows with the measured geometric error. This value is not model confidence.';
    clearTimeout(marginTimer);
    if (announce) marginTimer = setTimeout(() => { byId('margin-announcement').textContent = `Geometric margin ${error.margin.toFixed(3)}. Candidate ${number(candidate.distance)} meters at ${candidate.clock} o'clock.`; }, 220);
  }
  ['margin-distance', 'margin-direction'].forEach(id => byId(id).addEventListener('input', () => renderMargin(true)));
  document.querySelectorAll('[data-error-preset]').forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.errorPreset;
    const distance = mode === 'exact' ? truth.distance : mode === 'near' ? truth.distance * 1.1 : truth.distance * 5;
    const direction = mode === 'exact' ? truth.clock : G.clock(truth.clock + (mode === 'near' ? 1 : 6)) || 12;
    byId('margin-distance').value = String(Math.round(G.clamp(distance, .1, 15) * 20) / 20);
    byId('margin-direction').value = String(direction);
    renderMargin(true);
  }));
  byId('lab-to-margin').addEventListener('click', () => {
    document.querySelector('#demo-margin')?.click();
    truth = { distance: state.distance, clock: state.clock };
    byId('margin-distance').value = String(Math.round(state.distance * 1.5 * 20) / 20);
    byId('margin-direction').value = String(G.clock(state.clock + 2) || 12);
    renderMargin(true);
    clearTimeout(announceTimer);
    byId('lab-announcement').textContent = 'Scene measurements imported into the geometric error explorer.';
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    byId('margin-playground').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    byId('margin-distance').focus({ preventScroll: true });
  });
  renderScene();
  renderMargin();
})();
