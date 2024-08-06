import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import ThreeInstance from "./ThreeInstance";
import { BloomConfigType } from "@utils/types/configOptType";

export default class BloomPass {
  private experience: ThreeInstance;
  private scene;
  private renderer;
  private camera;
  private bloomLayer;
  private materials: any;
  private darkMaterial;
  private bloomComposer;
  private finalComposer;
  constructor(config: BloomConfigType,instance: ThreeInstance) {
    this.experience = instance;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.renderer = this.experience.renderer.instance;
    // 后处理渲染图层（总共可后处理31层）
    const BLOOM_LAYER = 1;
    this.bloomLayer = new THREE.Layers();
    this.bloomLayer.set(BLOOM_LAYER);
    // 存储需要应用辉光效果的材质对象
    this.materials = {};
    // 将未应用辉光效果的物体暗化
    this.darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    const renderPass = new RenderPass(this.scene, this.camera);
    this.bloomComposer = new EffectComposer(this.renderer);
    this.bloomComposer.renderToScreen = false;
    this.bloomComposer.addPass(renderPass);
    this.finalComposer = new EffectComposer(this.renderer);
    this.finalComposer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(
        this.renderer.domElement.offsetWidth,
        this.renderer.domElement.offsetHeight
      ),
      config.strength,
      config.radius,
      config.threshold
    );
    this.bloomComposer.addPass(bloomPass);

    const shaderPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
        },
        vertexShader: `varying vec2 vUv;
        void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
        fragmentShader: `uniform sampler2D baseTexture; 
          uniform sampler2D bloomTexture; 
          varying vec2 vUv;

          void main() {
            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
          }`,
        defines: {},
      }),
      "baseTexture"
    );
    shaderPass.needsSwap = true;
    this.finalComposer.addPass(shaderPass);
  }

  darkenNonBloomed = (obj: any) => {
    if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
      // 保存原始材质
      this.materials[obj.uuid] = obj.material;
      // 应用暗化材质
      obj.material = this.darkMaterial;
    }
  };
  // 对所有材质更改
  restoreMaterial = (obj: any) => {
    if (this.materials[obj.uuid]) {
      // 恢复原始材质
      obj.material = this.materials[obj.uuid];
      delete this.materials[obj.uuid];
    }
  };
  update() {
    this.scene.traverse(this.darkenNonBloomed);
    this.bloomComposer.render();
    this.scene.traverse(this.restoreMaterial);
    this.finalComposer.render();
  }
}
