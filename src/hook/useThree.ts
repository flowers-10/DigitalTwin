import ThreeInstance from "../core/ThreeInstance";

const useThree = (canvas:HTMLCanvasElement) => {
    const instance:ThreeInstance = new ThreeInstance(canvas)
    return instance
}
export default useThree