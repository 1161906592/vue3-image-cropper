import { PropType } from 'vue';
declare const ImageCropper: import("vue").DefineComponent<{
    src: PropType<string>;
    size: {
        type: PropType<number>;
        default: number;
    };
    minSize: {
        type: PropType<number>;
        default: number;
    };
    showSize: {
        type: PropType<boolean>;
        default: boolean;
    };
    maskColor: {
        type: PropType<string>;
        default: string;
    };
    initPadding: {
        type: PropType<number>;
        default: number;
    };
    previewTo: PropType<HTMLElement>;
    previewSize: {
        type: PropType<number>;
        default: number;
    };
    previewPixelRatio: {
        type: PropType<number>;
        default: number;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    src: PropType<string>;
    size: {
        type: PropType<number>;
        default: number;
    };
    minSize: {
        type: PropType<number>;
        default: number;
    };
    showSize: {
        type: PropType<boolean>;
        default: boolean;
    };
    maskColor: {
        type: PropType<string>;
        default: string;
    };
    initPadding: {
        type: PropType<number>;
        default: number;
    };
    previewTo: PropType<HTMLElement>;
    previewSize: {
        type: PropType<number>;
        default: number;
    };
    previewPixelRatio: {
        type: PropType<number>;
        default: number;
    };
}>>, {
    size: number;
    minSize: number;
    showSize: boolean;
    maskColor: string;
    initPadding: number;
    previewSize: number;
    previewPixelRatio: number;
}>;
export default ImageCropper;
