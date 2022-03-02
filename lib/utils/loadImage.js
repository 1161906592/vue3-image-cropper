"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loadImage(src) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
            resolve(image);
        };
        image.src = src;
    });
}
exports.default = loadImage;
