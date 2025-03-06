import { VisualizationManager } from "../drawer/manager";
import { Drawer2d } from "@/lib/drawer/drawer";
import { DefaultDrawableAdapter } from "@/lib/drawer/adapter";
import { Box, BoxGroup } from "@/lib/models/models";
import { BoxManager } from "@/lib/app/components";
import type { BoxConfig } from "@/lib/models/types";
import { reduce } from "itertools-ts";

export function startApp(domElement: HTMLCanvasElement) {
  const drawer = new Drawer2d({
    domElement,
    viewConfig: {
      offset: [0, 0],
      scale: [1, 1],
    },
  });
  const adapter = new DefaultDrawableAdapter();
  const manager = new VisualizationManager({
    drawer,
    adapter,
    period: 1000 / 60,
  });

  const leftBoxes = createLeftBoxesConfigs().map((c) => new Box(c));
  const rightBox = new Box({
    id: 0,
    source: 'right',
    position: [320, 510],
    size: [200, 150],
  });
  drawer.eventManager.onMouseMove((event) => {
    rightBox.config.position = event.coords as [number, number];
  });

  const boxManager = new BoxManager([...leftBoxes, rightBox]);

  setInterval(() => {
    const minGroup = reduce.toMin(boxManager.groups, (x) => x.boundsArea)!;
    const toVisualize = [...boxManager.boxesLeft, ...boxManager.boxesRight, minGroup];
    manager.add(...toVisualize);
    manager.flush();
  }, 30);

  manager.start();
}

function createLeftBoxesConfigs(): BoxConfig[] {
  return [
    {
      id: 1,
      source: 'left',
      position: [100, 500],
      size: [200, 150],
    },
    {
      id: 2,
      source: 'left',
      position: [200, 300],
      size: [200, 150],
    },
    {
      id: 3,
      source: 'left',
      position: [500, 700],
      size: [200, 150],
    },
    {
      id: 4,
      source: 'left',
      position: [800, 100],
      size: [200, 150],
    },
  ];
}
