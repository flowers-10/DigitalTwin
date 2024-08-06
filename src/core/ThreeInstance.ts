import { ConfigOptions, configOptions } from "@utils/helper/configHelper";
import * as THREE from "three";
import Mousemove from "./Mousemove";
import Resources from "./Resources";
import Sizes from "./Sizes";
import Camera from "./Camera";
import Renderer from "./Renderer";
import BloomPass from './BloomPass'

export default class ThreeInstance {
  public static __ins: ThreeInstance;
  public _canvas: HTMLCanvasElement;
  public scene: THREE.Scene;
  public mousemove: Mousemove;
  public resources: Resources;
  public sizes: Sizes;
  public camera: Camera;
  public renderer: Renderer;
  public _config: ConfigOptions;
  private bloomPass
  constructor(
    canvas?: HTMLCanvasElement,
    config: ConfigOptions = configOptions
  ) {
    const canvass = document.getElementById(config.id);
    if (!canvass && !canvas) {
      throw new Error("canvas has already been initialized.");
    }
    this._canvas = canvas || (canvass as HTMLCanvasElement);
    this._config = config;
    this.scene = new THREE.Scene();
    this.mousemove = new Mousemove(this._canvas);
    this.resources = new Resources(this._config.sources);
    this.sizes = new Sizes(this._config.size);
    this.camera = new Camera(this._config.camera);
    this.renderer = new Renderer(this._config.renderer);

    switch (this._config.rendererPass.type) {
      case 'OUTLINE':
      
        break
      case 'BLOOM':
        this.bloomPass = new BloomPass(this._config.rendererPass.bloomConfig) 
        break
      case 'NONE':
        break
      default:
        break
    }
  }

  public setOption(option: any) {
    this._config = { ...this._config, ...option };
  }

  public static get shared(): ThreeInstance {
    if (!this.__ins) {
      this.__ins = new ThreeInstance(undefined, configOptions);
      (window as any).__threeInstance = ThreeInstance;
    }

    return this.__ins;
  }
}
