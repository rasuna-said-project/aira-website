export default function MonitoringChart({ data }) {
  const width = 730;
  const height = 250;
  const left = 45;
  const right = 690;
  const top = 20;
  const bottom = 220;
  const maxValue = 14;

  const points = data.map((item, index) => {
    const x =
      data.length === 1
        ? (left + right) / 2
        : left + (index / (data.length - 1)) * (right - left);

    const y = bottom - (item.value / maxValue) * (bottom - top);

    return { ...item, x, y };
  });

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${bottom} L ${points[0].x} ${bottom} Z`
      : "";

  const firstHalf = data.slice(0, Math.ceil(data.length / 2));
  const secondHalf = data.slice(Math.ceil(data.length / 2));

  const average = (items) =>
    items.length
      ? items.reduce((total, item) => total + item.value, 0) / items.length
      : 0;

  const firstAverage = average(firstHalf);
  const secondAverage = average(secondHalf);
  const difference = secondAverage - firstAverage;

  const formatDays = (value) => `${value.toFixed(1).replace(".", ",")} hari`;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(30,80,90,0.07)] sm:p-6">
      <h2 className="text-base font-semibold text-[#176B78]">
        Tren ketahanan air (hari)
      </h2>

      <div className="mt-4 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label="Grafik tren ketahanan air berdasarkan catatan pemantauan"
        >
          <defs>
            <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#176B78" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#176B78" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {[14, 7, 3, 0].map((value) => {
            const y = bottom - (value / maxValue) * (bottom - top);

            return (
              <g key={value}>
                <line
                  x1={left}
                  y1={y}
                  x2={right}
                  y2={y}
                  stroke="#E8EFF0"
                  strokeWidth="1"
                />
                <text
                  x="30"
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#7D8B90"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Garis batas aman */}
          <line
            x1={left}
            y1={bottom - (7 / maxValue) * (bottom - top)}
            x2={right}
            y2={bottom - (7 / maxValue) * (bottom - top)}
            stroke="#4EA8DE"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text x={right} y="132" textAnchor="end" fontSize="9" fill="#4EA8DE">
            Aman
          </text>

          {/* Garis batas krisis */}
          <line
            x1={left}
            y1={bottom - (3 / maxValue) * (bottom - top)}
            x2={right}
            y2={bottom - (3 / maxValue) * (bottom - top)}
            stroke="#E99A83"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text x={right} y="190" textAnchor="end" fontSize="9" fill="#D77C68">
            Krisis
          </text>

          {points.length > 1 && (
            <>
              <path d={areaPath} fill="url(#chartArea)" />
              <path
                d={linePath}
                fill="none"
                stroke="#176B78"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

            {points.map((point) => (
                <circle
                key={point.id}
                cx={point.x}
                cy={point.y}
                r="3.5"
                fill="#176B78"
                 stroke="white"
                strokeWidth="1.5"
                aria-label={`${point.date}: ${formatDays(point.value)}`}
            />
        ))}

          {points.map((point) => (
            <text
              key={`${point.id}-label`}
              x={point.x}
              y="240"
              textAnchor="middle"
              fontSize="11"
              fill="#68777D"
            >
              {point.date}
            </text>
          ))}
        </svg>
      </div>

      {/* Ringkasan grafik */}
      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-[#F6F8F8] p-3">
          <p className="text-xs text-gray-400">Paruh awal (rata-rata)</p>
          <p className="mt-1 text-lg font-semibold text-[#176B78]">
            {formatDays(firstAverage)}
          </p>
        </div>

        <div className="rounded-xl bg-[#F6F8F8] p-3">
          <p className="text-xs text-gray-400">Paruh akhir (rata-rata)</p>
          <p className="mt-1 text-lg font-semibold text-[#176B78]">
            {formatDays(secondAverage)}
          </p>
        </div>

        <div className="rounded-xl bg-[#D7EEE7] p-3">
          <p className="text-xs text-gray-500">Perubahan</p>
          <p className="mt-1 text-lg font-semibold text-[#176B78]">
            {difference >= 0 ? "↗ +" : "↘ "}
            {formatDays(Math.abs(difference))}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-gray-400">
        Grafik diperbarui berdasarkan catatan manual. Estimasi menggunakan
        kebutuhan simulasi 70 liter per hari.
      </p>
    </section>
  );
} 