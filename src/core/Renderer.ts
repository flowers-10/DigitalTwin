import * as THREE from "three";
import ThreeInstance from "./ThreeInstance";
import { rendererConfig } from "@utils/helper/configHelper";

export default class Renderer {
    private experience: ThreeInstance;
    private scene;
    private canvas;
    private sizes;
    private camera;
    public instance: THREE.WebGLRenderer;

    constructor(config: rendererConfig) {
        this.experience = ThreeInstance.shared;
        this.canvas = this.experience._canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: config.antialias,
            alpha: config.alpha,
        });
        // 传统灯光系统
        // this.instance.useLegacyLights = true
        // 开启阴影相关配置
        // this.instance.toneMapping = THREE.CineonToneMapping
        // this.instance.toneMappingExposure = 1.75
        // this.instance.shadowMap.enabled = true
        // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        // 防止颜色失真
        this.instance.outputColorSpace = THREE.SRGBColorSpace;
        // 透明度
        config.clearAlpha
            ? this.instance.setClearAlpha(config.clearAlpha)
            : this.instance.setClearAlpha(0);
        // 背景色
        config.clearColor ? this.instance.setClearColor(config.clearColor) : null;
        // 渲染器尺寸
        this.instance.setSize(this.sizes.width, this.sizes.height);
        // 像素比
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }
    resize() {
        this.instance.setSize(this.sizes?.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }

    update() {
        this.instance.render(this.scene, this.camera?.instance);
    }

    info(message = "当前内存：") {
        console.log(message, this.instance.info.memory);
    }

    dispose() {
        this.instance.clear();
        this.instance.setSize(0, 0);
        this.instance.dispose();
        this.info("清空内存后：");
    }
}
