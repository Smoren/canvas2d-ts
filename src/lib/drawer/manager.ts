import type { DrawableInterface, DrawerManagerConfig, VisualizationManagerInterface } from "./types";
import type { VisualizableInterface } from "../models/types";
import { MouseCoords } from './utils';

export class VisualizationManager implements VisualizationManagerInterface {
  public readonly config: DrawerManagerConfig;
  private ticker: ReturnType<typeof setInterval> | null = null;
  private toVisualizeBuffer: Array<DrawableInterface> = [];
  private toVisualize: Array<DrawableInterface> = [];

  constructor(config: DrawerManagerConfig) {
    this.config = config;
  }

  public start(): void {
    if (this.ticker) {
      return;
    }

    this.ticker = setInterval(() => this.runStep(), this.config.period);
  }

  public stop(): void {
    clearInterval(this.ticker!);
  }

  public add(...objects: VisualizableInterface[]) {
    this.toVisualizeBuffer.push(...objects.map((x) => this.config.adapter.toDrawable(x)));
  }

  public flush(): void {
    this.addDefaultObjects();
    this.toVisualize = this.toVisualizeBuffer;
    this.toVisualizeBuffer = [];
  }

  private runStep(): void {
    this.config.drawer.draw(this.toVisualize);
  }

  private addDefaultObjects(): void {
    this.add(new MouseCoords(this.config.drawer.mouseCoords));
  }
}
