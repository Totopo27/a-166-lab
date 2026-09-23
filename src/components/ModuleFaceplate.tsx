import React from 'react';
import type { SectionInputs, SectionOutputs } from '../core/types';

interface Props {
  inputs: SectionInputs;
  outputs: SectionOutputs;
  sectionNumber: 1 | 2;
  onManualGate?: (active: boolean) => void;
  isManualGateActive?: boolean;
}

export const ModuleFaceplate: React.FC<Props> = ({
  inputs,
  outputs,
  sectionNumber,
  onManualGate,
  isManualGateActive,
}) => {
  return (
    <div className="w-56 bg-[#d4d4d8] text-neutral-900 border-2 border-neutral-400 rounded-sm shadow-2xl font-mono flex flex-col items-center select-none py-3 px-2">
      {/* Tornillos superiores estilo Doepfer */}
      <div className="w-full flex justify-between px-2 text-neutral-600 text-xs mb-1">
        <span>⊕</span>
        <span className="font-sans font-bold text-[10px] tracking-widest text-neutral-800">DOEPFER</span>
        <span>⊕</span>
      </div>

      <div className="text-center border-b-2 border-neutral-800 w-full pb-1 mb-2">
        <h2 className="text-xs font-black tracking-tight">A-166 LOGIC</h2>
        <span className="text-[9px] font-semibold text-neutral-700">Dual Logic Module</span>
      </div>

      {/* Sección 1 o 2 */}
      <div className="w-full bg-neutral-300/80 border border-neutral-400 rounded p-2 flex flex-col items-center gap-2 mb-2">
        <div className="text-[10px] font-bold tracking-wider text-neutral-800">
          — SECTION {sectionNumber} —
        </div>

        {/* Entradas */}
        <div className="grid grid-cols-2 gap-4 w-full px-2">
          {/* Jack Entrada 1 */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold mb-0.5">IN 1</span>
            <div className={`w-9 h-9 rounded-full border-4 border-neutral-700 flex items-center justify-center shadow-inner relative ${
              inputs.in1 ? 'bg-amber-400 border-amber-600 shadow-amber-300' : 'bg-neutral-800'
            }`}>
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-neutral-500"></div>
              {/* LED indicador Doepfer */}
              <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-neutral-900 ${
                inputs.in1 ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-neutral-600'
              }`} />
            </div>
          </div>

          {/* Jack Entrada 2 */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold mb-0.5">IN 2</span>
            <div className={`w-9 h-9 rounded-full border-4 border-neutral-700 flex items-center justify-center shadow-inner relative ${
              inputs.in2 ? 'bg-purple-400 border-purple-600 shadow-purple-300' : 'bg-neutral-800'
            }`}>
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-neutral-500"></div>
              <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-neutral-900 ${
                inputs.in2 ? 'bg-purple-400 shadow-[0_0_8px_#c084fc]' : 'bg-neutral-600'
              }`} />
            </div>
          </div>
        </div>

        {/* Pulsador manual auxiliar para testing rápido */}
        {onManualGate && (
          <div className="w-full flex flex-col items-center mt-1 pt-1 border-t border-neutral-400/80">
            <button
              onMouseDown={() => onManualGate(true)}
              onMouseUp={() => onManualGate(false)}
              onTouchStart={() => onManualGate(true)}
              onTouchEnd={() => onManualGate(false)}
              className={`w-full py-1 text-[10px] font-bold uppercase rounded border transition-all ${
                isManualGateActive
                  ? 'bg-red-500 text-white border-red-700 shadow-inner'
                  : 'bg-neutral-200 hover:bg-neutral-100 text-neutral-800 border-neutral-400 shadow'
              }`}
            >
              {isManualGateActive ? 'GATE HIGH (+5V)' : 'PULSAR MANUAL (IN 2)'}
            </button>
          </div>
        )}

        {/* Salidas Lógicas Principales */}
        <div className="w-full mt-1">
          <div className="text-[8px] font-bold text-center text-neutral-600 mb-1">SALIDAS DIRECTAS</div>
          <div className="grid grid-cols-3 gap-2 w-full text-center">
            {/* AND */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold">AND</span>
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-neutral-900 border-2 border-neutral-600 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                </div>
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-neutral-900 ${
                  outputs.and ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-neutral-700'
                }`} />
              </div>
            </div>

            {/* OR */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold">OR</span>
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-neutral-900 border-2 border-neutral-600 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                </div>
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-neutral-900 ${
                  outputs.or ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-neutral-700'
                }`} />
              </div>
            </div>

            {/* XOR */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold">XOR</span>
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-neutral-900 border-2 border-neutral-600 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                </div>
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-neutral-900 ${
                  outputs.xor ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-neutral-700'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Salidas Negadas (Invertidas) */}
        <div className="w-full mt-1">
          <div className="text-[8px] font-bold text-center text-neutral-600 mb-1">SALIDAS INVERTIDAS</div>
          <div className="grid grid-cols-3 gap-2 w-full text-center">
            {/* NAND */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-bold text-neutral-600">NAND</span>
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-neutral-800 border-2 border-neutral-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
                <div className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${
                  outputs.nand ? 'bg-red-500 shadow-[0_0_4px_#ef4444]' : 'bg-neutral-700'
                }`} />
              </div>
            </div>

            {/* NOR */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-bold text-neutral-600">NOR</span>
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-neutral-800 border-2 border-neutral-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
                <div className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${
                  outputs.nor ? 'bg-red-500 shadow-[0_0_4px_#ef4444]' : 'bg-neutral-700'
                }`} />
              </div>
            </div>

            {/* XNOR */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-bold text-neutral-600">XNOR</span>
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-neutral-800 border-2 border-neutral-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
                <div className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${
                  outputs.xnor ? 'bg-red-500 shadow-[0_0_4px_#ef4444]' : 'bg-neutral-700'
                }`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inversor independiente que tiene el A-166 real en la base */}
      <div className="w-full bg-neutral-300/80 border border-neutral-400 rounded p-1.5 flex justify-around items-center mt-auto">
        <div className="text-[9px] font-bold">INV IN</div>
        <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-600 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-black"></div>
        </div>
        <span className="text-xs">➔</span>
        <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-600 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-black"></div>
        </div>
        <div className="text-[9px] font-bold">OUT</div>
      </div>

      {/* Tornillos inferiores */}
      <div className="w-full flex justify-between px-2 text-neutral-600 text-xs mt-2">
        <span>⊕</span>
        <span className="text-[8px] text-neutral-500">A-166</span>
        <span>⊕</span>
      </div>
    </div>
  );
};
