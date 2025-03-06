import type {
  RgbColor,
  EventManagerInterface,
  MouseEventData,
  MouseEventListenerCallback,
  ColorStrategyInterface, MouseCoordsInterface,
} from "./types";
import type { NumericVector } from "../math/types";
import { createVector, isEqual, Vector } from '../math';

type ListenersStorage = {
  onClick: MouseEventListenerCallback[];
  onMouseDown: MouseEventListenerCallback[];
  onMouseMove: MouseEventListenerCallback[];
  onMouseGrab: MouseEventListenerCallback[];
  onMouseUp: MouseEventListenerCallback[];
};

export function getColorString(color: RgbColor, opacity: number = 1): string {
  return `rgb(${[...color, opacity].join(', ')})`;
}

export class PreventException extends Error {
}

export class EventManager implements EventManagerInterface {
  private listeners: ListenersStorage = {
    onClick: [],
    onMouseDown: [],
    onMouseMove: [],
    onMouseGrab: [],
    onMouseUp: [],
  };
  private lastPoint: NumericVector | undefined;
  private mouseGrabTick: ReturnType<typeof setInterval> | undefined;

  onClick(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onClick', callback);
  }

  onMouseDown(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onMouseDown', callback);
  }

  onMouseMove(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onMouseMove', callback);
  }

  onMouseGrab(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onMouseGrab', callback);
  }

  onMouseUp(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onMouseUp', callback);
  }

  triggerClick(event: MouseEventData): void {
    this.trigger('onClick', event);
  }

  triggerMouseDown(event: MouseEventData): void {
    this.startMouseGrabTick();
    this.trigger('onMouseDown', event);
  }

  triggerMouseMove(event: MouseEventData): void {
    this.trigger('onMouseMove', event);
  }

  triggerMouseGrab(event: MouseEventData): void {
    this.trigger('onMouseGrab', event);
  }

  triggerMouseUp(event: MouseEventData): void {
    this.stopMouseGrabTick();
    this.trigger('onMouseUp', event);
  }

  private add(type: keyof ListenersStorage, callback: MouseEventListenerCallback): EventManagerInterface {
    this.listeners[type].push(callback);
    return this;
  }

  private trigger(type: keyof ListenersStorage, event: MouseEventData, throwException: boolean = true): void {
    this.lastPoint = event.coords;
    try {
      for (const callback of this.listeners[type]) {
        callback(event);
      }
    } catch (e) {
      if (throwException) {
        throw e;
      }
    }
  }

  private startMouseGrabTick() {
    this.mouseGrabTick = setInterval(() => {
      this.trigger('onMouseGrab', {
        coords: this.lastPoint as NumericVector,
        extraKey: undefined,
        ctrlKey: false,
      }, false);
    }, 30);
  }

  private stopMouseGrabTick() {
    if (this.mouseGrabTick) {
      clearInterval(this.mouseGrabTick);
    }
  }
}

export class MouseCoords extends Vector implements MouseCoordsInterface {}

export class DefaultColorStrategy implements ColorStrategyInterface {
  private colors: RgbColor[] = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 255, 255],
    [255, 255, 0],
  ];
  private colorIndex = 0;

  getNextColor(): RgbColor {
    return this.colors[this.colorIndex++ % this.colors.length];
  }
}

export function formatUnixTimestamp(timestamp: number): string {
  // Создаем объект даты из Unix timestamp (в миллисекундах)
  const date = new Date(timestamp * 1000);

  // Получаем компоненты даты
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
  const year = date.getFullYear();

  // Получаем компоненты времени
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds());

  // Форматируем конечную строку
  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export function getScaleMultiplierToCrop(
  initialBounds: [NumericVector, NumericVector],
  targetBounds: [NumericVector, NumericVector],
  defaultBoundDiameter: number = 500,
): number {
  const contourBoundRelations = createVector(targetBounds[1]).sub(createVector(targetBounds[0]));
  const drawerBoundRelations = createVector(initialBounds[1]).sub(createVector(initialBounds[0]));

  if (isEqual(contourBoundRelations[0], 0) && isEqual(contourBoundRelations[1], 0)) {
    contourBoundRelations.set([defaultBoundDiameter, defaultBoundDiameter]);
  } else if (isEqual(contourBoundRelations[0], 0)) {
    contourBoundRelations[0] = contourBoundRelations[1];
  } else if (isEqual(contourBoundRelations[1], 0)) {
    contourBoundRelations[1] = contourBoundRelations[0];
  }

  return Math.min(...drawerBoundRelations.clone().divCoords(contourBoundRelations));
}
