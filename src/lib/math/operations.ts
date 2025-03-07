import { createFilledMatrix, createFilledTensor, createVector, toVector } from "./factories";
import type { NumericVector, Tensor, VectorInterface } from "./types";
import { reduce } from "itertools-ts";

export function arrayUnaryOperation<T>(input: Array<T>, operator: (item: T) => T): Array<T> {
  const result: Array<T> = [];

  for (const item of input) {
    result.push(operator(item));
  }

  return result;
}

export function arrayBinaryOperation<T>(lhs: Array<T>, rhs: Array<T>, operator: (lhs: T, rhs: T) => T): Array<T> {
  const result: Array<T> = [];
  const len = Math.min(lhs.length, rhs.length);

  for (let i = 0; i < len; ++i) {
    result.push(operator(lhs[i], rhs[i]));
  }

  return result;
}

export function arraySum(input: number[]): number {
  return input.reduce((acc, val) => acc + val, 0);
}

export function vectorSum(vectors: NumericVector[]): VectorInterface {
  return reduce.toValue(vectors, (acc, x) => acc!.add(x), toVector([0, 0]))!;
}

export function averageScalar(scalars: number[]): number {
  if (scalars.length === 0) {
    return 0;
  }
  return arraySum(scalars) / scalars.length;
}

export function averageVector(vectors: NumericVector[]): VectorInterface {
  if (vectors.length === 0) {
    return toVector([0, 0]);
  }
  return vectorSum(vectors).div(vectors.length);
}

export function medianScalar(input: number[]): number {
  if (input.length === 0) {
    return 0;
  }
  const sorted = [...input].sort((a, b) => a - b);
  if (sorted.length % 2 === 0) {
    return averageScalar([sorted[sorted.length / 2 - 1], sorted[sorted.length / 2]]);
  }
  return sorted[Math.floor(sorted.length / 2)];
}

export function medianVectorByAngle(vectors: NumericVector[]): VectorInterface {
  if (vectors.length === 0) {
    return toVector([0, 0]);
  }
  const base = toVector([1, 0]);
  const sorted = [...vectors]
    .sort((lhs, rhs) => toVector(lhs).angleWith(base) - toVector(rhs).angleWith(base));

  if (sorted.length % 2 === 0) {
    return averageVector([sorted[sorted.length / 2 - 1], sorted[sorted.length / 2]]);
  }

  return toVector(sorted[Math.floor(sorted.length / 2)]);
}

export function tensorUnaryOperation<T>(operand: Tensor<T>, operation: (x: T) => T): Tensor<T> {
  const result: Tensor<T> = [];
  for (const item of operand) {
    if (item instanceof Array) {
      result.push(tensorUnaryOperation(item, operation));
    } else {
      result.push(operation(item));
    }
  }
  return result;
}

export function tensorBinaryOperation<T>(lhs: Tensor<T>, rhs: Tensor<T>, operation: (x: T, y: T) => T): Tensor<T> {
  const result: Tensor<T> = [];
  for (let i = 0; i < lhs.length; ++i) {
    const lhsItem = lhs[i];
    const rhsItem = rhs[i];
    if (lhsItem instanceof Array) {
      result.push(tensorBinaryOperation(lhsItem, rhsItem as Tensor<T>, operation));
    } else {
      result.push(operation(lhsItem, rhsItem as T));
    }
  }
  return result;
}

export function concatArrays<T>(lhs: T[], rhs: T[]): T[] {
  return [...lhs, ...rhs];
}

export function concatMatrices<T>(lhs: T[][], rhs: T[][], defaultValue: T): T[][] {
  const n = lhs.length + rhs.length;
  const m = (lhs[0]?.length ?? 0) + (rhs[0]?.length ?? 0);
  const result = createFilledMatrix(n, m, defaultValue);

  for (let i = 0; i < lhs.length; ++i) {
    const row = lhs[i];
    for (let j = 0; j < row.length; ++j) {
      result[i][j] = row[j];
    }
  }

  for (let i = 0; i < rhs.length; ++i) {
    const row = rhs[i];
    for (let j = 0; j < row.length; ++j) {
      result[lhs.length + i][(lhs[0]?.length ?? 0) + j] = row[j];
    }
  }

  return result;
}

export function concatTensors<T>(lhs: T[][][], rhs: T[][][], defaultValue: T): T[][][] {
  const n = lhs.length + rhs.length;
  const m = (lhs[0]?.length ?? 0) + (rhs[0]?.length ?? 0);
  const k = ((lhs[0] ?? [])[0]?.length ?? 0) + ((rhs[0] ?? [])[0]?.length ?? 0);
  const result = createFilledTensor(n, m, k, defaultValue);

  for (let i = 0; i < lhs.length; ++i) {
    for (let j = 0; j < lhs[i].length; ++j) {
      for (let k = 0; k < lhs[i][j].length; ++k) {
        result[i][j][k] = lhs[i][j][k];
      }
    }
  }

  for (let i = 0; i < rhs.length; ++i) {
    for (let j = 0; j < rhs[i].length; ++j) {
      for (let k = 0; k < rhs[i][j].length; ++k) {
        result[lhs.length + i][(lhs[0]?.length ?? 0) + j][((lhs[0] ?? [])[0]?.length ?? 0) + k] = rhs[i][j][k];
      }
    }
  }

  return result;
}

