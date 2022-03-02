var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { h, Fragment, defineComponent, ref, watchEffect, withModifiers, Teleport, toRef } from 'vue';
import useControls from './hooks/useControls';
import loadImage from './utils/loadImage';
import useMask from './hooks/useMask';
import usePreview from './hooks/usePreview';
const ImageCropper = defineComponent({
    props: {
        src: String,
        size: { type: Number, default: 400 },
        minSize: { type: Number, default: 20 },
        showSize: { type: Boolean, default: true },
        maskColor: { type: String, default: '#00000032' },
        initPadding: { type: Number, default: 0 },
        previewTo: Object,
        previewSize: { type: Number, default: 50 },
        previewPixelRatio: { type: Number, default: devicePixelRatio },
    },
    setup(props) {
        const sizeRef = toRef(props, 'size');
        const minSizeRef = toRef(props, 'minSize');
        const maskColorRef = toRef(props, 'maskColor');
        const initPaddingRef = toRef(props, 'initPadding');
        const previewSizeRef = toRef(props, 'previewSize');
        const previewPixelRatioRef = toRef(props, 'previewPixelRatio');
        const imageRef = ref();
        const { controlShapeReactive, cropShapeRef, imageScaleRef, controls, onContainerDrag } = useControls({
            sizeRef,
            minSizeRef,
            initPaddingRef,
            imageRef,
        });
        const { maskCanvasRef } = useMask({
            sizeRef,
            maskColorRef,
            controlShapeReactive,
        });
        const { previewCanvasRef } = usePreview({
            cropShapeRef,
            imageScaleRef,
            imageRef,
            previewSizeRef,
            previewPixelRatioRef,
        });
        watchEffect(() => __awaiter(this, void 0, void 0, function* () {
            const src = props.src;
            if (src) {
                imageRef.value = yield loadImage(src);
            }
        }));
        return () => {
            const { size, previewPixelRatio, previewSize } = props;
            const imageShape = imageScaleRef.value;
            const realPreviewSize = previewSize * previewPixelRatio;
            return (h("div", { class: "cropper-wrapper", style: { width: `${size}px`, height: `${size}px` }, draggable: false },
                !!imageRef.value && (h(Fragment, null,
                    h("img", { src: props.src, style: { width: `${imageShape.width}px`, height: `${imageShape.height}px` } }),
                    h("canvas", { width: size, height: size, ref: maskCanvasRef }),
                    h("div", { class: "cropper-controls", style: {
                            transform: `translate(${controlShapeReactive.x}px, ${controlShapeReactive.y}px)`,
                            width: `${controlShapeReactive.width}px`,
                            height: `${controlShapeReactive.height}px`,
                        }, onMousedown: withModifiers(onContainerDrag, ['stop']) },
                        !!props.showSize && (h("div", { class: "cropper-size", style: { transform: `translateY(${controlShapeReactive.y > 22 ? '-100%' : 0})` } },
                            controlShapeReactive.width,
                            " x ",
                            controlShapeReactive.height)),
                        controls.map((item) => (h("div", { key: item.directions.join(''), class: [...item.directions, 'cropper-control'], onMousedown: withModifiers(item.onDrag, ['stop']), style: { cursor: item.cursor } })))))),
                !!props.previewTo && (h(Teleport, { to: props.previewTo },
                    h("canvas", { width: realPreviewSize, height: realPreviewSize, ref: previewCanvasRef, class: "cropper-preview" })))));
        };
    },
});
export default ImageCropper;
