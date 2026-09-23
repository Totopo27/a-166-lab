import type { PresetScenario } from './types';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'gated-clock',
    name: '1. Gated Clock (Reloj Condicionado)',
    category: 'gated-clock',
    description: 'Permite que el reloj pase hacia un secuenciador solo mientras una puerta manual o señal esté en Alto (+5V).',
    theory: 'En la puerta AND: 1 AND 0 = 0 (silencio), 1 AND 1 = 1 (el pulso pasa). La entrada B actúa como "Válvula de paso" o interruptor lógico.',
    source1: {
      type: 'clock',
      clockDivision: 1, // Pulso constante
    },
    source2: {
      type: 'step-sequencer',
      steps: [true, true, true, true, false, false, false, false, true, true, false, false, true, true, true, true],
    },
    highlightGate: 'AND',
  },
  {
    id: 'gate-combiner',
    name: '2. Gate Combiner (Mezclador de Disparo)',
    category: 'combiner',
    description: 'Dispara una misma percusión o envelope desde dos secuencias rítmicas independientes sin cortocircuitar salidas.',
    theory: 'En Eurorack nunca unas dos salidas con un cable múltiple (puedes dañarlas). Con OR: Si A dispara O B dispara (o ambos), la salida dispara.',
    source1: {
      type: 'euclidean',
      euclideanHits: 3,
      euclideanSteps: 8, // Clave rítmica 1
    },
    source2: {
      type: 'clock',
      clockDivision: 4, // Pulso regular 4 a tierra
    },
    highlightGate: 'OR',
  },
  {
    id: 'accents',
    name: '3. Acentos y Coincidencias',
    category: 'accent',
    description: 'Genera un disparo especial (ej: platillo crash o redoble) ÚNICAMENTE cuando dos polirritmias caen en el mismo instante.',
    theory: 'AND requiere que AMBAS señales estén en HIGH al mismo tiempo. Es ideal para detectar "downbeats" cruzados entre secuencias de distinta longitud.',
    source1: {
      type: 'euclidean',
      euclideanHits: 3,
      euclideanSteps: 8,
    },
    source2: {
      type: 'euclidean',
      euclideanHits: 4,
      euclideanSteps: 12,
    },
    highlightGate: 'AND',
  },
  {
    id: 'polyrhythm-xor',
    name: '4. Polirritmia Alternada (XOR)',
    category: 'polyrhythm',
    description: 'XOR genera un patrón sincopado increíble: activa cuando suena una U otra, pero SILENCIA si ambas suenan a la vez.',
    theory: 'XOR (OR Exclusivo): 1 XOR 1 = 0. Crea silencios en las coincidencias obvias y ritmos cruzados muy orgánicos para hi-hats.',
    source1: {
      type: 'clock',
      clockDivision: 2,
    },
    source2: {
      type: 'euclidean',
      euclideanHits: 5,
      euclideanSteps: 16,
    },
    highlightGate: 'XOR',
  },
];
