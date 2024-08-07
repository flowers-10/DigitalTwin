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
  constructor(protected _instance: ThreeInstance) {
    this.sizes = _instance.sizes;
    this.scene = _instance.scene;
    this.canvas = _instance._canvas;
  }
  resize(): void {}
  update(): void {}
  dispose(): void {}
}
