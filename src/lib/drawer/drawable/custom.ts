import {
  DrawableGroup,
  DrawableRectangle,
  DrawableText,
  BottomRightFixed,
} from "./primitives";
import type { BoxGroupInterface, BoxInterface, Source } from "../../models/types";
import type { DrawableAdapterInterface, MouseCoordsInterface, RgbColor } from "@/lib/drawer/types";
import { Stream } from "itertools-ts";
import { Box } from "@/lib/models/models";

export class DrawableBox extends DrawableRectangle {
  private static readonly colorMap: Record<Source, RgbColor> = {
    left: [255, 0, 0],
    right: [0, 255, 0],
    total: [255, 255, 255],
  };

  constructor(box: BoxInterface) {
    super({
      position: box.config.position,
      vector: box.config.size,
      color: DrawableBox.colorMap[box.config.source],
    });
  }
}

export class DrawableBoxGroup extends DrawableGroup {
  constructor(boxGroup: BoxGroupInterface, adapter: DrawableAdapterInterface) {
    const drawableBoxes = boxGroup.config.boxes.map((box) => new DrawableBox(box));

    const [minX, minY, maxX, maxY] = boxGroup.bounds;
    const drawableText = new DrawableText({
      position: [minX!, minY!],
      text: boxGroup.config.id.toString(),
      color: [255, 255, 255],
      size: 20,
    });
    const delta = 2;
    const totalBox = new Box({
      id: 0,
      source: "total",
      position: [minX! - delta, minY! - delta],
      size: [maxX! - minX! + delta, maxY! - minY! + delta],
    })
    const children = [adapter.toDrawable(totalBox), drawableText];
    super({position: [0, 0]}, children);
  }
}

export class DrawableMouseCoords extends DrawableGroup {
  constructor(mouseCoords: MouseCoordsInterface) {
    const infoContainer = new DrawableRectangle({
      position: [0, 0],
      vector: [250, 30],
      color: [255, 255, 255],
      fill: true,
      opacity: 0.7,
    });
    const text = new DrawableText({
      text: `Указатель: [ ${mouseCoords.join(', ')} ]`,
      position: [10, 20],
      color: [0, 0, 0],
      size: 16,
    });

    const group = new DrawableGroup({ position: [-265, -50] }, [infoContainer, text]);
    const fixedGroup = new BottomRightFixed(group);

    super({ position: [0, 0] }, [fixedGroup]);
  }
}
