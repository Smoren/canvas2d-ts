import type { NumericVector, VectorInterface } from "../math/types";
import type {
  DrawableInterface,
  DrawerInterface,
  EventManagerInterface,
  ViewConfigInterface,
} from "./types";
import { DrawableLine, DrawablePoint } from './drawable/primitives';
import {
  Scene,
  Engine,
  UniversalCamera,
  ArcRotateCamera,
  Vector3,
  Light,
  PointLight,
  Mesh,
  StandardMaterial,
  MeshBuilder,
} from 'babylonjs';

export class Drawer3d implements DrawerInterface {
  public readonly domElement: HTMLCanvasElement;
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly camera: ArcRotateCamera | UniversalCamera;
  private readonly lights: Light[];
  private readonly pointsMap: Map<DrawablePoint, Mesh> = new Map();
  private readonly linesMap: Map<DrawableLine, Mesh> = new Map();
  private readonly bufVectors: Vector3[] = [
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
  ];

  constructor(domElement: HTMLCanvasElement) {
    this.domElement = domElement;
    this.engine = new Engine(this.domElement, false, {}, true);
    this.scene = new Scene(this.engine);
    this.camera = this.createCamera([-11.25, 236.91, -440.16], [-1, -1, -1]);
    this.scene.activeCamera!.attachControl(this.domElement);
    this.lights = [
      this.createLight([1000, 1000, 1000], 0.006),
      this.createLight([-200, -630, -598], 0.006),
    ];
    this.engine.runRenderLoop(() => {
      this.normalizeFrame();
      this.scene.render();
    });
    this.scene.skipPointerMovePicking = true;
    // window.camera = this.camera;
  }

  draw(figures: Array<DrawableInterface>): void {
    for (const figure of figures) {
      if (figure instanceof DrawablePoint) {
        const drawObject = this.getPointDrawObject(figure);
        drawObject.scaling.x = figure.config.radius;
        drawObject.scaling.y = figure.config.radius;
        drawObject.scaling.z = figure.config.radius;
      }

      if (figure instanceof DrawableLine) {
        this.getLineDrawObject(figure);
      }
    }
  }

  public clear() {
    this.pointsMap.forEach((item) => this.scene.removeMesh(item));
    this.linesMap.forEach((item) => this.scene.removeMesh(item));
    this.pointsMap.clear();
    this.linesMap.clear();
  }

  get bounds(): NumericVector[] {
    throw new Error('Method not implemented.');
  }

  get frameSize(): NumericVector {
    throw new Error('Method not implemented.');
  }

  get mouseCoords(): VectorInterface {
    throw new Error('Method not implemented.');
  }

  public centerOn(coords: NumericVector): void {
    throw new Error('Method not implemented.');
  }

  private normalizeFrame(): void {
    if (this.domElement.width !== this.domElement.clientWidth) {
      this.domElement.width = this.domElement.clientWidth;
    }
    if (this.domElement.height !== this.domElement.clientHeight) {
      this.domElement.height = this.domElement.clientHeight;
    }
  }

  private createCamera(position: NumericVector, rotation: NumericVector): ArcRotateCamera | UniversalCamera {
    const camera = new ArcRotateCamera("Camera", -1, 1, 500, new Vector3(0, 0, 0), this.scene);
    // const camera = new UniversalCamera('Camera', new Vector3(...position), this.scene);
    // camera.rotation = new Vector3(...rotation);
    camera.speed = 5;
    camera.position = new Vector3(...position);
    return camera;
  }

  private createLight(coords: NumericVector, intensity: number): PointLight {
    const light = new PointLight('Omni', new Vector3(coords[0], coords[1], coords[2]), this.scene);
    light.intensity = intensity;
    return light;
  }

  private createPointMesh(radius: number, coords: NumericVector, color: NumericVector, opacity: number, id: string): Mesh {
    const pointMesh = MeshBuilder.CreateSphere(`point_${id}`, {
      segments: 8,
      diameter: 2,
      updatable: false,
    }, this.scene);

    pointMesh.position.x = coords[0];
    pointMesh.position.y = coords[1];
    pointMesh.position.z = coords[2];

    pointMesh.scaling.x = radius;
    pointMesh.scaling.y = radius;
    pointMesh.scaling.z = radius;

    const material = new StandardMaterial('material', this.scene);
    material.diffuseColor.r = color[0];
    material.diffuseColor.g = color[1];
    material.diffuseColor.b = color[2];
    material.freeze();
    // material.transparencyMode = null;
    material.alpha = opacity;

    pointMesh.material = material;
    pointMesh.freezeNormals();
    pointMesh.isPickable = false;
    pointMesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;

    return pointMesh;
  }

  private createLineMesh(lhsCoords: NumericVector, rhsCoords: NumericVector, line: DrawableLine, mesh?: Mesh): Mesh {
    const radius = 1;

    this.bufVectors[0].x = lhsCoords[0];
    this.bufVectors[0].y = lhsCoords[1];
    this.bufVectors[0].z = lhsCoords[2];

    this.bufVectors[1].x = rhsCoords[0];
    this.bufVectors[1].y = rhsCoords[1];
    this.bufVectors[1].z = rhsCoords[2];

    if (mesh) {
      return this.createLineMeshFromInstance(this.bufVectors, radius, mesh);
    }

    const newMesh = this.createNewLineMesh(this.bufVectors, radius, line.config.from.join('-')+'_'+line.config.to.join('-'));

    const color = line.config.color;
    const material = new StandardMaterial('material', this.scene);
    material.diffuseColor.r = color[0];
    material.diffuseColor.g = color[1];
    material.diffuseColor.b = color[2];
    material.freeze();

    newMesh.material = material;
    newMesh.receiveShadows = false;
    newMesh.freezeWorldMatrix();
    newMesh.isPickable = false;
    newMesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;

    return newMesh;
  }

  private createNewLineMesh(path: Vector3[], radius: number, id: string): Mesh {
    return MeshBuilder.CreateTube(`line_${id}`, {
      path: [
        path[0],
        path[1],
      ],
      updatable: true,
      radius: radius,
      tessellation: 6,
    }, this.scene);
  }

  private createLineMeshFromInstance(path: Vector3[], radius: number, mesh: Mesh): Mesh {
    return MeshBuilder.CreateTube(mesh.name, {
      path: [
        path[0],
        path[1],
      ],
      radius: radius,
      instance: mesh,
    }, this.scene);
  }

  private getPointDrawObject(point: DrawablePoint): Mesh {
    return this.pointsMap.get(point) ?? this.addPointToMap(point);
  }

  private addPointToMap(point: DrawablePoint): Mesh {
    const drawObject = this.createPointMesh(
      point.config.radius,
      point.config.position,
      point.config.color,
      point.config.opacity ?? 1,
      point.config.position.join('-'),
    );
    this.pointsMap.set(point, drawObject);

    return drawObject;
  }

  private getLineDrawObject(line: DrawableLine): Mesh {
    const mesh = this.linesMap.get(line) ?? false;
    if (mesh) {
      return this.createLineMesh(line.config.from, line.config.to, line, mesh);
    }
    return this.addLineToMap(line);
  }

  private addLineToMap(line: DrawableLine): Mesh {
    const drawObject = this.createLineMesh(line.config.from, line.config.to, line);
    this.linesMap.set(line, drawObject);

    return drawObject;
  }

  get context(): CanvasRenderingContext2D {
    throw new Error('Not implemented');
  };

  get eventManager(): EventManagerInterface {
    throw new Error('Not implemented');
  };

  get viewConfig(): ViewConfigInterface {
    throw new Error('Not implemented');
  };
}
