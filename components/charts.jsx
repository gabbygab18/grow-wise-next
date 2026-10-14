'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { money } from '@/lib/format';
import { CHART, LOAN_COLORS } from '@/lib/palette';

/*
 * GrowWise charts, drawn with d3 into a responsive SVG.
 *
 * Every chart: thin marks with 4px rounded data-ends, hairline solid grid,
 * text in ink (never the series colour), a hover/focus tooltip that only
 * enhances, and a visually hidden <table> twin so no value is gated behind
 * colour or hover.
 *
 * Loan colours are fixed per entity (option 1/2/3), validated with the dataviz
 * palette checks on white: all pass; the orange is under 3:1, so the charts
 * always carry direct labels and the table twin.
 */
export { LOAN_COLORS };

const INK = CHART.ink;
const MUTED = CHART.muted;
const GRID = CHART.grid;
const EASE = d3.easeExpOut;

const compact = (v) => {
    const a = Math.abs(v);
    if (a >= 1e6) return `₱${+(v / 1e6).toFixed(1)}M`;
    if (a >= 1e3) return `₱${+(v / 1e3).toFixed(a >= 1e4 ? 0 : 1)}K`;
    return `₱${v}`;
};

/** Bar path: square at the baseline, 4px rounded data-end. */
function barPath(x0, y, w, h, r = 4) {
    if (w <= 0) return `M${x0},${y}h0v${h}h0z`;
    r = Math.min(r, w, h / 2);
    return `M${x0},${y}h${w - r}a${r},${r} 0 0 1 ${r},${r}v${h - 2 * r}a${r},${r} 0 0 1 ${-r},${r}h${-(w - r)}z`;
}

/** Trim an SVG text node with an ellipsis until it fits `max` px. */
function fitText(node, max) {
    let s = node.textContent;
    while (s.length > 3 && node.getComputedTextLength() > max) {
        s = s.slice(0, -2);
        node.textContent = `${s.trimEnd()}…`;
    }
}

/**
 * Mounts a d3 drawing into a container that tracks its width. Redraws only on
 * a real width change; animates only the first draw, and never under
 * prefers-reduced-motion.
 */
