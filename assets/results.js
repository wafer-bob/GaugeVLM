/* Results transcribed from paper/table/tab_main.tex supplied with GaugeVLM_arXiv.pdf.
 * Gain values are recomputed from the displayed one-decimal scores (percentage points).
 */
(() => {
  'use strict';

  const metrics = [
    'MSMU · Distance',
    'MSMU · Width',
    'MSMU · Height',
    'QSpatial+ · δ₂',
    'SURDS · Distance',
    'SURDS · Depth',
    'SpatialRGPT · Quantitative',
    'SpatialRGPT · Qualitative',
    '3DSRBench · Accuracy',
    'BLINK · Accuracy'
  ];
  const results = {
    qwen: {
      label: 'Qwen2.5-VL-7B',
      base: [17.5, 3.4, 12.1, 42.6, 20.0, 22.3, 25.0, 70.0, 44.9, 49.5],
      sft: [47.5, 48.3, 67.0, 45.5, 22.4, 24.3, 33.5, 74.7, 48.2, 50.5],
      ours: [62.5, 55.1, 71.4, 64.4, 30.4, 35.7, 43.1, 81.6, 56.9, 56.7]
    },
    glm: {
      label: 'GLM-4.1V-9B',
      base: [30.0, 1.1, 9.9, 43.6, 29.5, 26.4, 31.9, 71.2, 48.2, 51.0],
      sft: [67.5, 57.3, 67.0, 49.5, 33.9, 29.1, 38.4, 68.8, 46.7, 56.2],
      ours: [72.5, 65.2, 75.8, 58.4, 35.2, 31.3, 43.5, 78.7, 50.8, 58.2]
    },
    pixtral: {
      label: 'Pixtral-12B',
      base: [10.0, 4.5, 4.4, 8.9, 21.3, 15.8, 27.6, 64.8, 44.0, 37.2],
      sft: [50.0, 53.9, 69.2, 7.9, 22.0, 18.8, 18.0, 60.0, 43.5, 37.0],
      ours: [52.5, 56.2, 75.8, 11.9, 28.5, 23.7, 28.0, 67.0, 48.0, 42.6]
    }
  };
  const buttons = Array.from(document.querySelectorAll('[data-backbone]'));
  const tableBody = document.getElementById('results-body');
  const panel = document.getElementById('results-panel');
  const title = document.getElementById('results-backbone');
  const summary = document.getElementById('results-summary');
  if (!panel || !tableBody) return;

  const chartContainer = panel.querySelector('.result-charts');
  const legend = panel.querySelector('.chart-legend');
  const detailsSummary = panel.querySelector('.full-results summary');
  const caption = panel.querySelector('caption');
  const backbones = Object.keys(results);
  const benchmarks = ['MSMU', 'QSpatial+', 'SURDS', 'SpatialRGPT', '3DSRBench', 'BLINK'];
  const representativeMetrics = [0, 3, 5, 7];
  const chartIds = { 0: 'chart-msmu', 3: 'chart-qspatial', 5: 'chart-surds', 7: 'chart-spatialrgpt' };
  const state = { backbone: 'qwen', benchmark: 'all', sort: 'paper', compare: false };
  const percentage = value => `${value.toFixed(1)}%`;
  const gain = (data, index) => data.ours[index] - data.sft[index];

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function selectControl(id, text, options) {
    const label = element('label', 'results-control');
    label.htmlFor = id;
    label.append(element('span', '', text));
    const select = element('select');
    select.id = id;
    options.forEach(([value, labelText]) => {
      const option = element('option', '', labelText);
      option.value = value;
      select.append(option);
    });
    label.append(select);
    return { label, select };
  }

  const controls = element('div', 'results-explorer-controls');
  const filter = selectControl('results-filter', 'Benchmark', [
    ['all', 'All benchmarks'], ...benchmarks.map(name => [name, name])
  ]);
  const sort = selectControl('results-sort', 'Sort by', [
    ['paper', 'Paper order'], ['gain', 'Largest gain vs. SFT'], ['score', 'Highest GaugeVLM score']
  ]);
  const compare = element('button', 'results-compare', 'Compare all backbones');
  compare.id = 'results-compare';
  compare.type = 'button';
  compare.setAttribute('aria-pressed', 'false');
  compare.setAttribute('aria-controls', 'results-charts');
  const download = element('button', 'results-download', '↓ Download selection');
  download.id = 'results-download';
  download.type = 'button';
  controls.append(filter.label, sort.label, compare, download);
  panel.prepend(controls);
  const note = element('p', 'results-explorer-note');
  note.id = 'results-explorer-note';
  if (chartContainer) {
    chartContainer.id = 'results-charts';
    chartContainer.setAttribute('aria-describedby', note.id);
    chartContainer.after(note);
  }

  function visibleMetrics() {
    const indices = metrics.map((_, index) => index).filter(index =>
      state.benchmark === 'all' || metrics[index].startsWith(`${state.benchmark} ·`)
    );
    const data = results[state.backbone];
    if (state.sort === 'gain') indices.sort((a, b) => gain(data, b) - gain(data, a) || a - b);
    if (state.sort === 'score') indices.sort((a, b) => data.ours[b] - data.ours[a] || a - b);
    return indices;
  }

  function makeCell(tag, value, className) {
    const cell = element(tag, className, value);
    if (tag === 'th') cell.scope = 'row';
    return cell;
  }

  function makeBar(label, value, className) {
    const row = element('div', 'bar-row');
    const name = element('span', 'bar-label', label);
    const track = element('div', 'bar-track');
    track.setAttribute('aria-hidden', 'true');
    const bar = element('div', `bar ${className}`);
    bar.style.width = `${Math.max(0, Math.min(100, value))}%`;
    track.append(bar);
    const score = element('span', 'bar-value', percentage(value));
    row.append(name, track, score);
    return row;
  }

  function renderCharts(indices) {
    if (!chartContainer) return;
    const data = results[state.backbone];
    const chartMetrics = state.benchmark === 'all'
      ? indices.filter(index => representativeMetrics.includes(index)) : indices;
    chartContainer.classList.toggle('is-comparison', state.compare);
    chartContainer.classList.toggle('is-filtered', state.benchmark !== 'all');
    chartContainer.replaceChildren(...chartMetrics.map(index => {
      const article = element('article');
      const [benchmark, metric] = metrics[index].split(' · ');
      const heading = element('h4', '', benchmark);
      heading.append(element('span', '', metric));
      const chart = element('div');
      chart.id = chartIds[index] || `chart-metric-${index}`;
      chart.setAttribute('role', 'group');
      chart.setAttribute('aria-label', `${metrics[index]}: ${state.compare ? 'GaugeVLM across all three backbones' : data.label}`);
      if (state.compare) {
        backbones.forEach(key => chart.append(makeBar(results[key].label, results[key].ours[index], `model-${key}`)));
      } else {
        chart.append(makeBar('GaugeSFT', data.sft[index], 'sft'), makeBar('GaugeVLM', data.ours[index], 'ours'));
      }
      article.append(heading, chart);
      return article;
    }));
    if (legend) {
      const labels = state.compare
        ? backbones.map(key => [results[key].label, `legend-${key}`])
        : [['GaugeSFT', 'legend-sft'], ['GaugeVLM', 'legend-ours']];
      legend.replaceChildren(...labels.map(([label, className]) => {
        const item = element('span');
        const swatch = element('i', className);
        swatch.setAttribute('aria-hidden', 'true');
        item.append(swatch, document.createTextNode(label));
        return item;
      }));
    }
    if (title) title.textContent = state.compare ? 'GaugeVLM · all three backbones' : data.label;
    const scope = state.benchmark === 'all' ? 'Four representative metrics shown above.' : `All ${state.benchmark} metrics shown above.`;
    const sorting = state.sort === 'paper' ? 'Paper order.' : `Sorted by ${state.sort === 'gain' ? 'gain over GaugeSFT' : 'GaugeVLM score'} on ${data.label}.`;
    note.textContent = `${scope} ${sorting} Table and download: ${data.label}.`;
  }

  function render() {
    const data = results[state.backbone];
    const indices = visibleMetrics();
    tableBody.replaceChildren(...indices.map(index => {
      const row = element('tr');
      row.append(
        makeCell('th', metrics[index]),
        makeCell('td', percentage(data.base[index])),
        makeCell('td', percentage(data.sft[index])),
        makeCell('td', percentage(data.ours[index]), 'score-best'),
        makeCell('td', `+${gain(data, index).toFixed(1)} pp`, 'gain')
      );
      return row;
    }));
    if (summary) summary.textContent = state.benchmark === 'all'
      ? `GaugeVLM improves all 10 spatial metrics over GaugeSFT on ${data.label}.`
      : `${data.label}: GaugeVLM improves all ${indices.length} ${state.benchmark} ${indices.length === 1 ? 'metric' : 'metrics'} over GaugeSFT.`;
    if (caption) caption.textContent = `${data.label} spatial benchmark results. All scores are percentages. Gain is in percentage points. Higher is better.`;
    if (detailsSummary) {
      const icon = element('span', '', '+');
      icon.setAttribute('aria-hidden', 'true');
      detailsSummary.replaceChildren(document.createTextNode(
        state.benchmark === 'all' ? 'All 10 spatial metrics' : `${state.benchmark} · ${indices.length} ${indices.length === 1 ? 'metric' : 'metrics'}`
      ), icon);
    }
    download.setAttribute('aria-label', `Download ${indices.length} displayed result rows for ${data.label} as CSV`);
    renderCharts(indices);
  }

  function selectBackbone(key, focus = false) {
    if (!results[key]) return;
    state.backbone = key;
    const activeButton = buttons.find(button => button.dataset.backbone === key);
    buttons.forEach(button => {
      const selected = button === activeButton;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      button.classList.toggle('active', selected);
    });
    if (activeButton) panel.setAttribute('aria-labelledby', activeButton.id);
    render();
    if (focus && activeButton) activeButton.focus();
  }

  filter.select.addEventListener('change', () => {
    state.benchmark = filter.select.value;
    render();
  });
  sort.select.addEventListener('change', () => {
    state.sort = sort.select.value;
    render();
  });
  compare.addEventListener('click', () => {
    state.compare = !state.compare;
    compare.setAttribute('aria-pressed', String(state.compare));
    render();
  });
  download.addEventListener('click', () => {
    const data = results[state.backbone];
    const escape = value => `"${String(value).replace(/"/g, '""')}"`;
    const rows = [['backbone', 'metric', 'base', 'gauge_sft', 'gauge_vlm', 'gain_pp'],
      ...visibleMetrics().map(index => [data.label, metrics[index], data.base[index].toFixed(1),
        data.sft[index].toFixed(1), data.ours[index].toFixed(1), gain(data, index).toFixed(1)])];
    const csv = rows.map(row => row.map(escape).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' }));
    const link = element('a');
    link.href = url;
    link.download = `GaugeVLM-${state.backbone}-${state.benchmark === 'all' ? 'all' : state.benchmark.replace(/[^a-z0-9]/gi, '')}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  buttons.forEach((button, index) => {
    if (!button.id) button.id = `backbone-${button.dataset.backbone}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', 'results-panel');
    button.addEventListener('click', () => selectBackbone(button.dataset.backbone));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectBackbone(buttons[next].dataset.backbone, true);
    });
  });
  panel.setAttribute('role', 'tabpanel');
  selectBackbone('qwen');
})();
