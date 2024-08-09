import ThreeInstance from "@core/ThreeInstance";
import { CONFIG_OPT } from "@utils/config/configOpt";

const useThree = (canvas: HTMLCanvasElement) => {
  CONFIG_OPT.sources = [
    {
      name: "buildingTransparent",
      type: "GLTF",
      path: "models/smartBusiness/building-transparent.glb",
    },
  ];
  const instance: ThreeInstance = new ThreeInstance(canvas, CONFIG_OPT);
  instance.renderer.info();
  instance.sizes.info();
  return instance;
};
export default useThree;
