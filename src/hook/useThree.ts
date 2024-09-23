import * as THREE from "three";
import gsap from "gsap";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import * as AUTO from "three-auto";
import * as dat from "lil-gui";

import buildingOtherVertex from "@shaders/buildingOther/vertex.glsl";
import buildingOtherFragment from "@shaders/buildingOther/fragment.glsl";

// todo:  custom config
const sources: AUTO.SourcesItems[] = [
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
const createWall = () => {
  const geometry = new THREE.BufferGeometry(); //声明一个空几何体对象
  // wall Vertex
  const posArr = [
    -125, -20, 0, 210, -40, 0, 210, -40, 40, -125, -20, 0, 210, -40, 40, -125,
    -20, 40, 210, -40, 0, 210, 60, 0, 210, 60, 40, 210, -40, 0, 210, 60, 40,
    210, -40, 40, 210, 60, 0, 180, 165, 0, 180, 165, 40, 210, 60, 0, 180, 165,
    40, 210, 60, 40, 180, 165, 0, -130, 134, 0, -130, 134, 40, 180, 165, 0,
    -130, 134, 40, 180, 165, 40, -130, 134, 0, -125, -20, 0, -125, -20, 40,
    -130, 134, 0, -125, -20, 40, -130, 134, 40,
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
  return mesh;
};

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

const setCityLineMaterial = (object: any, instance: AUTO.ThreeAuto) => {
  const edges = new THREE.EdgesGeometry(object.geometry, 1);
  //设置模型的材质
  const lineMaterial = new THREE.LineBasicMaterial({
    // 线的颜色
    color: "rgba(38,133,254)",
  });
  //把数据组合起来
  const lineS = new THREE.LineSegments(edges, lineMaterial);
  //设置数据的位置
  lineS.position.set(object.position.x, object.position.y, object.position.z);
  //添加到场景
  instance.scene.add(lineS);

  lineS.rotateX(Math.PI / 2);
};

const useThree = (canvas: HTMLCanvasElement) => {
  const gui = new dat.GUI();

  const instance: AUTO.ThreeAuto = new AUTO.ThreeAuto(canvas);
  const resources = new AUTO.Resources(sources);
  gui.add(instance._camera.position, "x").min(-1000).max(3000).step(1).name("x轴");
  gui.add(instance._camera.position, "y").min(-1000).max(3000).step(1).name("y轴");
  gui.add(instance._camera.position, "z").min(-1000).max(3000).step(1).name("z轴");
  gui.add(instance._camera, "near").min(-1000).max(3000).step(1).name("近");
  gui.add(instance._camera, "far").min(-1000).max(3000).step(1).name("远");
  gui.add(instance._camera, "fov").min(-1000).max(3000).step(1).name("视口");
  gui.add(instance.scene.position, "x").min(-1000).max(3000).step(1).name("x轴");
  gui.add(instance.scene.position, "y").min(-1000).max(3000).step(1).name("y轴");
  gui.add(instance.scene.position, "z").min(-1000).max(3000).step(1).name("z轴");
  (instance.camera.instance as THREE.PerspectiveCamera).fov = 75;
  instance.camera.instance.near = 20;
  instance.camera.instance.position.set(0, 0, 0);
  const initScene = new THREE.Group();
  const changScene = new THREE.Group();
  instance.scene.add(initScene);
  const customPass = new AUTO.CustomPass(instance)
  customPass.composer.addPass(new EffectPass(instance._camera, new BloomEffect()))
  instance._renderer.setClearColor('#000', 0.7)
  const wallMesh = createWall()
  resources.on("ready", () => {
    resources.sources.forEach(item => {
      if (item.show) {
        const scene = resources.items.get(item.name).scene
        initScene.add(scene)
      } else {
        const scene = resources.items.get(item.name).scene
        changScene.add(scene);
      } 
    });
    initScene.add(wallMesh);
    createGsapAnimation(
      instance.camera.instance.position,
      new THREE.Vector3(-50, 50, 400)
    );
  });
  instance.time.on("tick", () => {
    customPass.composer.render()
    wallMesh.material.uniforms.iTime.value = instance.time.elapsedTime;
    // buildingOtherUniforms.iTime.value = instance.time.elapsedTime;
    // if (
    //   buildingOtherUniforms.height.value > buildingOtherUniforms.maxHeight.value
    // ) {
    //   buildingOtherUniforms.height.value = 0;
    // } else {
    //   buildingOtherUniforms.height.value += 0.3;
    // }
  });
  instance.renderer.info();
  instance.sizes.info();
  return instance;
};
export default useThree;
