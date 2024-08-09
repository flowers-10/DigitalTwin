import * as THREE from "three";
import gsap from "gsap";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import ThreeInstance from "@core/ThreeInstance";
import { CONFIG_OPT } from "@core/config/configOpt";
import buildingOtherVertex from "@shaders/buildingOther/vertex.glsl";
import buildingOtherFragment from "@shaders/buildingOther/fragment.glsl";

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
  x: -200,
  y:  400,
  z: -200,
};
CONFIG_OPT.camera.fov = 75;
CONFIG_OPT.camera.near = 20;

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

const geometry = new THREE.BufferGeometry(); //声明一个空几何体对象

// wall Vertex
const posArr = [
  -125, -20, 0, 210, -40, 0, 210, -40, 40, -125, -20, 0, 210, -40, 40, -125,
  -20, 40, 210, -40, 0, 210, 60, 0, 210, 60, 40, 210, -40, 0, 210, 60, 40, 210,
  -40, 40, 210, 60, 0, 180, 165, 0, 180, 165, 40, 210, 60, 0, 180, 165, 40, 210,
  60, 40, 180, 165, 0, -130, 134, 0, -130, 134, 40, 180, 165, 0, -130, 134, 40,
  180, 165, 40, -130, 134, 0, -125, -20, 0, -125, -20, 40, -130, 134, 0, -125,
  -20, 40, -130, 134, 40,
];

// 设置几何体attributes属性的位置position属性
geometry.attributes.position = new THREE.BufferAttribute(
  new Float32Array(posArr),
  3
);
geometry.computeVertexNormals();

const material = new CustomShaderMaterial({
  baseMaterial: THREE.ShaderMaterial,
  uniforms: {
    iTime: { value: 0 },
  },
  vertexShader: `
      varying vec3 vPosition;
      void main(){   
        csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(csm_Position, 1.0);
        vPosition = csm_Position;
    }`,
  fragmentShader: `
      uniform float iTime;
      varying vec3 vPosition;

      void main(){   
       float alpha = 1.;
       alpha =  sin(vPosition.z + iTime * 10.);
        
        csm_FragColor = vec4( .2,1.,1.,alpha  );
      }  
    `,
  side: THREE.DoubleSide,
  transparent: true,
});
const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
mesh.name = "wall";
mesh.rotateX(-Math.PI / 2);

let buildingOtherMaterial: THREE.ShaderMaterial;
const buildingOtherUniforms = {
  iTime: { value: 0 },
  height: { value: 0 },
  maxHeight: { value: 50 },
  uFlowColor: {
    value: new THREE.Color("#5588aa"),
  },
  uCityColor: {
    value: new THREE.Color("#1B3045"),
  },
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
      if (key === "buildingOther") {
        items.scene.children[0].children.forEach((item: any) => {
          buildingOtherMaterial = new THREE.ShaderMaterial({
            uniforms: buildingOtherUniforms,
            vertexShader: buildingOtherVertex,
            fragmentShader: buildingOtherFragment,
            transparent: true,
            side: THREE.DoubleSide,
          });
          item.material = buildingOtherMaterial;
        });
      }
      items.show ? initScene.add(items.scene) : changScene.add(items.scene);
    }
    initScene.add(mesh);
    createGsapAnimation(
      instance.camera.instance.position,
      new THREE.Vector3(-20, 360, 166)
    );
  });
  instance.time.on("tick", () => {
    material.uniforms.iTime.value = instance.time.elapsedTime;
    buildingOtherUniforms.iTime.value = instance.time.elapsedTime;
    if (
      buildingOtherUniforms.height.value > buildingOtherUniforms.maxHeight.value
    ) {
      buildingOtherUniforms.height.value = 0;
    } else {
      buildingOtherUniforms.height.value += 0.3;
    }
  });
  instance.renderer.info();
  instance.sizes.info();
  return instance;
};
export default useThree;
