import { Ref } from 'vue';
import scaleCompute from '../utils/scaleCompute';
import { Shape } from './useMask';
interface Props {
    cropShapeRef: Ref<Shape>;
    imageScaleRef: Ref<ReturnType<typeof scaleCompute>>;
    previewSizeRef: Ref<number>;
    previewPixelRatioRef: Ref<number>;
    imageRef: Ref<HTMLImageElement | undefined>;
}
declare function usePreview(props: Props): {
    previewCanvasRef: Ref<HTMLCanvasElement | undefined>;
};
export default usePreview;
