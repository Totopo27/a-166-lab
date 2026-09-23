/**
 * Core types for A-166 Dual Logic Module Simulation
 */

export type LogicGateType = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'XNOR';

export type SignalSourceType = 
  | 'clock'           // Divisor de reloj fijo (/1, /2, /3, /4, /8, etc.)
  | 'step-sequencer'  // Secuencia editable de 8 o 16 pasos
  | 'euclidean'       // Ritmo euclidiano (pulsos / pasos)
  | 'manual-gate'     // Pulsador manual (tecla apretada)
  | 'cv-threshold';   // Comparador tipo LFO/Maths

export interface SignalSourceConfig {
  type: SignalSourceType;
  // Clock divisor: 1, 2, 3, 4, 6, 8, etc.
  clockDivision?: number;
  // Sequencer steps (true = gate high, false = gate low)
  steps?: boolean[];
  // Euclidean rhythm params: hits out of total steps
  euclideanHits?: number;
  euclideanSteps?: number;
  // Manual gate state
  manualHigh?: boolean;
}

export interface SectionInputs {
  in1: boolean;
  in2: boolean;
  invIn?: boolean; // Inverter sub-circuit input (el A-166 incluye un inversor dedicado)
}

export interface SectionOutputs {
  and: boolean;
  or: boolean;
  xor: boolean;
  nand: boolean;
  nor: boolean;
  xnor: boolean;
  invOut?: boolean;
}

export interface PresetScenario {
  id: string;
  name: string;
  category: 'polyrhythm' | 'gated-clock' | 'combiner' | 'accent';
  description: string;
  theory: string;
  source1: SignalSourceConfig;
  source2: SignalSourceConfig;
  highlightGate: LogicGateType;
}
