import type {
  RgbColor,
  DrawableInterface,
  DrawerInterface,
  DrawableConfig,
  DrawableGroupConfig,
  ViewConfigInterface,
} from '../types';
import type { NumericVector } from '../../math/types';
import { getColorString } from '../utils';
import { createVector, toVector } from "../../math";
import { transposeCoordsBackward } from "../drawer";

export interface DrawablePointConfig extends DrawableConfig {
  position: NumericVector;
  radius: number;
  color: RgbColor;
}

export interface DrawableCircleConfig extends DrawableConfig {
  position: NumericVector;
  radius: number;
  color: RgbColor;
}

export interface DrawableRectangleConfig extends DrawableConfig {
  position: NumericVector;
  vector: NumericVector;
  color: RgbColor;
  fill?: boolean;
}

export interface DrawableSectorConfig extends DrawableConfig {
  position: NumericVector;
  direction: NumericVector;
  maxAngle: number;
  radius: number;
  color: RgbColor;
}

export interface DrawableTriangleConfig extends DrawableConfig {
  points: [NumericVector, NumericVector, NumericVector];
  color: RgbColor;
}

export interface DrawableLineConfig extends DrawableConfig {
  from: NumericVector;
  to: NumericVector;
  width: number;
  color: RgbColor;
  constWidth?: boolean;
}

export interface DrawableTextConfig extends DrawableConfig {
  position: NumericVector;
  text: string;
  color: RgbColor;
  family?: string;
  size: number;
}

export abstract class DrawablePrimitive implements DrawableInterface {
  abstract draw(drawer: DrawerInterface, viewConfig: ViewConfigInterface): void;
}

export class NonScalable extends DrawablePrimitive {
  private drawable: DrawableInterface;

  constructor(drawable: DrawableInterface) {
    super();
    this.drawable = drawable;
  }

  draw(drawer: DrawerInterface, viewConfig: ViewConfigInterface) {
    drawer.context.save();
    drawer.context.scale(1 / viewConfig.scale[0], 1 / viewConfig.scale[1]);
    this.drawable.draw(drawer, viewConfig);
    drawer.context.restore();
  }
}

export class BottomRightFixed extends DrawablePrimitive {
  private drawable: DrawableInterface;

  constructor(drawable: DrawableInterface) {
    super();
    this.drawable = drawable;
  }

  draw(drawer: DrawerInterface, viewConfig: ViewConfigInterface) {
    const [width, height] = drawer.frameSize;
    const offset = transposeCoordsBackward([width, height], viewConfig.offset, viewConfig.scale);

    drawer.context.save();
    drawer.context.translate(offset[0], offset[1]);
    drawer.context.scale(1 / viewConfig.scale[0], 1 / viewConfig.scale[1]);
    this.drawable.draw(drawer, viewConfig);
    drawer.context.restore();
  }
}

export class DrawableGroup extends DrawablePrimitive {
  public readonly config: DrawableGroupConfig;
  public readonly children: Array<DrawableInterface>;

  constructor(config: DrawableGroupConfig, children: Array<DrawableInterface>) {
    super();
    this.config = config;
    this.children = children;
  }

  public draw(drawer: DrawerInterface, viewConfig: ViewConfigInterface): void {
    if (isNaN(this.config.position[0])) {
      return;
    }

    drawer.context.save();
    drawer.context.translate(...this.config.position as [number, number]);

    if (this.config.opacity !== undefined) {
      drawer.context.globalAlpha = this.config.opacity;
    }

    this.children.forEach((child) => {
      child.draw(drawer, viewConfig);
    });

    drawer.context.restore();
  }
}

export class DrawablePoint extends DrawablePrimitive {
  public readonly config: DrawablePointConfig;

  constructor(config: DrawablePointConfig) {
    super();
    this.config = config;
  }

  public draw(drawer: DrawerInterface): void {
    drawer.context.beginPath();
    drawer.context.fillStyle = getColorString(this.config.color, this.config.opacity);
    drawer.context.ellipse(this.config.position[0], this.config.position[1], this.config.radius, this.config.radius, 0, 0, 2 * Math.PI);
    drawer.context.fill();
    drawer.context.closePath();
  }
}

export class DrawableCircle extends DrawablePrimitive {
  public readonly config: DrawableCircleConfig;

  constructor(config: DrawableCircleConfig) {
    super();
    this.config = config;
  }

  public draw(drawer: DrawerInterface): void {
    drawer.context.beginPath();
    drawer.context.strokeStyle = getColorString(this.config.color, this.config.opacity);
    drawer.context.ellipse(this.config.position[0], this.config.position[1], this.config.radius, this.config.radius, 0, 0, 2 * Math.PI);
    drawer.context.stroke();
    drawer.context.closePath();
  }
}

export class DrawableRectangle extends DrawablePrimitive {
  public readonly config: DrawableRectangleConfig;

