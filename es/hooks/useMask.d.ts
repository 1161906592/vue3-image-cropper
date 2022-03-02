import { Ref } from 'vue';
export interface Shape {
    x: number;
    y: number;
    width: number;
    height: number;
}
interface Props {
    sizeRef: Ref<number>;
    maskColorRef: Ref<string>;
    controlShapeReactive: Shape;
}
declare function useMask(props: Props): {
    maskCanvasRef: Ref<HTMLCanvasElement | undefined>;
};
export default useMask;
