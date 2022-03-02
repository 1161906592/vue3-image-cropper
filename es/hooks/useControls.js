import { computed, reactive, watchEffect } from 'vue';
import scaleCompute from '../utils/scaleCompute';
import useDrag from './useDrag';
function useControls(props) {
    const { sizeRef, minSizeRef, imageRef, initPaddingRef } = props;
    const controlShapeReactive = reactive({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const imageScaleRef = computed(() => {
        const { width = 0, height = 0 } = imageRef.value || {};
        return scaleCompute({ width, height }, sizeRef.value);
    });
    const cropShapeRef = computed(() => {
        const imageShape = imageScaleRef.value;
        return {
            x: controlShapeReactive.x - imageShape.x,
            y: controlShapeReactive.y - imageShape.y,
            width: controlShapeReactive.width,
            height: controlShapeReactive.height,
        };
    });
    watchEffect(() => {
        const imageShape = imageScaleRef.value;
        const initPadding = initPaddingRef.value;
        controlShapeReactive.x = imageShape.x + initPadding;
        controlShapeReactive.y = imageShape.y + initPadding;
        controlShapeReactive.width = imageShape.width - initPadding * 2;
        controlShapeReactive.height = imageShape.height - initPadding * 2;
    });
    const onContainerDrag = useDrag(({ x, y }) => {
        const { x: shapeX, y: shapeY } = controlShapeReactive;
        const imageShape = imageScaleRef.value;
        controlShapeReactive.x = Math.min(Math.max(controlShapeReactive.x + x, imageShape.x), imageShape.maxWidth - controlShapeReactive.width);
        controlShapeReactive.y = Math.min(Math.max(controlShapeReactive.y + y, imageShape.y), imageShape.maxHeight - controlShapeReactive.height);
        return { x: controlShapeReactive.x - shapeX, y: controlShapeReactive.y - shapeY };
    }, {
        cursor: 'move',
    });
    const controls = [
        {
            directions: ['n', 'w'],
            onDrag: useDrag(({ x, y }) => {
                const { x: shapeX, y: shapeY, width: shapeWidth, height: shapeHeight } = controlShapeReactive;
                const imageShape = imageScaleRef.value;
                const minSize = minSizeRef.value;
                controlShapeReactive.x = Math.min(Math.max(controlShapeReactive.x + x, imageShape.x), shapeX + shapeWidth - minSize);
                controlShapeReactive.y = Math.min(Math.max(controlShapeReactive.y + y, imageShape.y), shapeY + shapeHeight - minSize);
                const offsetX = controlShapeReactive.x - shapeX;
                const offsetY = controlShapeReactive.y - shapeY;
                controlShapeReactive.width -= offsetX;
                controlShapeReactive.height -= offsetY;
                return { x: offsetX, y: offsetY };
            }, {
                cursor: 'nw-resize',
            }),
            cursor: 'nw-resize',
        },
        {
            directions: ['n', 'c'],
            onDrag: useDrag(({ y }) => {
                const { y: shapeY, height: shapeHeight } = controlShapeReactive;
                const imageShape = imageScaleRef.value;
                const minSize = minSizeRef.value;
                controlShapeReactive.y = Math.min(Math.max(controlShapeReactive.y + y, imageShape.y), shapeY + shapeHeight - minSize);
                const offsetY = controlShapeReactive.y - shapeY;
                controlShapeReactive.height -= offsetY;
                return { x: 0, y: offsetY };
            }, {
                cursor: 'n-resize',
            }),
            cursor: 'n-resize',
        },
        {
            directions: ['n', 'e'],
            onDrag: useDrag(({ x, y }) => {
                const { y: shapeY, width: shapeWidth, height: shapeHeight } = controlShapeReactive;
                const imageShape = imageScaleRef.value;
                const minSize = minSizeRef.value;
                controlShapeReactive.y = Math.min(Math.max(controlShapeReactive.y + y, imageShape.y), shapeY + shapeHeight - minSize);
                const offsetY = controlShapeReactive.y - shapeY;
                controlShapeReactive.width = Math.min(Math.max(controlShapeReactive.width + x, minSize), imageShape.maxWidth - controlShapeReactive.x);
                controlShapeReactive.height = Math.min(Math.max(controlShapeReactive.height - offsetY, 0), imageShape.maxHeight - controlShapeReactive.y);
                return { x: controlShapeReactive.width - shapeWidth, y: offsetY };
            }, {
                cursor: 'ne-resize',
            }),
            cursor: 'ne-resize',
        },
        {
            directions: ['e', 'c'],
            onDrag: useDrag(({ x }) => {
                const { width: shapeWidth } = controlShapeReactive;
                const imageShape = imageScaleRef.value;
                const minSize = minSizeRef.value;
                controlShapeReactive.width = Math.min(Math.max(controlShapeReactive.width + x, minSize), imageShape.maxWidth - controlShapeReactive.x);
                return { x: controlShapeReactive.width - shapeWidth, y: 0 };
            }, {
                cursor: 'e-resize',
            }),
            cursor: 'e-resize',
        },
        {
            directions: ['s', 'e'],
            onDrag: useDrag(({ x, y }) => {
                const { width: shapeWidth, height: shapeHeight } = controlShapeReactive;
                const imageShape = imageScaleRef.value;
                const minSize = minSizeRef.value;
                controlShapeReactive.width = Math.min(Math.max(controlShapeReactive.width + x, minSize), imageShape.maxWidth - controlShapeReactive.x);
                controlShapeReactive.height = Math.min(Math.max(controlShapeReactive.height + y, minSize), imageShape.maxHeight - controlShapeReactive.y);
                return { x: controlShapeReactive.width - shapeWidth, y: controlShapeReactive.height - shapeHeight };
            }, {
                cursor: 'se-resize',
            }),
            cursor: 'se-resize',
        },
        {
            directions: ['s', 'c'],
            onDrag: useDrag(({ y }) => {
                const { height: shapeHeight } = controlShapeReactive;
                const imageShape = imageScaleRef.value;
                const minSize = minSizeRef.value;
                controlShapeReactive.height = Math.min(Math.max(controlShapeReactive.height + y, minSize), imageShape.maxHeight - controlShapeReactive.y);
                return { x: 0, y: controlShapeReactive.height - shapeHeight };
            }, {
                cursor: 's-resize',
            }),
            cursor: 's-resize',
        },
        {
            directions: ['s', 'w'],
            onDrag: useDrag(({ x, y }) => {
                const { x: shapeX, width: shapeWidth, height: shapeHeight } = controlShapeReactive;
                const imageShape = imageScaleRef.value;
                const minSize = minSizeRef.value;
                controlShapeReactive.x = Math.min(Math.max(controlShapeReactive.x + x, imageShape.x), shapeX + shapeWidth - minSize);
                const offsetX = controlShapeReactive.x - shapeX;
                controlShapeReactive.width = Math.min(Math.max(controlShapeReactive.width - offsetX, 0), imageShape.maxWidth - controlShapeReactive.x);
                controlShapeReactive.height = Math.min(Math.max(controlShapeReactive.height + y, minSize), imageShape.maxHeight - controlShapeReactive.y);
                return { x: offsetX, y: controlShapeReactive.height - shapeHeight };
            }, {
                cursor: 'sw-resize',
            }),
            cursor: 'sw-resize',
        },
        {
            directions: ['w', 'c'],
            onDrag: useDrag(({ x }) => {
                const { x: shapeX, width: shapeWidth } = controlShapeReactive;
                const imageShape = imageScaleRef.value;
                const minSize = minSizeRef.value;
                controlShapeReactive.x = Math.min(Math.max(controlShapeReactive.x + x, imageShape.x), shapeX + shapeWidth - minSize);
                const offsetX = controlShapeReactive.x - shapeX;
                controlShapeReactive.width = Math.min(Math.max(controlShapeReactive.width - offsetX, 0), imageShape.maxWidth - controlShapeReactive.x);
                return { x: offsetX, y: 0 };
            }, {
                cursor: 'w-resize',
            }),
            cursor: 'w-resize',
        },
    ];
    return {
        controlShapeReactive,
        controls,
        onContainerDrag,
        cropShapeRef,
        imageScaleRef,
    };
}
export default useControls;
