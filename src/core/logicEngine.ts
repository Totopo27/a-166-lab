import type { SectionInputs, SectionOutputs } from './types';

/**
 * Pure logic gate functions mimicking CMOS logic in Doepfer A-166
 */
export const logicGates = {
  AND: (a: boolean, b: boolean): boolean => a && b,
  OR: (a: boolean, b: boolean): boolean => a || b,
  XOR: (a: boolean, b: boolean): boolean => a !== b,
  NAND: (a: boolean, b: boolean): boolean => !(a && b),
  NOR: (a: boolean, b: boolean): boolean => !(a || b),
  XNOR: (a: boolean, b: boolean): boolean => a === b,
  NOT: (a: boolean): boolean => !a,
};

export function evaluateSection(inputs: SectionInputs): SectionOutputs {
  const { in1, in2, invIn = false } = inputs;
  return {
    and: logicGates.AND(in1, in2),
    or: logicGates.OR(in1, in2),
    xor: logicGates.XOR(in1, in2),
    nand: logicGates.NAND(in1, in2),
    nor: logicGates.NOR(in1, in2),
    xnor: logicGates.XNOR(in1, in2),
    invOut: logicGates.NOT(invIn),
  };
}

export interface TruthTableRow {
  in1: boolean;
  in2: boolean;
  and: boolean;
  or: boolean;
  xor: boolean;
  nand: boolean;
  nor: boolean;
  xnor: boolean;
}

export const TRUTH_TABLE: TruthTableRow[] = [
  { in1: false, in2: false, and: false, or: false, xor: false, nand: true, nor: true, xnor: true },
  { in1: false, in2: true,  and: false, or: true,  xor: true,  nand: true, nor: false, xnor: false },
  { in1: true,  in2: false, and: false, or: true,  xor: true,  nand: true, nor: false, xnor: false },
  { in1: true,  in2: true,  and: true,  or: true,  xor: false, nand: false, nor: false, xnor: true },
];

/**
 * Generates an Euclidean rhythm pattern using Bjorklund algorithm
 */
export function generateEuclidean(hits: number, steps: number): boolean[] {
  if (steps <= 0) return [];
  if (hits <= 0) return new Array(steps).fill(false);
  if (hits >= steps) return new Array(steps).fill(true);

  const pattern: boolean[] = [];
  let bucket = 0;
  for (let i = 0; i < steps; i++) {
    bucket += hits;
    if (bucket >= steps) {
      bucket -= steps;
      pattern.push(true);
    } else {
      pattern.push(false);
    }
  }
  return pattern;
}
