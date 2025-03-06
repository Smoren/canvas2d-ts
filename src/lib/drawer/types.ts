import type { NumericVector, VectorInterface } from "../math/types";
import type { VisualizableInterface } from '../models/types';

export type RgbColor = [number, number, number];

export type DrawerManagerConfig = {
  drawer: DrawerInterface;
  adapter: DrawableAdapterInterface;
  period: number;
}

export interface DrawableConfig {
  opacity?: number;
}

export interface DrawableGroupConfig extends DrawableConfig {
  position: NumericVector;
}

export interface ViewConfigInterface {
  offset: NumericVector;
  scale: NumericVector;
}

export type MouseEventData = {
  coords: NumericVector;
  extraKey: number | undefined;
  ctrlKey: boolean;
}

export type MouseEventListenerCallback = (event: MouseEventData) => void;

export interface MouseCoordsInterface extends NumericVector {}

export interface DrawableInterface extends VisualizableInterface {
  draw(drawer: DrawerInterface, viewConfig: ViewConfigInterface): void;
}

export interface DrawerInterface {
  readonly eventManager: EventManagerInterface;
  readonly context: CanvasRenderingContext2D;
  readonly viewConfig: ViewConfigInterface;
  readonly domElement: HTMLCanvasElement;
  readonly bounds: NumericVector[];
  readonly frameSize: NumericVector;
  readonly mouseCoords: VectorInterface;

  draw(collection: Array<DrawableInterface>): void;
  clear(): void;
  centerOn(coords: NumericVector): void;
}

export interface VisualizationManagerInterface {
  readonly config: DrawerManagerConfig;
  start(): void;
  stop(): void;
  add(...objects: VisualizableInterface[]): void;
  flush(): void;
}

export interface EventManagerInterface {
  onClick(callback: MouseEventListenerCallback): EventManagerInterface;
  onMouseDown(callback: MouseEventListenerCallback): EventManagerInterface;
  onMouseMove(callback: MouseEventListenerCallback): EventManagerInterface;
  onMouseGrab(callback: MouseEventListenerCallback): EventManagerInterface;
  onMouseUp(callback: MouseEventListenerCallback): EventManagerInterface;

  triggerClick(event: MouseEventData): void;
  triggerMouseDown(event: MouseEventData): void;
  triggerMouseMove(event: MouseEventData): void;
  triggerMouseGrab(event: MouseEventData): void;
  triggerMouseUp(event: MouseEventData): void;
}

export interface Drawer2dConfigInterface {
  readonly domElement: HTMLCanvasElement;
  readonly viewConfig: ViewConfigInterface;
}

export interface ColorStrategyInterface {
  getNextColor(): RgbColor;
}

export interface DrawableAdapterInterface {
  toDrawable(object: VisualizableInterface): DrawableInterface;
}
