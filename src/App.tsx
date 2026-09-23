import { useState, useEffect } from 'react';
import type { SignalSourceConfig, SectionInputs, SectionOutputs, LogicGateType, PresetScenario } from './core/types';
import { evaluateSection, generateEuclidean } from './core/logicEngine';
import { PRESET_SCENARIOS } from './core/presets';
import { soundEngine } from './audio/soundEngine';
import { TruthTable } from './components/TruthTable';
import { ModuleFaceplate } from './components/ModuleFaceplate';
import { OscilloscopeView } from './components/OscilloscopeView';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sliders, 
  BookOpen, 
  Activity, 
  Zap 
} from 'lucide-react';

export function App() {
  // Transport State
  const [bpm, setBpm] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [stepCounter, setStepCounter] = useState<number>(0);

  // Active Preset Scenario
  const [activeScenario, setActiveScenario] = useState<PresetScenario>(PRESET_SCENARIOS[0]);

  // Audio Monitoring Output (Which logic gate to hear as rhythm)
  const [audioMonitorGate, setAudioMonitorGate] = useState<LogicGateType | 'ALL' | 'INPUTS'>('AND');

  // Input 1 & Input 2 Signal Generator Config
  const [src1, setSrc1] = useState<SignalSourceConfig>(PRESET_SCENARIOS[0].source1);
  const [src2, setSrc2] = useState<SignalSourceConfig>(PRESET_SCENARIOS[0].source2);

  // Manual Gate State
  const [manualGateState, setManualGateState] = useState<boolean>(false);

  // Current Live Evaluated State
  const [currentInputs, setCurrentInputs] = useState<SectionInputs>({ in1: false, in2: false });
  const [currentOutputs, setCurrentOutputs] = useState<SectionOutputs>(evaluateSection({ in1: false, in2: false }));

  // Waveform History for Oscilloscope
  const [history, setHistory] = useState<{ in1: boolean; in2: boolean; and: boolean; or: boolean; xor: boolean }[]>([]);

  // Update scenario
  const handleSelectScenario = (scenario: PresetScenario) => {
    setActiveScenario(scenario);
    setSrc1({ ...scenario.source1 });
    setSrc2({ ...scenario.source2 });
    setAudioMonitorGate(scenario.highlightGate);
  };

  // Clock tick interval
  useEffect(() => {
    if (!isPlaying) return;

    // 16th notes tick rate: 60000 / (bpm * 4) ms
    const intervalTime = (60000 / (bpm * 4));

    const timer = setInterval(() => {
      setStepCounter((prev) => prev + 1);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, bpm]);

  // Evaluate logic outputs at each step
  useEffect(() => {
    // Determine IN 1 state
    let in1 = false;
    if (src1.type === 'clock') {
      const div = src1.clockDivision || 1;
      in1 = Math.floor(stepCounter / div) % 2 === 0;
    } else if (src1.type === 'step-sequencer' && src1.steps) {
      in1 = Boolean(src1.steps[stepCounter % src1.steps.length]);
    } else if (src1.type === 'euclidean') {
      const pattern = generateEuclidean(src1.euclideanHits || 3, src1.euclideanSteps || 8);
      in1 = Boolean(pattern[stepCounter % pattern.length]);
    }

    // Determine IN 2 state
    let in2 = false;
    if (src2.type === 'clock') {
      const div = src2.clockDivision || 1;
      in2 = Math.floor(stepCounter / div) % 2 === 0;
    } else if (src2.type === 'step-sequencer' && src2.steps) {
      in2 = Boolean(src2.steps[stepCounter % src2.steps.length]);
    } else if (src2.type === 'euclidean') {
      const pattern = generateEuclidean(src2.euclideanHits || 4, src2.euclideanSteps || 12);
      in2 = Boolean(pattern[stepCounter % pattern.length]);
    } else if (src2.type === 'manual-gate') {
      in2 = manualGateState;
    }

    const inputs: SectionInputs = { in1, in2 };
    const outputs = evaluateSection(inputs);

    setCurrentInputs(inputs);
    setCurrentOutputs(outputs);

    // Audio triggers on rising edges
    if (isPlaying && !isMuted) {
      if (audioMonitorGate === 'AND' && outputs.and) soundEngine.trigger('and');
      else if (audioMonitorGate === 'OR' && outputs.or) soundEngine.trigger('or');
      else if (audioMonitorGate === 'XOR' && outputs.xor) soundEngine.trigger('xor');
      else if (audioMonitorGate === 'INPUTS') {
        if (in1) soundEngine.trigger('in1');
        if (in2) soundEngine.trigger('in2');
      } else if (audioMonitorGate === 'ALL') {
        if (outputs.and) soundEngine.trigger('and');
        if (outputs.or) soundEngine.trigger('or');
        if (outputs.xor) soundEngine.trigger('xor');
      }
    }

    // Append to history
    setHistory((prev) => {
      const next = [...prev, {
        in1,
        in2,
        and: outputs.and,
        or: outputs.or,
        xor: outputs.xor,
      }];
      if (next.length > 200) next.shift();
      return next;
    });

  }, [stepCounter, isPlaying, src1, src2, manualGateState, audioMonitorGate, isMuted]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-neutral-800 bg-[#12141a]/90 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              A-166 LAB <span className="text-xs font-mono font-normal px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">Eurorack Logic Simulator</span>
            </h1>
            <p className="text-xs text-neutral-400">
              Aprende el módulo Doepfer A-166 Dual Logic con tablas de verdad, polirritmias y patch interactivo
            </p>
          </div>
        </div>

        {/* Master Transport Controls */}
        <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/20'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'PAUSAR' : 'REPRODUCIR'}
          </button>

          <button
            onClick={() => {
              setStepCounter(0);
              setHistory([]);
            }}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
            title="Reiniciar reloj"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-neutral-800 mx-1" />

          {/* BPM Slider */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-neutral-400">BPM:</span>
            <input
              type="range"
              min={40}
              max={240}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-24 accent-amber-500 h-1 bg-neutral-800 rounded"
            />
            <span className="text-amber-400 font-bold w-7 text-right">{bpm}</span>
          </div>

          <div className="h-4 w-px bg-neutral-800 mx-1" />

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded-lg border transition ${
              isMuted
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
            }`}
            title={isMuted ? 'Desmutear audio' : 'Mutear audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Escenarios Guiados & Fuentes de Señal */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Panel de Escenarios Educativos */}
          <div className="bg-[#14161d] border border-neutral-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Escenarios de Patch Guiados
            </h2>
            <div className="space-y-2">
              {PRESET_SCENARIOS.map((scenario) => {
                const isSelected = activeScenario.id === scenario.id;
                return (
                  <button
                    key={scenario.id}
                    onClick={() => handleSelectScenario(scenario)}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm'
                        : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                    }`}
                  >
                    <div className="font-bold text-sm text-neutral-200 mb-1">{scenario.name}</div>
                    <div className="text-[11px] text-neutral-400 line-clamp-2">{scenario.description}</div>
                  </button>
                );
              })}
            </div>

            {/* Explicación de teoría modular */}
            <div className="mt-4 p-3 bg-neutral-900/90 border border-neutral-800 rounded-lg text-xs">
              <span className="font-mono text-[10px] text-amber-400 font-bold uppercase block mb-1">
                Lógica aplicada a este patch:
              </span>
              <p className="text-neutral-300 leading-relaxed">
                {activeScenario.theory}
              </p>
            </div>
          </div>

          {/* Configurador Rápido de Entradas (IN 1 e IN 2) */}
          <div className="bg-[#14161d] border border-neutral-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-purple-400" />
              Configurar Fuentes de Señal
            </h2>

            {/* Fuente IN 1 */}
            <div className="mb-4 pb-3 border-b border-neutral-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-bold text-amber-400">IN 1 (Canal A)</span>
                <span className="text-[10px] text-neutral-500 uppercase">{src1.type}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 mb-2">
                <button
                  onClick={() => setSrc1({ type: 'clock', clockDivision: 2 })}
                  className={`py-1 px-2 rounded text-[10px] font-mono border ${
                    src1.type === 'clock' && src1.clockDivision === 2 ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  Clock /2
                </button>
                <button
                  onClick={() => setSrc1({ type: 'clock', clockDivision: 4 })}
                  className={`py-1 px-2 rounded text-[10px] font-mono border ${
                    src1.type === 'clock' && src1.clockDivision === 4 ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  Clock /4
                </button>
                <button
                  onClick={() => setSrc1({ type: 'euclidean', euclideanHits: 3, euclideanSteps: 8 })}
                  className={`py-1 px-2 rounded text-[10px] font-mono border ${
                    src1.type === 'euclidean' ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  Euclid 3/8
                </button>
              </div>
            </div>

            {/* Fuente IN 2 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-bold text-purple-400">IN 2 (Canal B)</span>
                <span className="text-[10px] text-neutral-500 uppercase">{src2.type}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 mb-2">
                <button
                  onClick={() => setSrc2({ type: 'clock', clockDivision: 3 })}
                  className={`py-1 px-2 rounded text-[10px] font-mono border ${
                    src2.type === 'clock' && src2.clockDivision === 3 ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-bold' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  Clock /3
                </button>
                <button
                  onClick={() => setSrc2({ type: 'euclidean', euclideanHits: 5, euclideanSteps: 12 })}
                  className={`py-1 px-2 rounded text-[10px] font-mono border ${
                    src2.type === 'euclidean' ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-bold' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  Euclid 5/12
                </button>
                <button
                  onClick={() => setSrc2({ type: 'manual-gate' })}
                  className={`py-1 px-2 rounded text-[10px] font-mono border ${
                    src2.type === 'manual-gate' ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-bold' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  Manual Gate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Column: Módulo Físico Doepfer + Tabla de Verdad + Osciloscopio */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Fila con Frontplate físico del módulo + Selector de Monitoreo de Audio */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Frontal estilo Eurorack Doepfer */}
            <div className="md:col-span-5 flex justify-center">
              <ModuleFaceplate
                inputs={currentInputs}
                outputs={currentOutputs}
                sectionNumber={1}
                onManualGate={(active) => setManualGateState(active)}
                isManualGateActive={manualGateState}
              />
            </div>

            {/* Selector de Monitoreo Auditivo & Explicación de Salidas */}
            <div className="md:col-span-7 flex flex-col gap-3">
              <div className="bg-[#14161d] border border-neutral-800 rounded-xl p-4 shadow-lg">
                <h3 className="text-xs font-mono font-bold uppercase text-neutral-400 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  ¿Qué salida lógica quieres escuchar?
                </h3>
                <p className="text-[11px] text-neutral-400 mb-3">
                  Selecciona qué puerta lógica enviar a los sintetizadores de batería (Kick en AND, Snare en OR, Hi-Hat en XOR).
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {(['AND', 'OR', 'XOR'] as LogicGateType[]).map((gate) => (
                    <button
                      key={gate}
                      onClick={() => setAudioMonitorGate(gate)}
                      className={`py-2 px-3 rounded-lg border font-mono text-xs flex flex-col items-center gap-1 transition ${
                        audioMonitorGate === gate
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold">{gate}</span>
                      <span className="text-[9px] text-neutral-500">
                        {gate === 'AND' ? '🥁 Kick' : gate === 'OR' ? '🥁 Rim/Snare' : '🥁 Hi-Hat'}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => setAudioMonitorGate('INPUTS')}
                    className={`py-1.5 px-2 rounded border text-xs font-mono ${
                      audioMonitorGate === 'INPUTS' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    🔊 Monitorear Entradas (IN1 &amp; IN2)
                  </button>
                  <button
                    onClick={() => setAudioMonitorGate('ALL')}
                    className={`py-1.5 px-2 rounded border text-xs font-mono ${
                      audioMonitorGate === 'ALL' ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    🎶 Poly-Beat (Todas a la vez)
                  </button>
                </div>
              </div>

              {/* Tabla de Verdad Dinámica */}
              <TruthTable
                in1={currentInputs.in1}
                in2={currentInputs.in2}
                outputs={currentOutputs}
                highlightGate={activeScenario.highlightGate}
              />
            </div>
          </div>

          {/* Osciloscopio / Visualizador de Gates */}
          <OscilloscopeView history={history} currentStepIndex={stepCounter} />
        </div>
      </main>
    </div>
  );
}
export default App;
