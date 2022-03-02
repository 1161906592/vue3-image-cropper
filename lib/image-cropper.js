"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const useControls_1 = __importDefault(require("./hooks/useControls"));
const loadImage_1 = __importDefault(require("./utils/loadImage"));
const useMask_1 = __importDefault(require("./hooks/useMask"));
const usePreview_1 = __importDefault(require("./hooks/usePreview"));
const ImageCropper = (0, vue_1.defineComponent)({
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
        const sizeRef = (0, vue_1.toRef)(props, 'size');
        const minSizeRef = (0, vue_1.toRef)(props, 'minSize');
        const maskColorRef = (0, vue_1.toRef)(props, 'maskColor');
        const initPaddingRef = (0, vue_1.toRef)(props, 'initPadding');
        const previewSizeRef = (0, vue_1.toRef)(props, 'previewSize');
        const previewPixelRatioRef = (0, vue_1.toRef)(props, 'previewPixelRatio');
        const imageRef = (0, vue_1.ref)();
        const { controlShapeReactive, cropShapeRef, imageScaleRef, controls, onContainerDrag } = (0, useControls_1.default)({
            sizeRef,
            minSizeRef,
            initPaddingRef,
            imageRef,
        });
        const { maskCanvasRef } = (0, useMask_1.default)({
            sizeRef,
            maskColorRef,
            controlShapeReactive,
        });
        const { previewCanvasRef } = (0, usePreview_1.default)({
            cropShapeRef,
            imageScaleRef,
            imageRef,
            previewSizeRef,
            previewPixelRatioRef,
        });
        (0, vue_1.watchEffect)(() => __awaiter(this, void 0, void 0, function* () {
            const src = props.src;
            if (src) {
                imageRef.value = yield (0, loadImage_1.default)(src);
            }
        }));
        return () => {
            const { size, previewPixelRatio, previewSize } = props;
            const imageShape = imageScaleRef.value;
            const realPreviewSize = previewSize * previewPixelRatio;
            return ((0, vue_1.h)("div", { class: "cropper-wrapper", style: { width: `${size}px`, height: `${size}px` }, draggable: false },
                !!imageRef.value && ((0, vue_1.h)(vue_1.Fragment, null,
                    (0, vue_1.h)("img", { src: props.src, style: { width: `${imageShape.width}px`, height: `${imageShape.height}px` } }),
                    (0, vue_1.h)("canvas", { width: size, height: size, ref: maskCanvasRef }),
                    (0, vue_1.h)("div", { class: "cropper-controls", style: {
                            transform: `translate(${controlShapeReactive.x}px, ${controlShapeReactive.y}px)`,
                            width: `${controlShapeReactive.width}px`,
                            height: `${controlShapeReactive.height}px`,
                        }, onMousedown: (0, vue_1.withModifiers)(onContainerDrag, ['stop']) },
                        !!props.showSize && ((0, vue_1.h)("div", { class: "cropper-size", style: { transform: `translateY(${controlShapeReactive.y > 22 ? '-100%' : 0})` } },
                            controlShapeReactive.width,
                            " x ",
                            controlShapeReactive.height)),
                        controls.map((item) => ((0, vue_1.h)("div", { key: item.directions.join(''), class: [...item.directions, 'cropper-control'], onMousedown: (0, vue_1.withModifiers)(item.onDrag, ['stop']), style: { cursor: item.cursor } })))))),
                !!props.previewTo && ((0, vue_1.h)(vue_1.Teleport, { to: props.previewTo },
                    (0, vue_1.h)("canvas", { width: realPreviewSize, height: realPreviewSize, ref: previewCanvasRef, class: "cropper-preview" })))));
        };
    },
});
exports.default = ImageCropper;
