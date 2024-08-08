import ThreeInstance from "@core/ThreeInstance";

const useThree = (canvas: HTMLCanvasElement, config?:any) => {
  const instance: ThreeInstance = new ThreeInstance(canvas, config);
  return instance;
};
export default useThree;
