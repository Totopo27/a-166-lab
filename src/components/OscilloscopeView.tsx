import React, { useEffect, useRef } from 'react';

interface HistoryPoint {
  in1: boolean;
  in2: boolean;
  and: boolean;
  or: boolean;
  xor: boolean;
}

interface Props {
  history: HistoryPoint[];
  currentStepIndex: number;
}

export const OscilloscopeView: React.FC<Props> = ({ history }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const width = canvas.width;
    const height = canvas.height;

    // Clear background (Dark grid modular style)
    ctx.fillStyle = '#0f1115';
    ctx.fillRect(0, 0, width, height);

    // Draw subtle grid lines
    ctx.strokeStyle = '#1e2430';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    const channels: { label: string; color: string; key: keyof HistoryPoint }[] = [
      { label: 'IN 1', color: '#f59e0b', key: 'in1' },
      { label: 'IN 2', color: '#c084fc', key: 'in2' },
      { label: 'AND (&)', color: '#38bdf8', key: 'and' },
      { label: 'OR (≥1)', color: '#fb923c', key: 'or' },
      { label: 'XOR (=1)', color: '#f472b6', key: 'xor' },
    ];

    const channelHeight = height / channels.length;

    channels.forEach((ch, chIdx) => {
      const topY = chIdx * channelHeight;
      const bottomY = topY + channelHeight;
      const highY = topY + 6;
      const lowY = bottomY - 6;

      // Divider line
      ctx.strokeStyle = '#1e232d';
      ctx.beginPath();
      ctx.moveTo(0, bottomY);
      ctx.lineTo(width, bottomY);
      ctx.stroke();

      // Channel Label
      ctx.fillStyle = ch.color;
      ctx.font = 'bold 10px monospace';
      ctx.fillText(ch.label, 8, topY + 14);

      if (history.length < 2) return;

      // Trace pulses
      ctx.strokeStyle = ch.color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const stepWidth = width / 64; // Mostramos los últimos 64 pulsos

      // Start from right to left or left to right
      const startIndex = Math.max(0, history.length - 64);
      const visibleData = history.slice(startIndex);

      visibleData.forEach((point, i) => {
        const x = i * stepWidth;
        const isHigh = Boolean(point[ch.key]);
        const y = isHigh ? highY : lowY;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevHigh = Boolean(visibleData[i - 1][ch.key]);
          const prevY = prevHigh ? highY : lowY;
          if (prevY !== y) {
            // Flanco vertical
            ctx.lineTo(x, prevY);
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      });

      ctx.stroke();
    });
  }, [history]);

  return (
    <div className="bg-[#12141a] border border-neutral-800 rounded-lg p-3 flex flex-col shadow-xl">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          Osciloscopio / Señales de Gate en Tiempo Real
        </h3>
        <span className="text-[10px] font-mono text-neutral-500">Timeline de pulsos continuos</span>
      </div>
      <canvas
        ref={canvasRef}
        width={720}
        height={220}
        className="w-full rounded border border-neutral-900 bg-[#0c0d12]"
      />
    </div>
  );
};
