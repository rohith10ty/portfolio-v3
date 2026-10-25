import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

function useSlerp() {
  const group = useRef()

  const [rotationEuler, rotationQuaternion] = useMemo(
    () => [new THREE.Euler(0, 0, 0), new THREE.Quaternion(0, 0, 0, 1)],
    []
  )

  useFrame(({ pointer }) => {
    if (!group.current) return

    const p = pointer || { x: 0, y: 0 }
    // Smooth responsive cursor rotation tilt
    const targetRotX = -p.y * 0.28
    const targetRotY = p.x * 0.32
    rotationEuler.set(targetRotX, targetRotY, 0)
    rotationQuaternion.setFromEuler(rotationEuler)
    group.current.quaternion.slerp(rotationQuaternion, 0.08)

    // Parallax position offset reacting to mouse movement
    group.current.position.x += (p.x * 0.45 - group.current.position.x) * 0.08
    group.current.position.y += (p.y * 0.35 - group.current.position.y) * 0.08
  })

  return group
}

export default useSlerp
