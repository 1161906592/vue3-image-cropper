import { Ref } from 'vue';
import useDrag from './useDrag';
declare type Direction = 'n' | 'e' | 's' | 'w' | 'c';
interface Control {
    directions: Direction[];
    onDrag: ReturnType<typeof useDrag>;
    cursor: string;
}
interface Props {
    sizeRef: Ref<number>;
    minSizeRef: Ref<number>;
    initPaddingRef: Ref<number>;
    imageRef: Ref<HTMLImageElement | undefined>;
}
declare function useControls(props: Props): {
    controlShapeReactive: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    controls: Control[];
    onContainerDrag: (e: MouseEvent) => void;
    cropShapeRef: import("vue").ComputedRef<{
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
    imageScaleRef: import("vue").ComputedRef<{
        x: number;
        y: number;
        width: number;
        height: number;
        maxWidth: number;
        maxHeight: number;
        scale: number;
    }>;
};
export default useControls;
