import { useState } from 'react';
import { 
  Layers, 
  Sliders, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  ExternalLink 
} from 'lucide-react';

// Tipos de lógica
type LogicGate = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'XNOR';

interface VoiceConfig {
  name: string;
  interval: string;
  ratio: string;
  cents: number;
  freq: number;
  description: string;
}

const VOICES_MICROTONAL: VoiceConfig[] = [
  { name: 'Voz 1', interval: 'Tónica Fundamental', ratio: '1/1', cents: 0, freq: 110.0, description: 'Ancla armónica base' },
  { name: 'Voz 2', interval: '3ª Neutra Microtonal', ratio: '11/9 (24-EDO)', cents: 353, freq: 134.7, description: 'Intermedio ambiguo entre mayor y menor' },
  { name: 'Voz 3', interval: '5ª Justa Pitagórica', ratio: '3/2', cents: 702, freq: 165.0, description: 'Estabilidad y consonancia pura' },
  { name: 'Voz 4', interval: '7ª Subarmónica / Armónica', ratio: '7/4', cents: 969, freq: 192.5, description: 'Tensión modal microtonal' },
];

export function App() {
  // Estado de las 4 entradas de Gate del µTune (0V = false, +5V = true)
  const [gates, setGates] = useState<[boolean, boolean, boolean, boolean]>([true, false, true, false]);

  // Evaluar funciones lógicas
  const evaluateGate = (gateType: LogicGate, a: boolean, b: boolean): boolean => {
    switch (gateType) {
      case 'AND': return a && b;
      case 'OR': return a || b;
      case 'XOR': return a !== b;
      case 'NAND': return !(a && b);
      case 'NOR': return !(a || b);
      case 'XNOR': return a === b;
    }
  };

  // Resultados calculados del Doepfer A-166 Sección 1 (G1 y G2)
  const sec1_and = evaluateGate('AND', gates[0], gates[1]);
  const sec1_or = evaluateGate('OR', gates[0], gates[1]);
  const sec1_xor = evaluateGate('XOR', gates[0], gates[1]);

  // Resultados calculados del Doepfer A-166 Sección 2 (G3 y G4)
  const sec2_or = evaluateGate('OR', gates[2], gates[3]);

  // Resultado de Combinación Cuádruple en Cascada (OR Global hacia MultiWAVE Activate)
  const multiwaveActivate = sec1_or || sec2_or;

  // Voltaje sumado en el Doepfer A-185-2 Precision Adder (1V/Oct)
  const activeVoicesCount = gates.filter(Boolean).length;
  const summedPitchCV = gates.reduce((acc, active, idx) => {
    return active ? acc + (VOICES_MICROTONAL[idx].cents / 1200) : acc;
  }, 0);

  const toggleGate = (index: number) => {
    setGates(prev => {
      const next = [...prev] as [boolean, boolean, boolean, boolean];
      next[index] = !next[index];
      return next;
    });
  };

  // Tabla completa de 16 estados posibles para 4 entradas binarias (2^4 = 16 combinaciones)
  const ALL_COMBINATIONS = Array.from({ length: 16 }, (_, i) => {
    const g1 = Boolean((i >> 3) & 1);
    const g2 = Boolean((i >> 2) & 1);
    const g3 = Boolean((i >> 1) & 1);
    const g4 = Boolean(i & 1);
    const orCombined = g1 || g2 || g3 || g4;
    const andCombined = g1 && g2 && g3 && g4;
    const xorSec1 = g1 !== g2;
    const xorSec2 = g3 !== g4;
    const activeCount = [g1, g2, g3, g4].filter(Boolean).length;
    const isCurrent = g1 === gates[0] && g2 === gates[1] && g3 === gates[2] && g4 === gates[3];

    return {
      index: i,
      g1, g2, g3, g4,
      orCombined,
      andCombined,
      xorSec1,
      xorSec2,
      activeCount,
      isCurrent
    };
  });

  return (
    <div className="min-h-screen bg-[#0d0e14] text-neutral-100 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 border-b border-neutral-800 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              DOEPFER A-166 + A-185-2 + MULTIWAVE
            </span>
            <span className="text-xs text-neutral-500 font-mono">LABORATORIO DE TABLAS DE VERDAD</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Matriz de Verdad &amp; Acordes Microtonales
          </h1>
          <p className="text-sm text-neutral-400 max-w-3xl mt-1">
            Simula en tiempo real qué ocurre con la afinación (A-185-2 Precision Adder) y la articulación del acorde (A-166 OR Gate) cuando combinas las 4 voces del µTune hacia la entrada Activate de tu Make Noise MultiWAVE.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="./multiwave-4voice-chord.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-300 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver Diagrama Archify
          </a>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Panel Izquierdo: Control Interactivo de las 4 Voces del µTune */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#141620] border border-neutral-800 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-neutral-800/80 pb-3">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                1. Salidas de Voz del µTune (Gates)
              </h2>
              <span className="text-[10px] font-mono text-neutral-500">Haz clic para conmutar 0V / +5V</span>
            </div>

            <div className="space-y-3">
              {VOICES_MICROTONAL.map((voice, idx) => {
                const isActive = gates[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleGate(idx)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all select-none flex items-center justify-between ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                        : 'bg-neutral-900/60 border-neutral-800/80 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        isActive ? 'bg-amber-500 text-black shadow-md' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        G{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-neutral-200">{voice.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-amber-300">
                            +{voice.cents} cents
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400">
                          {voice.interval} <span className="text-neutral-500">({voice.ratio})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold ${isActive ? 'text-emerald-400' : 'text-neutral-600'}`}>
                        {isActive ? '+5V (HIGH)' : '0V (LOW)'}
                      </span>
                      {isActive ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-neutral-700" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumen del Estado Actual */}
            <div className="mt-5 p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-400">Voces Activas en el Acorde:</span>
                <span className="text-amber-400 font-bold">{activeVoicesCount} de 4</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-400">Suma de Voltaje (A-185-2 ➔ V/OCT):</span>
                <span className="text-cyan-400 font-bold">+{summedPitchCV.toFixed(3)} V</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-neutral-900">
                <span className="text-neutral-400">Salida Lógica Combinada (A-166 ➔ ACTIVATE):</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  multiwaveActivate ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950/40 text-red-400 border border-red-900/50'
                }`}>
                  {multiwaveActivate ? 'DISPARADO (+5V)' : 'SILENCIO (0V)'}
                </span>
              </div>
            </div>
          </div>

          {/* Comportamiento según el módulo físico */}
          <div className="bg-[#141620] border border-neutral-800 rounded-xl p-5 shadow-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4" />
              2. Doepfer A-166 Dual Logic: Evaluación en Vivo
            </h3>
            
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs mb-4">
              <div className={`p-2.5 rounded-lg border ${sec1_and ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-bold shadow' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                <div className="text-[10px] text-neutral-400">G1 AND G2</div>
                <div className="text-base font-black mt-0.5">{sec1_and ? '1' : '0'}</div>
                <div className="text-[9px] text-neutral-500">Acento común</div>
              </div>

              <div className={`p-2.5 rounded-lg border ${sec1_or ? 'bg-orange-950/80 border-orange-500 text-orange-200 font-bold shadow' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                <div className="text-[10px] text-neutral-400">G1 OR G2</div>
                <div className="text-base font-black mt-0.5">{sec1_or ? '1' : '0'}</div>
                <div className="text-[9px] text-neutral-500">Combiner Sec 1</div>
              </div>

              <div className={`p-2.5 rounded-lg border ${sec1_xor ? 'bg-pink-950/80 border-pink-500 text-pink-200 font-bold shadow' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                <div className="text-[10px] text-neutral-400">G1 XOR G2</div>
                <div className="text-base font-black mt-0.5">{sec1_xor ? '1' : '0'}</div>
                <div className="text-[9px] text-neutral-500">Síncopa modal</div>
              </div>
            </div>

            <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg text-xs text-neutral-300 leading-relaxed">
              <b>Conexion hacia MultiWAVE:</b> Enlazar la salida <b>OR</b> de la Seccion 1 con la entrada 1 de la Seccion 2 en el A-166 crea una compuerta <b>OR cuadruple en cascada</b>. Cualquier actividad en las 4 voces del uTune dispara la entrada <code>Activate</code> sin poner en corto las salidas.
            </div>
          </div>
        </div>

        {/* Panel Derecho: Tabla de Verdad de 16 Estados (El mapa completo) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#141620] border border-neutral-800 rounded-xl p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-neutral-800/80 pb-3">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  3. Tabla de Verdad Completa (16 Combinaciones Binarias 2⁴)
                </h3>
                <p className="text-[11px] text-neutral-400">
                  La fila resaltada en dorado refleja tu selección interactiva en tiempo real.
                </p>
              </div>

              <span className="text-[10px] font-mono px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
                Fila actual: <b className="text-amber-400">{gates.map(g => g ? '1' : '0').join('')}</b>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-900/90 text-neutral-400 border-b border-neutral-700 text-[11px]">
                    <th className="py-2.5 px-2 text-neutral-500">#</th>
                    <th className="py-2.5 px-2 text-amber-300 font-bold border-l border-neutral-800">G1 (Tónica)</th>
                    <th className="py-2.5 px-2 text-amber-300 font-bold">G2 (3ª N)</th>
                    <th className="py-2.5 px-2 text-amber-300 font-bold">G3 (5ª J)</th>
                    <th className="py-2.5 px-2 text-amber-300 font-bold border-r border-neutral-700">G4 (7ª S)</th>
                    <th className="py-2.5 px-2 bg-emerald-950/40 text-emerald-300 font-bold">OR (Activate)</th>
                    <th className="py-2.5 px-2 text-cyan-300">AND (G1&amp;G2)</th>
                    <th className="py-2.5 px-2 text-pink-300">XOR (G1^G2)</th>
                    <th className="py-2.5 px-2 text-neutral-400">Voces</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_COMBINATIONS.map((row) => (
                    <tr
                      key={row.index}
                      onClick={() => setGates([row.g1, row.g2, row.g3, row.g4])}
                      className={`cursor-pointer transition-all border-b border-neutral-800/40 ${
                        row.isCurrent
                          ? 'bg-amber-500/20 text-white font-bold border-l-4 border-l-amber-400 ring-1 ring-amber-500/40'
                          : 'hover:bg-neutral-800/40 text-neutral-400'
                      }`}
                    >
                      <td className="py-1.5 px-2 text-[10px] text-neutral-600">{row.index}</td>
                      <td className={`py-1.5 px-2 border-l border-neutral-800 ${row.g1 ? 'text-amber-400 font-bold' : 'text-neutral-600'}`}>
                        {row.g1 ? '1' : '0'}
                      </td>
                      <td className={`py-1.5 px-2 ${row.g2 ? 'text-amber-400 font-bold' : 'text-neutral-600'}`}>
                        {row.g2 ? '1' : '0'}
                      </td>
                      <td className={`py-1.5 px-2 ${row.g3 ? 'text-amber-400 font-bold' : 'text-neutral-600'}`}>
                        {row.g3 ? '1' : '0'}
                      </td>
                      <td className={`py-1.5 px-2 border-r border-neutral-700 ${row.g4 ? 'text-amber-400 font-bold' : 'text-neutral-600'}`}>
                        {row.g4 ? '1' : '0'}
                      </td>

                      {/* MultiWAVE Activate Output (OR Combiner) */}
                      <td className={`py-1.5 px-2 ${
                        row.orCombined ? 'text-emerald-400 font-bold bg-emerald-950/20' : 'text-red-400/80 bg-red-950/20'
                      }`}>
                        {row.orCombined ? 'ON (+5V)' : 'OFF (0V)'}
                      </td>

                      {/* AND Sec 1 */}
                      <td className={`py-1.5 px-2 ${row.g1 && row.g2 ? 'text-cyan-400 font-bold' : 'text-neutral-600'}`}>
                        {row.g1 && row.g2 ? '1' : '0'}
                      </td>

                      {/* XOR Sec 1 */}
                      <td className={`py-1.5 px-2 ${row.xorSec1 ? 'text-pink-400 font-bold' : 'text-neutral-600'}`}>
                        {row.xorSec1 ? '1' : '0'}
                      </td>

                      {/* Cantidad de notas activas */}
                      <td className="py-1.5 px-2 text-[11px] text-neutral-400">
                        {row.activeCount} {row.activeCount === 1 ? 'nota' : 'notas'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800 flex flex-wrap justify-between items-center gap-2 text-xs text-neutral-400">
              <span>Haz clic en cualquier fila de la tabla para cargar esa combinacion instantaneamente.</span>
              <span className="font-mono text-[11px] text-neutral-500">1 = +5V (Gate Alto) | 0 = 0V (Gate Bajo)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
