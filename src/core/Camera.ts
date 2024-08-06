import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ThreeInstance from "./ThreeInstance";
import { CameraConfig } from "@utils/helper/configHelper";

export default class Camera {
  private experience: ThreeInstance;
  private cameraConfig: CameraConfig;
  private scene;
  private canvas;
  private sizes;
  public instance: THREE.PerspectiveCamera;
  public controls: OrbitControls;

  constructor(config: CameraConfig) {
    this.experience = ThreeInstance.shared;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience._canvas;
    this.cameraConfig = config;
    const controls = config.controls;

    this.instance = new THREE.PerspectiveCamera(
      this.cameraConfig.fov,
      this.sizes?.width / this.sizes?.height,
      this.cameraConfig.near,
      this.cameraConfig.far
    );
    this.instance.position.set(
      this.cameraConfig.position.x,
      this.cameraConfig.position.y,
      this.cameraConfig.position.z
    );
    if (this.cameraConfig.lookAt) {
      this.instance.lookAt(this.scene.position);
    }
    // this.instance.rotateY(Math.PI * 0.5)
    this.instance.updateProjectionMatrix();
    this.scene.add(this.instance);
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = controls.enableDamping;
    // 设置旋转角度限制
    this.controls.minPolarAngle = controls.minPolarAngle; // 最小极角为45度
    this.controls.maxPolarAngle = controls.maxPolarAngle; // 最大极角为135度
    this.controls.minAzimuthAngle = controls.minAzimuthAngle; // 最小方位角为-45度
    this.controls.maxAzimuthAngle = controls.maxAzimuthAngle; // 最大方位角为45度
    this.controls.enablePan = controls.enablePan;
  }
  resize() {
    this.instance.aspect = this.sizes?.width / this.sizes?.height;
    this.instance.updateProjectionMatrix();
  }
  update() {
    this.controls?.update();
  }
  dispose() {
    this.controls?.dispose();
  }
}
