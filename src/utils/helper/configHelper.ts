type SourcesType = "TEXTURE" | "CUBE_TEXTURE" | "GLTF" | "MP3" | "FONT";
type ConfigType = "CHART" | "GAMES" | "APP";
type SizeType = "parent" | "winodw";
type PassType = "NONE" | "OUTLINE" | "BLOOM";
type LightType = "point" | "ambient" | "hemisphere" | "spot";

type PositionType = {
  x: number;
  y: number;
  z: number;
};

export type SourcesItems = {
  name: string;
  type: SourcesType;
  path: string;
};
type LightItems = {
  type: LightType;
  color: string;
  intensity: number;
  distance: number;
  helper: boolean;
  lightId: number;
  lightName: string;
  position: PositionType;
};

export type sizeConfigType = {
  type: SizeType;
  id: string;
};
export type CameraConfig = {
  fov: number;
  near: number;
  far: number;
  position: PositionType;
  lookAt: boolean;
  controls: {
    show: boolean;
    enableDamping: boolean;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    enablePan: boolean;
  };
};

export type rendererConfig = {
  antialias: boolean;
  alpha: boolean;
  clearAlpha: number;
  clearColor: string;
};

export interface ConfigOptions {
  el: string;
  id: string;
  type: ConfigType;
  name: string;
  camera: CameraConfig;
  size: sizeConfigType;
  rendererPass: {
    type: PassType;
    outlineConfig: {};
    bloomConfig: {};
  };
  renderer: rendererConfig;
  light: LightItems[];
  sources: SourcesItems[];
}

export const configOptions: ConfigOptions = {
  el: "_canvas-scene",
  id: "_scene",
  type: "CHART",
  name: "hello world",
  camera: {
    fov: 60,
    near: 1,
    far: 10000,
    position: {
      x: 600,
      y: 600,
      z: 600,
    },
    lookAt: true,
    controls: {
      show: true,
      enableDamping: true,
      minPolarAngle: Math.PI * 0.25,
      maxPolarAngle: Math.PI * 0.75,
      minAzimuthAngle: -Math.PI * 0.45,
      maxAzimuthAngle: Math.PI * 0.25,
      enablePan: false,
    },
  },
  size: {
    type: "parent",
    id: "_Background_3D",
  },
  rendererPass: {
    type: "NONE",
    outlineConfig: {
      edgeStrength: 3,
      edgeGlow: 1,
      edgeThickness: 3,
      pulsePeriod: 2,
      gamma: true,
      antiAliasing: true,
      showIndex: 1,
    },
    bloomConfig: {
      strength: 0.8,
      radius: 0.5,
      threshold: 0.5,
    },
  },
  renderer: {
    antialias: true,
    alpha: true,
    clearAlpha: 0,
    clearColor: "",
  },
  light: [
    {
      type: "point",
      color: "#3e99e5",
      intensity: 3,
      distance: 500,
      helper: false,
      lightId: 0,
      lightName: "光源1",
      position: {
        x: -10,
        y: 48,
        z: 50,
      },
    },
  ],
  sources: [],
};
