import type { BoxGroupInterface, BoxInterface } from "@/lib/models/types";
import { createVector } from "@/lib/math";
import { BoxGroup } from "@/lib/models/models";

export class BoxManager {
  public readonly boxesLeft: Array<BoxInterface> = [];
  public readonly boxesRight: Array<BoxInterface> = [];

  constructor(boxes: Array<BoxInterface>) {
    for (const box of boxes) {
      if (box.config.source === "left") {
        this.boxesLeft.push(box);
        continue;
      }
      if (box.config.source === "right") {
        this.boxesRight.push(box);
        continue;
      }
      throw new Error("Unknown source");
    }
  }

  public get groups(): BoxGroupInterface[] {
    const groups: BoxGroupInterface[] = [];
    let id = 1;

    for (const lhs of this.boxesLeft) {
      let bestRhs: BoxInterface | undefined;
      let minDist = Infinity;

      for (const rhs of this.boxesRight) {
        const dist = createVector(lhs.config.position).sub(rhs.config.position).abs;

        if (dist < minDist) {
          minDist = dist;
          bestRhs = rhs;
        }
      }

      if (bestRhs !== undefined) {
        groups.push(new BoxGroup({
          id: id++,
          boxes: [lhs, bestRhs],
        }));
      }
    }

    return groups;
  }
}
