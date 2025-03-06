import type { NumericVector, VectorInterface } from "../math/types";
import type {
  Drawer2dConfigInterface,
  DrawerInterface,
  EventManagerInterface,
  ViewConfigInterface,
  DrawableInterface,
} from "./types";
import { createVector } from '../math';
import { EventManager } from '../drawer/utils';

/**
 * Transpose coords with backward applying offset and scale
 * @param coords - coords to transpose
 * @param offset - offset vector
 * @param scale - scale vector
 */
export function transposeCoordsBackward(
  coords: NumericVector, offset: NumericVector, scale: NumericVector = [1, 1],
): NumericVector {
  const [x, y] = coords;
  return [(x - offset[0]) / scale[0], (y - offset[1]) / scale[1]];
}

/**
 * Transpose coords with forward applying offset and scale
 * @param coords - coords to transpose
 * @param offset - offset vector
 * @param scale - scale vector
 */
export function transposeCoordsForward(
  coords: NumericVector, offset: NumericVector, scale: NumericVector = [1, 1],
): NumericVector {
  const [x, y] = coords;
  return [x * scale[0] + offset[0], y * scale[1] + offset[1]];
}

export class Drawer2d implements DrawerInterface {
  public readonly eventManager: EventManagerInterface;
  public readonly context: CanvasRenderingContext2D;
  public readonly domElement: HTMLCanvasElement;
  public readonly viewConfig: ViewConfigInterface;
  public readonly mouseCoords: VectorInterface;

  constructor({
    domElement,
    viewConfig,
  }: Drawer2dConfigInterface) {
    this.domElement = domElement;
    this.viewConfig = viewConfig;
    this.context = domElement.getContext('2d') as CanvasRenderingContext2D;
    this.eventManager = new EventManager();
    this.mouseCoords = createVector([0, 0]);
    this.refresh();
    this.initEventHandlers();
  }

  public draw(collection: Array<DrawableInterface>): void {
    this.clear();
    this.context.save();
    this.context.translate(this.viewConfig.offset[0], this.viewConfig.offset[1]);
    this.context.scale(this.viewConfig.scale[0], this.viewConfig.scale[1]);

    for (let i=0; i<collection.length; ++i) {
      collection[i].draw(this, this.viewConfig);
    }

    this.context.restore();
  }

  public centerOn(coords: NumericVector): void {
    const center = transposeCoordsBackward(createVector([this.width / 2, this.height / 2]), [0, 0], this.viewConfig.scale);
    this.viewConfig.offset = transposeCoordsForward(createVector(center).sub(coords), [0, 0], this.viewConfig.scale);
  }

  get bounds(): NumericVector[] {
    const topLeft = transposeCoordsBackward([0, 0], this.viewConfig.offset, this.viewConfig.scale);
    const bottomRight = transposeCoordsBackward([this.width, this.height], this.viewConfig.offset, this.viewConfig.scale);
    return [topLeft, bottomRight];
  }

  get frameSize(): NumericVector {
    return [this.width, this.height];
  }

  public clear(): void {
    this.context.fillStyle = 'rgb(0, 0, 0, 1)';
    this.context.rect(0, 0, this.width, this.height);
    this.context.fill();
  }

  get width(): number {
    return this.domElement.clientWidth;
  }

  get height(): number {
    return this.domElement.clientHeight;
  }

  private refresh(): void {
    if (this.domElement.width !== this.width) {
      this.domElement.width = this.width;
    }

    if (this.domElement.height !== this.height) {
      this.domElement.height = this.height;
    }

    this.clear();
  }