  constructor(config: DrawableRectangleConfig) {
    super();
    this.config = config;
  }

  public draw(drawer: DrawerInterface): void {
    drawer.context.beginPath();
    drawer.context.rect(...this.config.position.slice(0, 2) as [number, number], ...this.config.vector.slice(0, 2) as [number, number]);

    if (this.config.fill) {
      drawer.context.fillStyle = getColorString(this.config.color, this.config.opacity);
      drawer.context.fill();
    } else {
      drawer.context.strokeStyle = getColorString(this.config.color, this.config.opacity);
      drawer.context.stroke();
    }
    drawer.context.closePath();
  }
}

export class DrawableSector extends DrawablePrimitive {
  public readonly config: DrawableSectorConfig;

  constructor(config: DrawableSectorConfig) {
    super();
    this.config = config;
  }

  public draw(drawer: DrawerInterface): void {
    drawer.context.beginPath();
    drawer.context.fillStyle = getColorString(this.config.color, this.config.opacity);
    const startAngle = Math.atan2(this.config.direction[1], this.config.direction[0]);
    drawer.context.arc(...this.config.position as [number, number], this.config.radius, startAngle-this.config.maxAngle, startAngle+this.config.maxAngle);
    drawer.context.lineTo(...this.config.position as [number, number]);
    drawer.context.fill();
    drawer.context.closePath();
  }
}

export class DrawableTriangle extends DrawablePrimitive {
  public readonly config: DrawableTriangleConfig;

  constructor(config: DrawableTriangleConfig) {
    super();
    this.config = config;
  }

  public draw(drawer: DrawerInterface): void {
    drawer.context.beginPath();
    drawer.context.moveTo(...this.config.points[0] as [number, number]);
    drawer.context.lineTo(...this.config.points[1] as [number, number]);
    drawer.context.lineTo(...this.config.points[2] as [number, number]);
    drawer.context.closePath();
    drawer.context.fillStyle = getColorString(this.config.color, this.config.opacity);
    drawer.context.fill();
  }
}

export class DrawableLine extends DrawablePrimitive {
  public readonly config: DrawableLineConfig;

  constructor(config: DrawableLineConfig) {
    super();
    this.config = config;
  }

  public draw(drawer: DrawerInterface): void {
    drawer.context.beginPath();
    drawer.context.strokeStyle = getColorString(this.config.color, this.config.opacity);
    // TODO remove it
    // drawer.context.lineWidth = this.config.width;
    drawer.context.lineWidth = this.config.constWidth ? this.config.width / drawer.viewConfig.scale[0] : this.config.width;
    drawer.context.moveTo(...this.config.from as [number, number]);
    drawer.context.lineTo(...this.config.to as [number, number]);
    drawer.context.stroke();
    drawer.context.closePath();
  }
}

export class DrawableArrow extends DrawableGroup {
  constructor(config: DrawableLineConfig) {
    const [x, y] = config.from;
    const [dx, dy] = toVector(config.to).clone().sub(config.from);

    // Вычисляем координаты конца стрелки
    const arrowLength = 15; // Длина хвоста стрелки
    const arrowWidth = -5; // Ширина хвоста стрелки

    // Вычисляем угол стрелки
    const angle = Math.atan2(dy, dx);

    // Концы стрелки (треугольника)
    const x1 = x + dx; // Конечная точка стрелки
    const y1 = y + dy;

    const x2 = x1 - arrowLength * Math.cos(angle - Math.PI / 6) - (arrowWidth / 2) * Math.sin(angle - Math.PI / 6);
    const y2 = y1 - arrowLength * Math.sin(angle - Math.PI / 6) + (arrowWidth / 2) * Math.cos(angle - Math.PI / 6);

    const x3 = x1 - arrowLength * Math.cos(angle + Math.PI / 6) + (arrowWidth / 2) * Math.sin(angle + Math.PI / 6);
    const y3 = y1 - arrowLength * Math.sin(angle + Math.PI / 6) - (arrowWidth / 2) * Math.cos(angle + Math.PI / 6);

    const line = new DrawableLine(config);
    const triangle = new DrawableTriangle({
      points: [[x1, y1], [x2, y2], [x3, y3]],
      color: config.color,
      opacity: config.opacity,
    });
    super({ position: [0, 0] }, [line, triangle]);
  }
}

export class DrawableText extends DrawablePrimitive {
  public readonly config: DrawableTextConfig;

  constructor(config: DrawableTextConfig) {
    super();
    this.config = config;
  }

  public draw(drawer: DrawerInterface): void {
    drawer.context.beginPath();
    drawer.context.font = `${this.config.size}px ${this.config.family ?? 'Arial'}`;
    drawer.context.fillStyle = getColorString(this.config.color, this.config.opacity);
    drawer.context.fillText(this.config.text, this.config.position[0], this.config.position[1]);
    drawer.context.closePath();
  }
}
