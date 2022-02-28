function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const image = new Image()
    image.onload = () => {
      resolve(image)
    }
    image.src = src
  })
}

export default loadImage
