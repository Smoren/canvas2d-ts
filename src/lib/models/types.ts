export interface VisualizableInterface {}

export type Source = 'left' | 'right' | 'total';

export type BoxConfig = {
  id: number;
  source: Source;
  position: [number, number];
  size: [number, number];
}

export type BoxGroupConfig = {
  id: number;
  boxes: BoxInterface[];
}

export interface BoxInterface extends VisualizableInterface {
  readonly config: BoxConfig;
}

export interface BoxGroupInterface extends VisualizableInterface {
  readonly config: BoxGroupConfig;
  readonly bounds: [number, number, number, number];
  readonly boundsArea: number;
}
