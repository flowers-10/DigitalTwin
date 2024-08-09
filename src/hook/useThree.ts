import * as THREE from "three";
import ThreeInstance from "@core/ThreeInstance";
import { CONFIG_OPT } from "@utils/config/configOpt";
import gsap from "gsap";

//  custom config
CONFIG_OPT.sources = [
  {
    name: "buildingTransparent",
    type: "GLTF",
    path: "models/smartBusiness/building-transparent.glb",
    show: false,
  },
  {
    name: "lift",
    type: "GLTF",
    path: "models/smartBusiness/lift.glb",
    show: false,
  },
  {
    name: "buildingMain",
    type: "GLTF",
    path: "models/smartBusiness/building-main.glb",
    show: true,
  },
  {
    name: "plane",
    type: "GLTF",
    path: "models/smartBusiness/plane.glb",
    show: true,
  },
  {
    name: "buildingOther",
    type: "GLTF",
    path: "models/smartBusiness/building-other.glb",
    show: true,
  },
  {
    name: "tree",
    type: "GLTF",
    path: "models/smartBusiness/tree.glb",
    show: true,
  },
  {
    name: "roadOld",
    type: "GLTF",
    path: "models/smartBusiness/road-old.glb",
    show: true,
  },
  {
    name: "road",
    type: "GLTF",
    path: "models/smartBusiness/road.glb",
    show: true,
  },
];

CONFIG_OPT.camera.position = {
  x:-200,
  y:200,
  z:-200,
}
CONFIG_OPT.camera.fov = 75
CONFIG_OPT.camera.near = 20

const createGsapAnimation = (
  position: THREE.Vector3,
  position_: THREE.Vector3
) => {
  return gsap.to(position, {
    ...position_,
    duration: 1.5,
    ease: "none",
    repeat: 0,
    yoyo: false,
    yoyoEase: true,
  });
};

const useThree = (canvas: HTMLCanvasElement) => {
  const instance: ThreeInstance = new ThreeInstance(canvas, CONFIG_OPT);
  const initScene = new THREE.Group();
  const changScene = new THREE.Group();
  instance.scene.add(initScene);
  instance.scene.add(changScene);
  instance.resources.on("ready", () => {
    for (const key in instance.resources.items) {
      const items = instance.resources.items[key];
      items.show ? initScene.add(items.scene) : changScene.add(items.scene);
    }
    createGsapAnimation(
      instance.camera.instance.position,
      new THREE.Vector3(-40, 60, 166)
    );
  });

  instance.renderer.info();
  instance.sizes.info();
  return instance;
};
export default useThree;
