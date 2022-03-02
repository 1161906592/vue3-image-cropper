import { computed, ref, watchEffect } from 'vue';
function useMask(props) {
    const { sizeRef, maskColorRef, controlShapeReactive } = props;
    const maskCanvasRef = ref();
    const maskContextRef = computed(() => { var _a; return (_a = maskCanvasRef.value) === null || _a === void 0 ? void 0 : _a.getContext('2d'); });
    watchEffect(() => {
        const ctx = maskContextRef.value;
        if (!ctx) {
            return;
        }
        const size = sizeRef.value;
        const maskColor = maskColorRef.value;
        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = maskColor;
        ctx.fillRect(0, 0, size, controlShapeReactive.y);
        ctx.fillRect(0, controlShapeReactive.y, controlShapeReactive.x, controlShapeReactive.height);
        ctx.fillRect(controlShapeReactive.x + controlShapeReactive.width, controlShapeReactive.y, size - controlShapeReactive.x - controlShapeReactive.width, controlShapeReactive.height);
        ctx.fillRect(0, controlShapeReactive.y + controlShapeReactive.height, size, size - controlShapeReactive.y - controlShapeReactive.height);
    });
    return { maskCanvasRef };
}
export default useMask;