  private initEventHandlers(): void {
    const resizeObserver = new ResizeObserver(() => {
      this.refresh();
    });
    resizeObserver.observe(this.domElement);

    let keyDown: number | undefined = undefined;
    let mouseDownVector: NumericVector | undefined = undefined;

    document.body.addEventListener('keydown', (event: KeyboardEvent) => {
      const key = parseInt(event.key);
      if (key > 0 && key < 10) {
        keyDown = key;
      }
    });

    document.body.addEventListener('keyup', () => {
      keyDown = undefined;
    });

    this.domElement.addEventListener('click', (event: MouseEvent) => {
      const coords = createVector(
        transposeCoordsBackward([event.offsetX, event.offsetY], this.viewConfig.offset, this.viewConfig.scale),
      );
      this.eventManager.triggerClick({ coords, extraKey: keyDown, ctrlKey: event.ctrlKey });
      console.log(keyDown, coords);
    });

    this.domElement.addEventListener('wheel', (event: WheelEvent) => {
      if (event.ctrlKey) {
        let scale = this.viewConfig.scale[0];
        scale += event.deltaY * -0.002;
        scale = Math.min(Math.max(0.05, scale), 100);

        const oldScalePosition = createVector(
          transposeCoordsBackward([event.offsetX, event.offsetY], this.viewConfig.offset, this.viewConfig.scale),
        );
        this.viewConfig.scale = [scale, scale];
        const newScalePosition = createVector(
          transposeCoordsBackward([event.offsetX, event.offsetY], this.viewConfig.offset, this.viewConfig.scale),
        );
        const difference = newScalePosition.clone().sub(oldScalePosition);
        this.viewConfig.offset = transposeCoordsForward(
          difference,
          this.viewConfig.offset,
          this.viewConfig.scale,
        );
      } else if (event.shiftKey) {
        this.viewConfig.offset[0] -= event.deltaY;
      } else {
        this.viewConfig.offset[1] -= event.deltaY;
      }

      event.preventDefault();
    });

    const mouseDownHandler = (event: MouseEvent | TouchEvent) => {
      const coords = (event instanceof MouseEvent)
        ? createVector([event.offsetX, event.offsetY])
        : createVector([event.touches[0].clientX, event.touches[0].clientY]);
      document.body.style.cursor = 'grabbing';

      try {
        this.eventManager.triggerMouseDown({
          coords: transposeCoordsBackward(coords, this.viewConfig.offset, this.viewConfig.scale),
          extraKey: keyDown,
          ctrlKey: event.ctrlKey,
        });
      } catch (e) {
        return;
      }

      mouseDownVector = coords;
    };
    const mouseUpHandler = (event: MouseEvent | TouchEvent) => {
      const coords = (event instanceof MouseEvent)
        ? createVector([event.offsetX, event.offsetY])
        : createVector([event.touches[0].clientX, event.touches[0].clientY]);
      mouseDownVector = undefined;
      document.body.style.cursor = 'auto';

      this.eventManager.triggerMouseUp({
        coords: transposeCoordsBackward(coords, this.viewConfig.offset, this.viewConfig.scale),
        extraKey: keyDown,
        ctrlKey: event.ctrlKey,
      });
    };
    const mouseMoveHandler = (event: MouseEvent | TouchEvent) => {
      const coords = (event instanceof MouseEvent)
        ? createVector([event.offsetX, event.offsetY])
        : createVector([event.touches[0].clientX, event.touches[0].clientY]);

      this.mouseCoords.set(transposeCoordsBackward(coords, this.viewConfig.offset, this.viewConfig.scale));

      this.eventManager.triggerMouseMove({
        coords: transposeCoordsBackward(coords, this.viewConfig.offset, this.viewConfig.scale),
        extraKey: keyDown,
        ctrlKey: event.ctrlKey,
      });

      if (mouseDownVector === undefined) {
        return;
      }

      this.eventManager.triggerMouseGrab({
        coords: transposeCoordsBackward(coords, this.viewConfig.offset, this.viewConfig.scale),
        extraKey: keyDown,
        ctrlKey: event.ctrlKey,
      });

      const diff = coords.clone().sub(mouseDownVector);

      this.viewConfig.offset[0] += diff[0];
      this.viewConfig.offset[1] += diff[1];
      mouseDownVector = coords;
    };

    this.domElement.addEventListener('mousedown', mouseDownHandler);
    document.body.addEventListener('mouseup', mouseUpHandler);
    document.body.addEventListener('mouseleave', mouseUpHandler);
    this.domElement.addEventListener('mousemove', mouseMoveHandler);

    this.domElement.addEventListener('touchstart', mouseDownHandler);
    document.body.addEventListener('touchend', mouseUpHandler);
    this.domElement.addEventListener('touchmove', mouseMoveHandler);
  }
}

export function createDrawer(canvasId: string) {
  return new Drawer2d({
    domElement: document.getElementById(canvasId) as HTMLCanvasElement,
    viewConfig: {
      offset: [0, 0],
      scale: [1, 1],
    },
  });
}
