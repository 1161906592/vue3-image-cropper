function listToMap<T>(options: T[], key: keyof T) {
  let map: Map<T[typeof key], T>
  let index = 0
  const lastIndex = options.length - 1
  return {
    get(value: T[typeof key]) {
      if (!map) {
        map = new Map()
      }
      const result = map.get(value)
      if (!result && index !== lastIndex) {
        while (index <= lastIndex) {
          const cur = options[index]
          map.set(cur[key], cur)
          if (cur[key] === value) {
            return cur
          }
          index += 1
        }
      }
      return result
    },
  }
}

export default listToMap