function useChart(draw, deps) {
    const ref = useRef(null);
    const tipRef = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        let lastWidth = 0;
        let first = true;

        const render = () => {
            const width = Math.floor(el.clientWidth);
            if (!width || width === lastWidth) return;
            lastWidth = width;
            d3.select(el).selectAll('svg').remove();
            const svg = d3.select(el).insert('svg', ':first-child').attr('width', width).attr('aria-hidden', 'true').style('display', 'block').style('overflow', 'visible');
            draw({ svg, width, tip: tooltip(el, tipRef.current), animate: first && !reduce });
            first = false;
        };

        render();
        const ro = new ResizeObserver(render);
        ro.observe(el);
        // Touch has no pointerleave; a scroll dismisses the tooltip instead.
        const hideTip = () => tipRef.current && (tipRef.current.style.opacity = '0');
        window.addEventListener('scroll', hideTip, { passive: true });
        return () => {
            ro.disconnect();
            window.removeEventListener('scroll', hideTip);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { ref, tipRef };
}

/** Tooltip: values lead, labels follow, keyed with a short line in the series colour. */
function tooltip(container, node) {
    const show = (px, py, title, rows) => {
        if (!node) return;
        node.replaceChildren();
        if (title) {
            const t = document.createElement('p');
            t.className = 'chart-tip-title';
            t.textContent = title;
            node.append(t);
        }
        rows.forEach((r) => {
            const row = document.createElement('p');
            row.className = 'chart-tip-row';
            if (r.color) {
                const key = document.createElement('span');
                key.className = 'chart-tip-key';
                key.style.background = r.color;
                row.append(key);
            }
            const v = document.createElement('strong');
            v.textContent = r.value;
            const l = document.createElement('span');
            l.textContent = r.label;
            row.append(v, l);
            node.append(row);
        });
        const cw = container.clientWidth;
        node.style.opacity = '1';
        const w = node.offsetWidth;
        node.style.left = `${Math.max(0, Math.min(px + 14, cw - w))}px`;
        node.style.top = `${Math.max(0, py - node.offsetHeight - 10)}px`;
    };
    const hide = () => node && (node.style.opacity = '0');
    return { show, hide };
}

function ChartShell({ chartRef, tipRef, caption, table, children, footer, height }) {
    return (
        <figure className="m-0">
            {children}
            <div ref={chartRef} className="relative" style={{ minHeight: height }}>
                <div ref={tipRef} className="chart-tip" role="presentation" />
            </div>
            {footer}
            <div className="sr-only">
            <table>
                <caption>{caption}</caption>
                <thead>
                    <tr>
                        {table.head.map((h) => (
                            <th key={h} scope="col">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {table.rows.map((r, i) => (
                        <tr key={i}>
                            {r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </figure>
    );
}

/**
 * Labelled horizontal bars, label above each bar so long names never fight
 * the axis on a phone. One bar per row; `color(d, i)` picks the fill.
 */
function drawRowBars({ svg, width, tip, animate }, { rows, value, max, label, valueLabel, color, ticks, tickFormat, tipRows, bold }) {
    const pad = { top: 4, right: 64, bottom: 24, left: 0 };
    const labelH = 20;
    const bar = 22;
    const gap = 20;
    const rowH = labelH + bar + gap;
    const height = pad.top + rows.length * rowH - gap + pad.bottom;
    svg.attr('height', height);

    const x = d3.scaleLinear().domain([0, max]).range([pad.left, width - pad.right]);
    const plotBottom = height - pad.bottom;

    const grid = svg.append('g');
    (ticks ?? x.ticks(4)).forEach((t) => {
        grid.append('line').attr('x1', x(t)).attr('x2', x(t)).attr('y1', pad.top + labelH - 4).attr('y2', plotBottom).attr('stroke', GRID).attr('stroke-width', 1).attr('shape-rendering', 'crispEdges');
        grid.append('text').attr('x', x(t)).attr('y', height - 6).attr('text-anchor', t === 0 ? 'start' : 'middle').attr('fill', MUTED).attr('font-size', 11).attr('class', 'num').text(tickFormat(t));
    });

    rows.forEach((d, i) => {
        const y = pad.top + i * rowH;
        const w = Math.max(0, x(value(d)) - x(0));
        const g = svg.append('g').attr('class', 'chart-mark').attr('tabindex', 0).attr('role', 'img').attr('aria-label', `${label(d)}: ${valueLabel(d)}`);

        const name = g.append('text').attr('x', 0).attr('y', y + 14).attr('fill', INK).attr('font-size', 13).attr('font-weight', bold?.(d, i) ? 700 : 500).text(label(d));
        fitText(name.node(), width - pad.right);

        g.append('rect').attr('x', 0).attr('y', y).attr('width', width).attr('height', rowH - gap / 2).attr('fill', 'transparent');

        const path = g.append('path').attr('fill', color(d, i)).attr('d', barPath(x(0), y + labelH, w, bar));
        const tipText = g.append('text').attr('x', x(0) + w + 8).attr('y', y + labelH + bar / 2 + 4.5).attr('fill', INK).attr('font-size', 13).attr('font-weight', 600).attr('class', 'num').text(valueLabel(d));

        if (animate) {
            path.transition().duration(900).delay(i * 90).ease(EASE).attrTween('d', () => (t) => barPath(x(0), y + labelH, w * t, bar));
            tipText.attr('opacity', 0).transition().duration(400).delay(500 + i * 90).attr('opacity', 1);
        }

        const enter = (event) => {
            path.attr('opacity', 0.82);
            const [px, py] = event.type === 'focus' ? [x(0) + w, y + labelH] : d3.pointer(event, svg.node());
            tip.show(px, py, label(d), tipRows(d, i));
        };
        const leave = () => {
            path.attr('opacity', 1);
            tip.hide();
        };
        g.on('pointerenter pointermove focus', enter).on('pointerleave blur', leave);
    });
}

/* ---------------------------------------------------------------- Loans */

export function LoanCostChart({ rows, best }) {
    const { ref: chartRef, tipRef } = useChart(
        (ctx) =>
            drawRowBars(ctx, {
                rows,
                value: (d) => d.total_cost,
                max: d3.max(rows, (d) => d.total_cost) * 1.02 || 1,
                label: (d) => (rows.indexOf(d) === best ? `${d.provider} · Recommended` : d.provider),
                bold: (d, i) => i === best,
                valueLabel: (d) => compact(Math.round(d.total_cost)),
                color: (d, i) => LOAN_COLORS[i],
                tickFormat: compact,
                tipRows: (d, i) => [
                    { label: 'total cost', value: money(d.total_cost), color: LOAN_COLORS[i] },
                    { label: 'interest', value: money(d.interest) },
                    { label: 'other fees', value: money(d.fees) },
                ],
            }),
        [rows, best],
    );

    return (
        <ChartShell
            chartRef={chartRef}
            tipRef={tipRef}
            height={rows.length * 62 + 28}
            caption="Total cost of borrowing (interest plus fees) per loan option"
            table={{ head: ['Loan', 'Total cost', 'Interest', 'Fees'], rows: rows.map((r) => [r.provider, money(r.total_cost), money(r.interest), money(r.fees)]) }}
        />
    );
}

/**
 * Amount still owed (scheduled payments left) month by month. Equal monthly
 * payments make each loan a straight descent to zero at its term: the slope is
 * the monthly burden, the x-intercept is how long it lasts.
 */
export function LoanBalanceChart({ rows }) {
    const { ref: chartRef, tipRef } = useChart(
        ({ svg, width, tip, animate }) => {
            const height = 260;
            const pad = { top: 24, right: 16, bottom: 30, left: 52 };
            svg.attr('height', height);

            const series = rows.map((r, i) => ({ ...r, color: LOAN_COLORS[i], start: r.monthly * r.term }));
            const maxTerm = d3.max(series, (s) => s.term);
            const x = d3.scaleLinear().domain([0, maxTerm]).range([pad.left, width - pad.right]);
            const y = d3.scaleLinear().domain([0, d3.max(series, (s) => s.start)]).nice().range([height - pad.bottom, pad.top]);
            const owed = (s, m) => (m >= s.term ? 0 : s.monthly * (s.term - m));

            y.ticks(4).forEach((t) => {
                svg.append('line').attr('x1', pad.left).attr('x2', width - pad.right).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', GRID).attr('shape-rendering', 'crispEdges');
                svg.append('text').attr('x', pad.left - 8).attr('y', y(t) + 4).attr('text-anchor', 'end').attr('fill', MUTED).attr('font-size', 11).attr('class', 'num').text(compact(t));
            });
            x.ticks(Math.min(maxTerm, width < 480 ? 4 : 8)).filter(Number.isInteger).forEach((t) => {
                svg.append('text').attr('x', x(t)).attr('y', height - 8).attr('text-anchor', 'middle').attr('fill', MUTED).attr('font-size', 11).attr('class', 'num').text(t === 0 ? 'Start' : `Mo ${t}`);
            });

            const line = d3.line().x((p) => x(p[0])).y((p) => y(p[1]));
            series.forEach((s, i) => {
                const pts = [[0, s.start], [s.term, 0], [maxTerm, 0]];
                const p = svg.append('path').attr('d', line(pts)).attr('fill', 'none').attr('stroke', s.color).attr('stroke-width', 2).attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round');
                if (animate) {
                    const len = p.node().getTotalLength();
                    p.attr('stroke-dasharray', `${len} ${len}`).attr('stroke-dashoffset', len).transition().duration(1100).delay(i * 120).ease(EASE).attr('stroke-dashoffset', 0).on('end', () => p.attr('stroke-dasharray', null));
                }
                // payoff marker: where this loan reaches zero
                svg.append('circle').attr('cx', x(s.term)).attr('cy', y(0)).attr('r', 4.5).attr('fill', s.color).attr('stroke', '#fff').attr('stroke-width', 2);
            });

            // Direct labels above each payoff dot; skipped where two would collide.
            const placed = [];
            series.forEach((s) => {
                const t = svg.append('text').attr('x', x(s.term)).attr('y', y(0) - 10).attr('text-anchor', 'end').attr('fill', INK).attr('font-size', 12).attr('font-weight', 600).text(s.provider);
                fitText(t.node(), Math.max(60, x(s.term) - pad.left - 4));
                const w = t.node().getComputedTextLength();
                const box = [x(s.term) - w, x(s.term)];
                if (placed.some(([l, r]) => box[0] < r + 8 && box[1] > l - 8)) t.remove();
                else placed.push(box);
            });

            // Crosshair: snaps to the nearest month, lists every loan.
            const cross = svg.append('g').attr('pointer-events', 'none').style('opacity', 0);
            cross.append('line').attr('y1', pad.top).attr('y2', height - pad.bottom).attr('stroke', MUTED).attr('stroke-width', 1);
            const dots = series.map((s) => cross.append('circle').attr('r', 4.5).attr('fill', s.color).attr('stroke', '#fff').attr('stroke-width', 2));

            svg.append('rect')
                .attr('x', pad.left).attr('y', pad.top).attr('width', width - pad.left - pad.right).attr('height', height - pad.top - pad.bottom)
                .attr('fill', 'transparent')
                .style('touch-action', 'pan-y')
                .on('pointermove pointerenter', (event) => {
                    const [px] = d3.pointer(event, svg.node());
                    const m = Math.max(0, Math.min(maxTerm, Math.round(x.invert(px))));
                    cross.style('opacity', 1).select('line').attr('x1', x(m)).attr('x2', x(m));
                    series.forEach((s, i) => dots[i].attr('cx', x(m)).attr('cy', y(owed(s, m))));
                    tip.show(x(m), pad.top + 20, m === 0 ? 'At the start' : `After month ${m}`, series.map((s) => ({
                        color: s.color,
                        value: owed(s, m) > 0 ? money(owed(s, m)) : 'Paid off',
                        label: s.provider,
                    })));
                })
                .on('pointerleave', () => {
                    cross.style('opacity', 0);
                    tip.hide();
                });
        },
        [rows],
    );

    return (
        <ChartShell
            chartRef={chartRef}
            tipRef={tipRef}
            height={260}
            caption="Amount still to repay at the start and after each loan's term"
            table={{ head: ['Loan', 'To repay at start', 'Monthly payment', 'Paid off after'], rows: rows.map((r) => [r.provider, money(r.monthly * r.term), money(r.monthly), `${r.term} months`]) }}
        >
            <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink">
                {rows.map((r, i) => (
                    <li key={i} className="flex items-center gap-2">
                        <span className="h-0.5 w-4 rounded-full" style={{ background: LOAN_COLORS[i] }} aria-hidden="true" />
                        {r.provider}
                    </li>
                ))}
            </ul>
        </ChartShell>
    );
}

/* ------------------------------------------------------------- Capacity */

/**
 * Where each month's income goes, as one part-to-whole bar. The new repayment
 * (green) and existing loans (orange) carry meaning; expenses and the buffer
 * recede to greys. A 2px surface gap separates segments.
 */
export function IncomeSplitChart({ result }) {
    const r = result;
    const buffer = Math.max(0, r.available - r.payment);
    const segments = [
        { key: 'expenses', label: 'Monthly expenses', value: r.expenses, color: CHART.neutral },
        { key: 'existing', label: 'Existing loan payments', value: r.existing, color: CHART.caution },
        { key: 'payment', label: 'Suggested new loan repayment', value: r.payment, color: CHART.accent },
        { key: 'buffer', label: 'Buffer for slow months', value: buffer, color: CHART.track },
    ].filter((s) => s.value > 0);
    const used = d3.sum(segments, (s) => s.value);
    const whole = Math.max(r.income, used) || 1;
    const pct = (v) => (r.income > 0 ? `${Math.round((v / r.income) * 100)}%` : '–');

    const { ref: chartRef, tipRef } = useChart(
        ({ svg, width, tip, animate }) => {
            const bar = 28;
            const top = used > r.income ? 22 : 4;
            const height = top + bar + 6;
            svg.attr('height', height);
            const x = d3.scaleLinear().domain([0, whole]).range([0, width]);

            let acc = 0;
            segments.forEach((s, i) => {
                const x0 = x(acc);
                const w = Math.max(0, x(acc + s.value) - x0 - (i < segments.length - 1 ? 2 : 0));
                acc += s.value;
                const firstSeg = i === 0;
                const lastSeg = i === segments.length - 1;
                const rr = 4;
                const d = (ww) =>
                    `M${x0 + (firstSeg ? rr : 0)},${top}h${Math.max(0, ww - (firstSeg ? rr : 0) - (lastSeg ? rr : 0))}` +
                    (lastSeg ? `a${rr},${rr} 0 0 1 ${rr},${rr}v${bar - 2 * rr}a${rr},${rr} 0 0 1 ${-rr},${rr}` : `v${bar}`) +
                    `h${-Math.max(0, ww - (firstSeg ? rr : 0) - (lastSeg ? rr : 0))}` +
                    (firstSeg ? `a${rr},${rr} 0 0 1 ${-rr},${-rr}v${-(bar - 2 * rr)}a${rr},${rr} 0 0 1 ${rr},${-rr}` : `v${-bar}`) +
                    'z';
                const path = svg.append('path').attr('d', d(w)).attr('fill', s.color).attr('tabindex', 0).attr('class', 'chart-mark').attr('aria-label', `${s.label}: ${money(s.value)}`);
                if (animate) path.attr('opacity', 0).transition().duration(500).delay(i * 140).ease(EASE).attr('opacity', 1);
                path.on('pointerenter pointermove focus', (event) => {
                    path.attr('opacity', 0.82);
                    const [px] = event.type === 'focus' ? [x0 + w / 2] : d3.pointer(event, svg.node());
                    tip.show(px, top, s.label, [{ color: s.color, value: money(s.value), label: `${pct(s.value)} of income` }]);
                }).on('pointerleave blur', () => {
                    path.attr('opacity', 1);
                    tip.hide();
                });
            });

            if (used > r.income) {
                const ix = x(r.income);
                svg.append('line').attr('x1', ix).attr('x2', ix).attr('y1', 2).attr('y2', top + bar + 4).attr('stroke', INK).attr('stroke-width', 1.5);
                svg.append('text').attr('x', ix - 6).attr('y', 13).attr('text-anchor', 'end').attr('fill', INK).attr('font-size', 11).attr('font-weight', 600).text(`Income ${compact(r.income)}`);
            }
        },
        [r.income, r.expenses, r.existing, r.payment, r.available],
    );

    return (
        <ChartShell
            chartRef={chartRef}
            tipRef={tipRef}
            height={40}
            caption="How your monthly income is used"
            table={{ head: ['Part', 'Amount', 'Share of income'], rows: segments.map((s) => [s.label, money(s.value), pct(s.value)]) }}
            footer={
            <ul className="mt-4 grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2" aria-hidden="true">
                {segments.map((s) => (
                    <li key={s.key} className="flex items-center gap-2.5">
                        <span className="h-3 w-3 shrink-0 rounded-[2px]" style={{ background: s.color }} />
                        <span className="flex-1 text-muted">{s.label}</span>
                        <span className="num font-semibold text-ink">{money(s.value)}</span>
                        <span className="num w-10 text-right text-xs text-muted">{pct(s.value)}</span>
                    </li>
                ))}
            </ul>
            }
        />
    );
}

/* ----------------------------------------------------------- Assessment */

/** Overall score as a d3 arc, sweeping in from the top. */
export function ScoreRing({ score, total }) {
    const ref = useRef(null);

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();
        const g = svg.append('g').attr('transform', 'translate(72,72)');
        const arc = d3.arc().innerRadius(52).outerRadius(64).cornerRadius(6).startAngle(0);
        const end = (total ? score / total : 0) * 2 * Math.PI;
        g.append('path').attr('d', arc({ endAngle: 2 * Math.PI })).attr('fill', CHART.track);
        const fg = g.append('path').attr('fill', CHART.accent);
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduce) fg.attr('d', arc({ endAngle: end }));
        else fg.transition().duration(1300).delay(200).ease(EASE).attrTween('d', () => (t) => arc({ endAngle: end * t }));
    }, [score, total]);

    return (
        <div className="relative h-36 w-36 shrink-0">
            <svg ref={ref} viewBox="0 0 144 144" className="h-full w-full" aria-hidden="true" />
            <span className="absolute inset-0 flex items-center justify-center font-display text-3xl font-medium">
                {score}/{total}
            </span>
        </div>
    );
}

/** Correct answers per category; one series, so one colour and no legend. */
export function CategoryScoreChart({ breakdown }) {
    const max = d3.max(breakdown, (d) => d.total) || 1;
    const { ref: chartRef, tipRef } = useChart(
        (ctx) =>
            drawRowBars(ctx, {
                rows: breakdown,
                value: (d) => d.correct,
                max,
                ticks: d3.range(0, max + 1),
                label: (d) => d.name,
                valueLabel: (d) => `${d.correct}/${d.total}`,
                color: () => CHART.accent,
                tickFormat: (t) => String(t),
                tipRows: (d) => [{ label: 'correct', value: `${d.correct} of ${d.total}`, color: CHART.accent }],
            }),
        [breakdown],
    );

    return (
        <ChartShell
            chartRef={chartRef}
            tipRef={tipRef}
            height={breakdown.length * 62 + 28}
            caption="Correct answers per category"
            table={{ head: ['Category', 'Correct', 'Questions'], rows: breakdown.map((d) => [d.name, d.correct, d.total]) }}
        />
    );
}
