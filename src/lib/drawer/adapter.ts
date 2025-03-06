import type { DrawableAdapterInterface, DrawableInterface, MouseCoordsInterface } from './types';
import type { VisualizableInterface, BoxInterface, BoxGroupInterface } from "../models/types";
import { DrawableBox, DrawableBoxGroup, DrawableMouseCoords } from "./drawable/custom";
import { MouseCoords } from "./utils";
import { Box, BoxGroup } from "../models/models";
import { DrawablePrimitive } from "./drawable/primitives";

export class DefaultDrawableAdapter implements DrawableAdapterInterface {
  public toDrawable(object: VisualizableInterface): DrawableInterface {
    if (object instanceof DrawablePrimitive) {
      return object;
    }

    if (object instanceof Box) {
      return this.adaptBox(object);
    }

    if (object instanceof BoxGroup) {
      return this.adaptBoxGroup(object);
    }

    if (object instanceof MouseCoords) {
      return this.adaptMouseCoords(object);
    }

    console.error('Cannot get drawable for object', object);
    throw new Error('Cannot get drawable for object');
  }

  private adaptBox(object: BoxInterface): DrawableInterface {
    return new DrawableBox(object);
  }

  private adaptBoxGroup(object: BoxGroupInterface): DrawableInterface {
    return new DrawableBoxGroup(object, this);
  }

  private adaptMouseCoords(object: MouseCoordsInterface): DrawableInterface {
    return new DrawableMouseCoords(object);
  }
}
