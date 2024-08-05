import { ConfigOptions, configOptions } from "@utils/helper/configHelper";
import * as THREE from "three";
import Mousemove from "./Mousemove";
import Resources from "./Resources";

export default class ThreeInstance {
  private static __ins: ThreeInstance;
  private _canvas: HTMLCanvasElement | null;
  private scene: THREE.Scene;
  private mousemove: Mousemove;
  private resources: Resources;
  constructor(
    canvas: HTMLCanvasElement | null,
    config: ConfigOptions = configOptions
  ) {
    this._canvas =
      canvas || (document.getElementById(config.id) as HTMLCanvasElement);
    const { sources } = config;
    this.scene = new THREE.Scene();
    this.mousemove = new Mousemove(this._canvas);
    this.resources = new Resources(sources);
    
  }

  public static get shared(): ThreeInstance {
    if (!this.__ins) {
      this.__ins = new ThreeInstance(null, configOptions);
      (window as any).__threeInstance = ThreeInstance;
    }

    return this.__ins;
  }
}
