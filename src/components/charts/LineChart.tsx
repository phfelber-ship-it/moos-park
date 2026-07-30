"use client";

import { useId, useState } from "react";
import "./chart-tokens.css";

type Point = { label: string; value: number };

const WIDTH = 640;
const HEIGHT = 220;
const PAD_LEFT = 40;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;

export default function LineChart({ data }: { data: Point[] }) {
  const clipId = useId();
  const [hover, setHover] = useState<number | null>(null);

  if (data.length === 0) {
    return <p className="text-sm text-foreground/50">Keine Daten.</p>;
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const innerW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const x = (i: number) => PAD_LEFT + i * stepX;
  const y = (v: number) => PAD_TOP + innerH - (v / max) * innerH;

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`)
    .join(" ");
  const areaPath = `${linePath} L${x(data.length - 1)},${PAD_TOP + innerH} L${x(0)},${PAD_TOP + innerH} Z`;

  const gridLines = 4;
  const active = hover !== null ? data[hover] : null;

  return (
    <div className="viz-root relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Sitzungen pro Tag, letzte 30 Tage"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD_LEFT} y={PAD_TOP} width={innerW} height={innerH} />
          </clipPath>
        </defs>

        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const gy = PAD_TOP + (innerH / gridLines) * i;
          const val = Math.round(max - (max / gridLines) * i);
          return (
            <g key={i}>
              <line
                x1={PAD_LEFT}
                x2={WIDTH - PAD_RIGHT}
                y1={gy}
                y2={gy}
                stroke="var(--viz-grid)"
                strokeWidth={1}
              />
              <text
                x={PAD_LEFT - 8}
                y={gy + 4}
                textAnchor="end"
                fontSize={10}
                fill="var(--viz-muted)"
              >
                {val}
              </text>
            </g>
          );
        })}

        <path
          d={areaPath}
          fill="var(--viz-sequential)"
          opacity={0.1}
          clipPath={`url(#${clipId})`}
        />
        <path
          d={linePath}
          fill="none"
          stroke="var(--viz-sequential)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {data.map((d, i) => (
          <circle
            key={d.label}
            cx={x(i)}
            cy={y(d.value)}
            r={hover === i ? 5 : 3}
            fill="var(--viz-sequential)"
            stroke="var(--background)"
            strokeWidth={2}
          />
        ))}

        {data.map((d, i) => (
          <rect
            key={d.label}
            x={x(i) - stepX / 2}
            y={PAD_TOP}
            width={stepX || innerW}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}

        {data.length > 0 && (
          <text
            x={x(data.length - 1)}
            y={y(data[data.length - 1].value) - 10}
            textAnchor="end"
            fontSize={11}
            fontWeight={700}
            fill="var(--viz-text)"
          >
            {data[data.length - 1].value}
          </text>
        )}

        {data
          .filter((_, i) => i % Math.ceil(data.length / 6) === 0)
          .map((d) => (
            <text
              key={d.label}
              x={x(data.indexOf(d))}
              y={HEIGHT - 8}
              textAnchor="middle"
              fontSize={10}
              fill="var(--viz-muted)"
            >
              {d.label}
            </text>
          ))}
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute rounded-lg border border-foreground/10 bg-background px-3 py-1.5 text-xs shadow-lg"
          style={{
            left: `${(x(hover!) / WIDTH) * 100}%`,
            top: 0,
            transform: "translate(-50%, -100%)",
          }}
        >
          <span className="font-bold text-foreground">{active.value}</span>{" "}
          <span className="text-foreground/50">Sitzungen · {active.label}</span>
        </div>
      )}
    </div>
  );
}
