import { reactive, computed, watchEffect, ref, defineComponent, toRef, createVNode, Fragment, withModifiers, createTextVNode, Teleport } from "vue";
function scaleCompute(shape, size2) {
  if (shape.width > shape.height) {
    const scale2 = size2 / shape.width;
    const height = ~~(shape.height * scale2);
    const y = (size2 - height) / 2;
    return {
      x: 0,
      y,
      width: size2,
      height,
      maxWidth: size2,
      maxHeight: y + height,
      scale: scale2
    };
  }
  const scale = size2 / shape.height;
  const width = ~~(shape.width * scale);
  const x = (size2 - width) / 2;
  return {
    x,
    y: 0,
    width,
    height: size2,
    maxWidth: x + width,
    maxHeight: size2,
    scale
  };
}
function useDrag(onDrag, option) {
  const { cursor } = option;
  return (e2) => {
    const originCursor = document.body.style.cursor;
    document.body.style.cursor = cursor;
    const curPosition = {
      x: e2.clientX,
      y: e2.clientY
    };
    const handleMousemove = (e22) => {
      const { x, y } = onDrag({
        x: e22.clientX - curPosition.x,
        y: e22.clientY - curPosition.y
      });
      curPosition.x += x;
      curPosition.y += y;
    };
    const handleMouseup = () => {
      document.removeEventListener("mousemove", handleMousemove);
      document.removeEventListener("mouseup", handleMouseup);
      document.body.style.cursor = originCursor;
    };
    document.addEventListener("mousemove", handleMousemove);
    document.addEventListener("mouseup", handleMouseup);
  };
}
function useControls(props) {
  const { sizeRef, minSizeRef, imageRef, initPaddingRef } = props;
  const controlShapeReactive = reactive({
    x: 0,
    y: 0,
    width: 0,
    height: 0
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
      height: controlShapeReactive.height
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
    cursor: "move"
  });
  const controls2 = [
    {
      directions: ["n", "w"],
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
        cursor: "nw-resize"
      }),
      cursor: "nw-resize"
    },
    {
      directions: ["n", "c"],
      onDrag: useDrag(({ y }) => {
        const { y: shapeY, height: shapeHeight } = controlShapeReactive;
        const imageShape = imageScaleRef.value;
        const minSize = minSizeRef.value;
        controlShapeReactive.y = Math.min(Math.max(controlShapeReactive.y + y, imageShape.y), shapeY + shapeHeight - minSize);
        const offsetY = controlShapeReactive.y - shapeY;
        controlShapeReactive.height -= offsetY;
        return { x: 0, y: offsetY };
      }, {
        cursor: "n-resize"
      }),
      cursor: "n-resize"
    },
    {
      directions: ["n", "e"],
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
        cursor: "ne-resize"
      }),
      cursor: "ne-resize"
    },
    {
      directions: ["e", "c"],
      onDrag: useDrag(({ x }) => {
        const { width: shapeWidth } = controlShapeReactive;
        const imageShape = imageScaleRef.value;
        const minSize = minSizeRef.value;
        controlShapeReactive.width = Math.min(Math.max(controlShapeReactive.width + x, minSize), imageShape.maxWidth - controlShapeReactive.x);
        return { x: controlShapeReactive.width - shapeWidth, y: 0 };
      }, {
        cursor: "e-resize"
      }),
      cursor: "e-resize"
    },
    {
      directions: ["s", "e"],
      onDrag: useDrag(({ x, y }) => {
        const { width: shapeWidth, height: shapeHeight } = controlShapeReactive;
        const imageShape = imageScaleRef.value;
        const minSize = minSizeRef.value;
        controlShapeReactive.width = Math.min(Math.max(controlShapeReactive.width + x, minSize), imageShape.maxWidth - controlShapeReactive.x);
        controlShapeReactive.height = Math.min(Math.max(controlShapeReactive.height + y, minSize), imageShape.maxHeight - controlShapeReactive.y);
        return { x: controlShapeReactive.width - shapeWidth, y: controlShapeReactive.height - shapeHeight };
      }, {
        cursor: "se-resize"
      }),
      cursor: "se-resize"
    },
    {
      directions: ["s", "c"],
      onDrag: useDrag(({ y }) => {
        const { height: shapeHeight } = controlShapeReactive;
        const imageShape = imageScaleRef.value;
        const minSize = minSizeRef.value;
        controlShapeReactive.height = Math.min(Math.max(controlShapeReactive.height + y, minSize), imageShape.maxHeight - controlShapeReactive.y);
        return { x: 0, y: controlShapeReactive.height - shapeHeight };
      }, {
        cursor: "s-resize"
      }),
      cursor: "s-resize"
    },
    {
      directions: ["s", "w"],
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
        cursor: "sw-resize"
      }),
      cursor: "sw-resize"
    },
    {
      directions: ["w", "c"],
      onDrag: useDrag(({ x }) => {
        const { x: shapeX, width: shapeWidth } = controlShapeReactive;
        const imageShape = imageScaleRef.value;
        const minSize = minSizeRef.value;
        controlShapeReactive.x = Math.min(Math.max(controlShapeReactive.x + x, imageShape.x), shapeX + shapeWidth - minSize);
        const offsetX = controlShapeReactive.x - shapeX;
        controlShapeReactive.width = Math.min(Math.max(controlShapeReactive.width - offsetX, 0), imageShape.maxWidth - controlShapeReactive.x);
        return { x: offsetX, y: 0 };
      }, {
        cursor: "w-resize"
      }),
      cursor: "w-resize"
    }
  ];
  return {
    controlShapeReactive,
    controls: controls2,
    onContainerDrag,
    cropShapeRef,
    imageScaleRef
  };
}
function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.src = src;
  });
}
function useMask(props) {
  const { sizeRef, maskColorRef, controlShapeReactive } = props;
  const maskCanvasRef = ref();
  const maskContextRef = computed(() => {
    var _a;
    return (_a = maskCanvasRef.value) == null ? void 0 : _a.getContext("2d");
  });
  watchEffect(() => {
    const ctx = maskContextRef.value;
    if (!ctx) {
      return;
    }
    const size2 = sizeRef.value;
    const maskColor = maskColorRef.value;
    ctx.clearRect(0, 0, size2, size2);
    ctx.fillStyle = maskColor;
    ctx.fillRect(0, 0, size2, controlShapeReactive.y);
    ctx.fillRect(0, controlShapeReactive.y, controlShapeReactive.x, controlShapeReactive.height);
    ctx.fillRect(controlShapeReactive.x + controlShapeReactive.width, controlShapeReactive.y, size2 - controlShapeReactive.x - controlShapeReactive.width, controlShapeReactive.height);
    ctx.fillRect(0, controlShapeReactive.y + controlShapeReactive.height, size2, size2 - controlShapeReactive.y - controlShapeReactive.height);
  });
  return { maskCanvasRef };
}
function usePreview(props) {
  const { cropShapeRef, imageScaleRef, previewSizeRef, previewPixelRatioRef, imageRef } = props;
  const previewCanvasRef = ref();
  const previewContextRef = computed(() => {
    var _a;
    return (_a = previewCanvasRef.value) == null ? void 0 : _a.getContext("2d");
  });
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
    const size2 = previewSize * previewPixelRatio;
    ctx.clearRect(0, 0, size2, size2);
    ctx.drawImage(image, cropShape.x / scale, cropShape.y / scale, cropShape.width / scale, cropShape.height / scale, previewShape.x * previewPixelRatio, previewShape.y * previewPixelRatio, previewShape.width * previewPixelRatio, previewShape.height * previewPixelRatio);
  });
  return { previewCanvasRef };
}
const wrapper = "wrapper_JihDV";
const controls = "controls_y3XJZ";
const control = "control_J90Y3";
const n = "n_-8OgP";
const c = "c_6LXEx";
const w = "w_Th9OP";
const e = "e_dQiaQ";
const s = "s_5Egfa";
const size = "size_AeSSY";
const preview = "preview_2B7Cw";
var styles = {
  wrapper,
  controls,
  control,
  n,
  c,
  w,
  e,
  s,
  size,
  preview
};
const ImageCropper = defineComponent({
  props: {
    src: String,
    size: {
      type: Number,
      default: 400
    },
    minSize: {
      type: Number,
      default: 20
    },
    showSize: {
      type: Boolean,
      default: true
    },
    maskColor: {
      type: String,
      default: "#00000032"
    },
    initPadding: {
      type: Number,
      default: 0
    },
    previewTo: Object,
    previewSize: {
      type: Number,
      default: 50
    },
    previewPixelRatio: {
      type: Number,
      default: devicePixelRatio
    }
  },
  setup(props) {
    const sizeRef = toRef(props, "size");
    const minSizeRef = toRef(props, "minSize");
    const maskColorRef = toRef(props, "maskColor");
    const initPaddingRef = toRef(props, "initPadding");
    const previewSizeRef = toRef(props, "previewSize");
    const previewPixelRatioRef = toRef(props, "previewPixelRatio");
    const imageRef = ref();
    const {
      controlShapeReactive,
      cropShapeRef,
      imageScaleRef,
      controls: controls2,
      onContainerDrag
    } = useControls({
      sizeRef,
      minSizeRef,
      initPaddingRef,
      imageRef
    });
    const {
      maskCanvasRef
    } = useMask({
      sizeRef,
      maskColorRef,
      controlShapeReactive
    });
    const {
      previewCanvasRef
    } = usePreview({
      cropShapeRef,
      imageScaleRef,
      imageRef,
      previewSizeRef,
      previewPixelRatioRef
    });
    watchEffect(async () => {
      const src = props.src;
      if (src) {
        imageRef.value = await loadImage(src);
      }
    });
    return () => {
      const {
        size: size2,
        previewPixelRatio,
        previewSize
      } = props;
      const imageShape = imageScaleRef.value;
      const realPreviewSize = previewSize * previewPixelRatio;
      return createVNode("div", {
        "class": styles.wrapper,
        "style": {
          width: `${size2}px`,
          height: `${size2}px`
        },
        "draggable": false
      }, [!!imageRef.value && createVNode(Fragment, null, [createVNode("img", {
        "src": props.src,
        "style": {
          width: `${imageShape.width}px`,
          height: `${imageShape.height}px`
        }
      }, null), createVNode("canvas", {
        "width": size2,
        "height": size2,
        "class": styles.mask,
        "ref": maskCanvasRef
      }, null), createVNode("div", {
        "class": styles.controls,
        "style": {
          transform: `translate(${controlShapeReactive.x}px, ${controlShapeReactive.y}px)`,
          width: `${controlShapeReactive.width}px`,
          height: `${controlShapeReactive.height}px`
        },
        "onMousedown": withModifiers(onContainerDrag, ["stop"])
      }, [!!props.showSize && createVNode("div", {
        "class": styles.size,
        "style": {
          transform: `translateY(${controlShapeReactive.y > 22 ? "-100%" : 0})`
        }
      }, [controlShapeReactive.width, createTextVNode(" x "), controlShapeReactive.height]), controls2.map((item) => createVNode("div", {
        "key": item.directions.join(""),
        "class": [...item.directions.map((d) => styles[d]), styles.control],
        "onMousedown": withModifiers(item.onDrag, ["stop"]),
        "style": {
          cursor: item.cursor
        }
      }, null))])]), !!props.previewTo && createVNode(Teleport, {
        "to": props.previewTo
      }, {
        default: () => [createVNode("canvas", {
          "width": realPreviewSize,
          "height": realPreviewSize,
          "ref": previewCanvasRef,
          "class": styles.preview
        }, null)]
      })]);
    };
  }
});
export { ImageCropper as default };
