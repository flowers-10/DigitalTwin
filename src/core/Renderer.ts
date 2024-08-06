import * as THREE from "three";
import ThreeInstance from "./ThreeInstance";
import { rendererConfig } from "@utils/types/configOptType";

export default class Renderer {
    private experience: ThreeInstance;
    private scene;
    private canvas;
    private sizes;
    private camera;
    public instance: THREE.WebGLRenderer;

    constructor(config: rendererConfig, instance: ThreeInstance) {
        this.experience = instance;
        this.canvas = this.experience._canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: config.antialias,
            alpha: config.alpha,
        });
        // this.instance.useLegacyLights = true
        // this.instance.toneMapping = THREE.CineonToneMapping
        // this.instance.toneMappingExposure = 1.75
        // this.instance.shadowMap.enabled = true
        // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.outputColorSpace = THREE.SRGBColorSpace;
        config.clearAlpha
            ? this.instance.setClearAlpha(config.clearAlpha)
            : this.instance.setClearAlpha(0);

        config.clearColor ? this.instance.setClearColor(config.clearColor) : null;
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }
    resize() {
        this.instance.setSize(this.sizes?.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }

    update() {
        this.instance.render(this.scene, this.camera?.instance);
    }

    info(message = "present memory:") {
        console.log(message, this.instance.info.memory);
    }

    dispose() {
        this.instance.clear();
        this.instance.setSize(0, 0);
        this.instance.dispose();
        this.info("cleared memory:");
    }
}
