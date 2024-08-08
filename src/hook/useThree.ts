import ThreeInstance from "@core/ThreeInstance";
import { ConfigOptType } from "@core/types/ConfigOptType";

const useThree = (canvas: HTMLCanvasElement, config?: ConfigOptType) => {
  const instance: ThreeInstance = new ThreeInstance(canvas, config);
  return instance;
};
export default useThree;
