function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      resolve(image)
    }
    image.src = src
  })
}

export default loadImage