export function crossArrays<T>(lhs: T[], rhs: T[], separator: number): T[] {
  lhs = lhs.slice(0, separator);
  rhs = rhs.slice(separator);
  return concatArrays(lhs, rhs);
}

export function crossMatrices<T>(lhs: T[][], rhs: T[][], separator: number, defaultValue: T): T[][] {
  lhs = lhs.slice(0, separator).map((row) => row.slice(0, separator));
  rhs = rhs.slice(separator).map((row) => row.slice(separator));
  return concatMatrices(lhs, rhs, defaultValue);
}

export function crossTensors<T>(lhs: T[][][], rhs: T[][][], separator: number, defaultValue: T): T[][][] {
  lhs = lhs.slice(0, separator).map((row) => row.slice(0, separator).map((col) => col.slice(0, separator)));
  rhs = rhs.slice(separator).map((row) => row.slice(separator).map((col) => col.slice(separator)));
  return concatTensors(lhs, rhs, defaultValue);
}

export function randomCrossArrays<T>(lhs: T[], rhs: T[], separator: number): T[] {
  return lhs.map((_, i) => Math.random() < separator ? lhs[i] : rhs[i]);
}

export function randomCrossMatrices<T>(lhs: T[][], rhs: T[][], separator: number): T[][] {
  return lhs.map((row, i) => row.map((_, j) => Math.random() < separator ? lhs[i][j] : rhs[i][j]));
}

export function randomCrossTensors<T>(lhs: T[][][], rhs: T[][][], separator: number): T[][][] {
  return lhs.map((row, i) => row.map((col, j) => col.map((_, k) => Math.random() < separator ? lhs[i][j][k] : rhs[i][j][k])));
}

export function removeIndexFromArray<T>(input: T[], index: number): T[] {
  return input.filter((_, i) => i !== index);
}

export function removeIndexFromMatrix<T>(matrix: T[][], index: number): T[][] {
  return matrix.filter((_, i) => i !== index).map((row) => removeIndexFromArray(row, index));
}

export function removeIndexFromTensor<T>(tensor: T[][][], index: number): T[][][] {
  return tensor.filter((_, i) => i !== index).map((row) => removeIndexFromMatrix(row, index));
}

export function setMatrixMainDiagonal<T>(matrix: T[][], value: T): T[][] {
  for (let i = 0; i < matrix.length; ++i) {
    matrix[i][i] = value;
  }
  return matrix;
}

export function setTensorMainDiagonal<T>(tensor: T[][][], value: T): T[][][] {
  for (let i = 0; i < tensor.length; ++i) {
    tensor[i][i][i] = value;
  }
  return tensor;
}

export function makeMatrixSymmetric<T>(matrix: T[][]): T[][] {
  for (let i = 0; i < matrix.length; ++i) {
    for (let j = 0; j < i; ++j) {
      matrix[i][j] = matrix[j][i];
    }
  }
  return matrix;
}

export function makeTensorSymmetric<T>(tensor: T[][][]): T[][][] {
  for (let i = 0; i < tensor.length; ++i) {
    makeMatrixSymmetric(tensor[i]);
  }
  return tensor;
}

export function sortedNumbers(input: number[]): number[] {
  return [...input].sort((lhs, rhs) => lhs - rhs);
}

export function weighArray(input: number[], weight: number | number[]): number[] {
  if (Array.isArray(weight)) {
    return input.map((x, i) => x * weight[i]);
  }
  return input.map((x) => x * weight);
}

export function weighMatrix(
  input: number[][],
  weight: number | number[],
  rowModifier?: (row: number[]) => number[],
): number[][] {
  return input.map((item) => weighArray((rowModifier ?? ((row) => row))(item), weight));
}

export function averageMatrixColumns(input: number[][]): number[] {
  if (input.length === 0) {
    return [];
  }
  const result = [];
  for (let i = 0; i < input[0].length; ++i) {
    let sum = 0;
    for (let j = 0; j < input.length; ++j) {
      sum += input[j][i];
    }
    result[i] = sum / input.length;
  }
  return result;
}

export function getPointsCenter(points: NumericVector[]): NumericVector {
  const sum = createVector([0, 0]);

  for (const point of points) {
    sum.add(createVector(point));
  }

  return sum.div(points.length);
}

export function getBounds(points: NumericVector[]): [NumericVector, NumericVector] {
  const min = createVector([Infinity, Infinity]);
  const max = createVector([-Infinity, -Infinity]);

  for (const point of points) {
    min[0] = Math.min(min[0], point[0]);
    min[1] = Math.min(min[1], point[1]);
    max[0] = Math.max(max[0], point[0]);
    max[1] = Math.max(max[1], point[1]);
  }

  return [min, max];
}
