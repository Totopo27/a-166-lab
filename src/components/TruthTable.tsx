import React from 'react';
import type { LogicGateType, SectionOutputs } from '../core/types';
import { TRUTH_TABLE } from '../core/logicEngine';

interface Props {
  in1: boolean;
  in2: boolean;
  outputs: SectionOutputs;
  highlightGate?: LogicGateType;
}

export const TruthTable: React.FC<Props> = ({ in1, in2, outputs, highlightGate }) => {
  return (
    <div className="bg-[#18191c] border border-neutral-700/70 rounded-lg p-4 shadow-xl text-neutral-200">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
        <h3 className="font-mono text-sm uppercase tracking-wider text-neutral-400 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Tabla de Verdad Viva (Doepfer A-166 Section)
        </h3>
        <span className="text-xs font-mono text-neutral-500">
          Estado actual: <b className="text-amber-400">IN 1: {in1 ? '1' : '0'}</b> | <b className="text-purple-400">IN 2: {in2 ? '1' : '0'}</b>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-900/90 text-neutral-400 border-b border-neutral-700">
              <th className="py-2 px-3 text-amber-300 font-bold border-r border-neutral-800">IN 1</th>
              <th className="py-2 px-3 text-purple-300 font-bold border-r border-neutral-700">IN 2</th>
              <th className={`py-2 px-3 ${highlightGate === 'AND' ? 'bg-cyan-950 text-cyan-300 font-black' : ''}`}>AND (&amp;)</th>
              <th className={`py-2 px-3 ${highlightGate === 'OR' ? 'bg-orange-950 text-orange-300 font-black' : ''}`}>OR (≥1)</th>
              <th className={`py-2 px-3 ${highlightGate === 'XOR' ? 'bg-pink-950 text-pink-300 font-black' : ''}`}>XOR (=1)</th>
              <th className="py-2 px-3 text-neutral-500">NAND</th>
              <th className="py-2 px-3 text-neutral-500">NOR</th>
              <th className="py-2 px-3 text-neutral-500">XNOR</th>
            </tr>
          </thead>
          <tbody>
            {TRUTH_TABLE.map((row, idx) => {
              const isCurrent = row.in1 === in1 && row.in2 === in2;
              return (
                <tr
                  key={idx}
                  className={`transition-colors duration-100 border-b border-neutral-800/60 ${
                    isCurrent
                      ? 'bg-amber-500/20 text-white font-bold border-l-4 border-l-amber-400 ring-1 ring-amber-500/30'
                      : 'hover:bg-neutral-800/40 text-neutral-400'
                  }`}
                >
                  <td className="py-2 px-3 border-r border-neutral-800 text-amber-400">{row.in1 ? '1' : '0'}</td>
                  <td className="py-2 px-3 border-r border-neutral-700 text-purple-400">{row.in2 ? '1' : '0'}</td>
                  
                  {/* AND */}
                  <td className={`py-2 px-3 ${row.and ? 'text-emerald-400 font-bold' : 'text-neutral-600'} ${
                    highlightGate === 'AND' ? 'bg-cyan-900/30' : ''
                  }`}>
                    {row.and ? '1' : '0'}
                  </td>

                  {/* OR */}
                  <td className={`py-2 px-3 ${row.or ? 'text-emerald-400 font-bold' : 'text-neutral-600'} ${
                    highlightGate === 'OR' ? 'bg-orange-900/30' : ''
                  }`}>
                    {row.or ? '1' : '0'}
                  </td>

                  {/* XOR */}
                  <td className={`py-2 px-3 ${row.xor ? 'text-emerald-400 font-bold' : 'text-neutral-600'} ${
                    highlightGate === 'XOR' ? 'bg-pink-900/30' : ''
                  }`}>
                    {row.xor ? '1' : '0'}
                  </td>

                  {/* Inverted outputs */}
                  <td className={`py-2 px-3 ${row.nand ? 'text-emerald-400/80' : 'text-neutral-600'}`}>
                    {row.nand ? '1' : '0'}
                  </td>
                  <td className={`py-2 px-3 ${row.nor ? 'text-emerald-400/80' : 'text-neutral-600'}`}>
                    {row.nor ? '1' : '0'}
                  </td>
                  <td className={`py-2 px-3 ${row.xnor ? 'text-emerald-400/80' : 'text-neutral-600'}`}>
                    {row.xnor ? '1' : '0'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-2 border-t border-neutral-800 flex justify-between items-center text-[11px] text-neutral-400">
        <p>
          💡 <b>1 = +5V (Gate Alto)</b> | <b>0 = 0V (Gate Bajo/GND)</b>
        </p>
        <div className="flex gap-2 items-center">
          <span>Salidas activas ahora:</span>
          {outputs.and && <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded font-mono font-bold">AND</span>}
          {outputs.or && <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded font-mono font-bold">OR</span>}
          {outputs.xor && <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded font-mono font-bold">XOR</span>}
        </div>
      </div>
    </div>
  );
};
