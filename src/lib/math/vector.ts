import type { ImmutableNumericVector, NumericVector, VectorInterface } from './types';
import { isEqual } from './helpers';
import { toVector } from './factories';

/**
 * Vector class
 * @public
 */
export class Vector extends Array implements VectorInterface {
  constructor(coords: NumericVector | ImmutableNumericVector) {
    super(coords.length);
    for (let i=0; i<coords.length; ++i) {
      this[i] = coords[i];
    }
  }

  get abs(): number {
    let result = 0;
    for (const coord of this) {
      result += coord**2;
    }
    return Math.sqrt(result);
  }

  get abs2(): number {
    let result = 0;
    for (const coord of this) {
      result += coord**2;
    }
    return result;
  }

  add(v: NumericVector): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] += v[i];
    }
    return this;
  }

  sub(v: NumericVector): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] -= v[i];
    }
    return this;
  }

  mul(multiplier: number): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] *= multiplier;
    }
    return this;
  }

  div(divider: number): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] /= divider;
    }
    return this;
  }

  inverse(): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] = -this[i];
    }
    return this;
  }

  zero(): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] = 0;
    }
    return this;
  }

  mulScalar(v: NumericVector): number {
    let result = 0;
    for (let i=0; i<this.length; ++i) {
      result += this[i] * v[i];
    }
    return result;
  }

  mulVector2d(v: NumericVector): number {
    return this[0] * v[1] - v[0] * this[1];
  }

  mulVector3d(v: NumericVector): VectorInterface {
    return new Vector([
      this[1] * v[2] - this[2] * v[1],
      this[2] * v[0] - this[0] * v[2],
      this[0] * v[1] - this[1] * v[0],
    ])
  }

  mulCoords(v: NumericVector): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] *= v[i];
    }
    return this;
  }

  divCoords(v: NumericVector): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] /= v[i];
    }
    return this;
  }

  rotate2d(angle: number): VectorInterface {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this[0] * cos - this[1] * sin;
    const y = this[0] * sin + this[1] * cos;
    this[0] = x;
    this[1] = y;
    return this;
  }

  angleWith(v: NumericVector): number {
    const another = toVector(v).clone();
    const dotProduct = this.mulScalar(another);
    const result = Math.acos(dotProduct / (this.abs * another.abs));
    return isNaN(result) ? 0 : result;
  }

  isEqual(v: NumericVector): boolean {
    for (let i=0; i<this.length; ++i) {
      if (!isEqual(this[i] as number, v[i])) {
        return false;
      }
    }
    return true;
  }

  isNormalized(): boolean {
    return isEqual(this.abs, 1);
  }

  hasNaN(): boolean {
    for (const coord of this) {
      if (isNaN(coord)) {
        return true;
      }
    }
    return false;
  }

  normalize(): VectorInterface {
    if (this.abs === 0) {
      return this;
    }
    this.div(this.abs);
    return this;
  }

  random(): VectorInterface {
    for (let i=0; i<this.length; ++i) {
      this[i] = 1-Math.random()*2;
    }
    return this;
  }

  set(values: NumericVector): VectorInterface {
    if (values.length !== this.length) {
      this.length = values.length;
    }
    for (let i=0; i<values.length; ++i) {
      this[i] = values[i];
    }
    return this;
  }

  clone(): VectorInterface {
    return new Vector(this);
  }
}
