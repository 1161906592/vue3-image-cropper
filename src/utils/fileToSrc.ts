function fileToSrc(file: File) {
  return new Promise<string>((resolve) => {
    const fr = new FileReader()
    fr.onload = () => {
      resolve(fr.result as string)
    }
    fr.readAsDataURL(file)
  })
}

export default fileToSrc
