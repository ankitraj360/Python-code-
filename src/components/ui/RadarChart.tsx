'use client';

import { motion } from 'framer-motion';

interface RadarChartProps {
  scores: {
    technical: number;
    seo: number;
    content: number;
    ux: number;
    conversion: number;
    authority: number;
  };
}

export function RadarChart({ scores }: RadarChartProps) {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.4;
  
  const categories = [
    { key: 'technical', label: 'Technical' },
    { key: 'seo', label: 'SEO' },
    { key: 'content', label: 'Content' },
    { key: 'ux', label: 'UX' },
    { key: 'conversion', label: 'Conversion' },
    { key: 'authority', label: 'Authority' },
  ];

  const angleStep = (Math.PI * 2) / categories.length;

  const getPoint = (score: number, index: number, maxRadius: number) => {
    const angle = index * angleStep - Math.PI / 2;
    // New scores are 0-100, so we divide by 100
    const r = (Math.min(100, Math.max(0, score)) / 100) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const points = categories.map((cat, i) => getPoint((scores as any)[cat.key] || 0, i, radius));
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="flex justify-center items-center w-full aspect-square relative">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Hexagons */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => {
          const bgPoints = categories.map((_, i) => getPoint(100 * scale, i, radius));
          const bgPath = bgPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          return (
            <path
              key={scale}
              d={bgPath}
              fill="none"
              stroke="white"
              strokeOpacity="0.05"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Lines */}
        {categories.map((_, i) => {
          const p = getPoint(100, i, radius);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="white"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Area */}
        <motion.path
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d={pathData}
          fill="rgba(0, 242, 255, 0.1)"
          stroke="#00f2ff"
          strokeWidth="3"
          className="drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]"
        />

        {/* Labels */}
        {categories.map((cat, i) => {
          const p = getPoint(115, i, radius);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              fill="white"
              fillOpacity="0.4"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              className="uppercase tracking-widest"
            >
              {cat.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
