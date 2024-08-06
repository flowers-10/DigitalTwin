import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import EventEmitter from "./EventEmitter.js";
import { SourcesItems } from "@utils/helper/configHelper.js";

type Loaders = {
  gltfLoader: GLTFLoader;
  textureLoader: THREE.TextureLoader;
  cubeTextureLoader: THREE.CubeTextureLoader;
  fontLoader: FontLoader;
};

export default class Resources extends EventEmitter {
  private sources: SourcesItems[];
  private items: { [key: string]: any };
  private toLoad: number;
  private loaded: number;
  private loaders: Loaders;
  constructor(sources: SourcesItems[]) {
    super();
    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
      fontLoader: new FontLoader(),
    };
    this.startLoading();
  }

  startLoading() {
    // const domainName = location.origin;
    // console.log(domainName);

    // Load each source
    for (const source of this.sources) {
      if (source.type === "GLTF") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "TEXTURE") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "FONT") {
        this.loaders.fontLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source: SourcesItems, file: any) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready", null);
    }
  }
}
