import { computed, ref, watchEffect } from 'vue';
import scaleCompute from '../utils/scaleCompute';
function usePreview(props) {
    const { cropShapeRef, imageScaleRef, previewSizeRef, previewPixelRatioRef, imageRef } = props;
    const previewCanvasRef = ref();
    const previewContextRef = computed(() => { var _a; return (_a = previewCanvasRef.value) === null || _a === void 0 ? void 0 : _a.getContext('2d'); });
    const previewShapeRef = computed(() => scaleCompute(cropShapeRef.value, previewSizeRef.value));
    watchEffect(() => {
        const ctx = previewContextRef.value;
        const image = imageRef.value;
        if (!ctx || !image) {
            return;
        }
        const cropShape = cropShapeRef.value;
        const previewShape = previewShapeRef.value;
        const { scale } = imageScaleRef.value;
        const previewSize = previewSizeRef.value;
        const previewPixelRatio = previewPixelRatioRef.value;
        const size = previewSize * previewPixelRatio;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(image, cropShape.x / scale, cropShape.y / scale, cropShape.width / scale, cropShape.height / scale, previewShape.x * previewPixelRatio, previewShape.y * previewPixelRatio, previewShape.width * previewPixelRatio, previewShape.height * previewPixelRatio);
    });
    return { previewCanvasRef };
}
export default usePreview;
