interface Sizes {
    width: number;
    height: number;
}
declare function scaleCompute(shape: Sizes, size: number): {
    x: number;
    y: number;
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
    scale: number;
};
export default scaleCompute;
