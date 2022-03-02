"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const scaleCompute_1 = __importDefault(require("../utils/scaleCompute"));
function usePreview(props) {
    const { cropShapeRef, imageScaleRef, previewSizeRef, previewPixelRatioRef, imageRef } = props;
    const previewCanvasRef = (0, vue_1.ref)();
    const previewContextRef = (0, vue_1.computed)(() => { var _a; return (_a = previewCanvasRef.value) === null || _a === void 0 ? void 0 : _a.getContext('2d'); });
    const previewShapeRef = (0, vue_1.computed)(() => (0, scaleCompute_1.default)(cropShapeRef.value, previewSizeRef.value));
    (0, vue_1.watchEffect)(() => {
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
exports.default = usePreview;
