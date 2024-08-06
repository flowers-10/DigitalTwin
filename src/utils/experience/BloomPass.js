import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import ThreeInstance from './ThreeInstance'

export default class BloomPass {
  constructor() {
    this.experience = ThreeInstance.shared
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
    this.createPass();
  }
  createPass() {
    // 渲染场景的Pass
    const renderPass = new RenderPass(this.scene, this.camera);
    // bloomComposer效果合成器 产生辉光，但是不渲染到屏幕上
    this.bloomComposer = new EffectComposer(this.renderer);
    this.bloomComposer.renderToScreen = false; // 不渲染到屏幕上
    this.bloomComposer.addPass(renderPass);
    // 最终真正渲染到屏幕上的效果合成器 finalComposer
    this.finalComposer = new EffectComposer(this.renderer);
    this.finalComposer.addPass(renderPass);

    // 辉光Pass
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(
        this.renderer.domElement.offsetWidth,
        this.renderer.domElement.offsetHeight
      ),
      0.8, // 强度参数
      0.5, // 半径参数
      0.5 // 阈值参数
    );
    this.bloomComposer.addPass(bloomPass);

    // 使用自定义着色器的Pass，实现叠加基础纹理和辉光纹理的效果
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

  darkenNonBloomed = (obj) => {
    if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
      // 保存原始材质
      this.materials[obj.uuid] = obj.material;
      // 应用暗化材质
      obj.material = this.darkMaterial;
    }
  };
  // 对所有材质更改
  restoreMaterial = (obj) => {
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
