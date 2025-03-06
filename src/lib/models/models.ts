import type { BoxInterface, BoxConfig, BoxGroupInterface, BoxGroupConfig } from "./types";
import { Stream } from "itertools-ts";

export class Box implements BoxInterface {
  readonly config: BoxConfig;

  constructor(config: BoxConfig) {
    this.config = config;
  }
}

export class BoxGroup implements BoxGroupInterface {
  readonly config: BoxGroupConfig;

  constructor(config: BoxGroupConfig) {
    this.config = config;
  }

  public get bounds(): [number, number, number, number] {
    return Stream.of(this.config.boxes)
      .map((box) => box.config)
      .toValue((acc, x) => [
        Math.min(acc[0], x.position[0]),
        Math.min(acc[1], x.position[1]),
        Math.max(acc[2], x.position[0] + x.size[0]),
        Math.max(acc[3], x.position[1] + x.size[1]),
      ], [Infinity, Infinity, -Infinity, -Infinity]);
  }

  public get boundsArea(): number {
    const [minX, minY, maxX, maxY] = this.bounds;
    return (maxX - minX) * (maxY - minY);
  }
}
