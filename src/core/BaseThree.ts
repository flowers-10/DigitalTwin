import ThreeInstance from "./ThreeInstance";

interface BaseThreeInstance {
  resize(): void;
  update(): void;
  dispose(): void;
}

export default class BaseThree implements BaseThreeInstance {
  protected sizes;
  protected scene;
  protected canvas;
  protected camera;
  protected _camera;
  protected resources;
  constructor(protected _instance: ThreeInstance) {
    this.sizes = _instance.sizes;
    this.scene = _instance.scene;
    this.camera = _instance.camera;
    this._camera = _instance.camera?.instance || null;
    this.canvas = _instance._canvas;
    this.resources = _instance.resources;
  }
  resize(): void { }
  update(): void { }
  dispose(): void { }
}
