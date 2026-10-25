import { useEffect, useRef } from 'react'

function useLayers(layers = [0]) {
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return

    const applyLayers = (obj) => {
      if (!obj || !obj.layers) return
      obj.layers.disableAll()
      layers.forEach((layer) => {
        obj.layers.enable(layer)
      })
      if (obj.children) {
        obj.children.forEach(applyLayers)
      }
    }

    applyLayers(ref.current)
  }, [layers])

  return ref
}

export default useLayers
