"use client";
import { MARKET_CONFIG } from "@/platform/market";
import { Dashboard } from "@/platform/domain";
import { money } from "@/platform/format";
import { revenueGeometry } from "@/platform/chart";
import { useId, useState } from "react";
import { Row, Text, EmptyState } from "./ui";
export function RevenueChart({ data }: { data: Dashboard["trend"] }) {
  const [hover, setHover] = useState<number | null>(null);
  const gradientId = useId();
  const selected = hover === null ? undefined : data[hover];
  const width = 740,
    height = 190;
  const { ceiling: max, x, y } = revenueGeometry(data, width, height);
  if (!data.length)
    return (
      <EmptyState
        title="No revenue in this period"
        description="Revenue will appear here after your first completed sale."
      />
    );
  const points = (key: "services" | "products") =>
    data.map((d, i) => `${x(i)},${y(d[key])}`).join(" ");
  return (
    <div className="v-chart">
      <div className="v-chart-axis">
        {[1, 0.75, 0.5, 0.25, 0].map((v) => (
          <span key={v}>{Math.round((max * v) / 100000)}k</span>
        ))}
      </div>
      <div className="v-chart-plot">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`Service and product revenue in ${MARKET_CONFIG.currency.code}`}
        >
          <title>
            Revenue by period. Detailed values are available below the chart.
          </title>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#793b52" stopOpacity=".13" />
              <stop offset="100%" stopColor="#793b52" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((v) => (
            <line
              key={v}
              x1="0"
              x2={width}
              y1={y(max * v)}
              y2={y(max * v)}
              stroke="#edecef"
              strokeDasharray="3 4"
            />
          ))}
          <polygon
            points={`20,${height} ${points("services")} ${width - 20},${height}`}
            fill={`url(#${gradientId})`}
          />
          <polyline
            points={points("services")}
            fill="none"
            stroke="#793b52"
            strokeWidth="2.7"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            points={points("products")}
            fill="none"
            stroke="#c2a36b"
            strokeWidth="2.5"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {data.map((d, i) => (
            <g
              key={`${d.label}-${i}`}
              tabIndex={0}
              role="button"
              aria-label={`${d.label}: services ${money({ amount: d.services, currency: MARKET_CONFIG.currency.code })}, products ${money({ amount: d.products, currency: MARKET_CONFIG.currency.code })}`}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              onClick={() => setHover(i)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setHover(i);
                }
                if (event.key === "Escape") setHover(null);
              }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <rect
                x={x(i) - 20}
                y="0"
                width={Math.max(
                  40,
                  (width - 40) / Math.max(1, data.length - 1),
                )}
                height={height}
                fill="transparent"
              />
              {hover === i && (
                <>
                  <line
                    x1={x(i)}
                    x2={x(i)}
                    y1="0"
                    y2={height}
                    stroke="#a49ca0"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={x(i)}
                    cy={y(d.services)}
                    r="5"
                    fill="#793b52"
                    stroke="white"
                    strokeWidth="2"
                  />
                </>
              )}
            </g>
          ))}
        </svg>
        <Row className="v-chart-labels">
          {data.map((d) => (
            <Text key={d.label}>{d.label}</Text>
          ))}
        </Row>
      </div>
      {selected && (
        <div className="v-chart-tooltip">
          {selected.label} · Services{" "}
          {money({
            amount: selected.services,
            currency: MARKET_CONFIG.currency.code,
          })}{" "}
          · Products{" "}
          {money({
            amount: selected.products,
            currency: MARKET_CONFIG.currency.code,
          })}
        </div>
      )}
      <details className="v-chart-data">
        <summary>View chart data</summary>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Services ({MARKET_CONFIG.currency.code})</th>
              <th>Products ({MARKET_CONFIG.currency.code})</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.label}>
                <td>{d.label}</td>
                <td>
                  {money({
                    amount: d.services,
                    currency: MARKET_CONFIG.currency.code,
                  })}
                </td>
                <td>
                  {money({
                    amount: d.products,
                    currency: MARKET_CONFIG.currency.code,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
