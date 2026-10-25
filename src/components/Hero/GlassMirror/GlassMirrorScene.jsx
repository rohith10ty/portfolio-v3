import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Box, Octahedron, useMatcapTexture } from '@react-three/drei'

import useSlerp from './use-slerp'
import useLayers from './use-layers'
import useRenderTarget from './use-render-target'

import { ThinFilmFresnelMap } from './ThinFilmFresnelMap'
import { mirrorsData } from './data'

const OUTFIT_FONT_URL = '/fonts/Outfit-Bold.ttf'

function Title({ layers, text = 'ROHITH NAIDU', fontSize = 2.0, ...props }) {
  const group = useRef()
  useEffect(() => {
    if (group.current) {
      group.current.lookAt(0, 0, 0)
    }
  }, [])

  const textRef = useLayers(layers)

  return (
    <group {...props} ref={group}>
      <Text
        ref={textRef}
        name="text-name"
        depthTest={false}
        material-toneMapped={false}
        material-color="#FFFFFF"
        font={OUTFIT_FONT_URL}
        fontSize={fontSize}
        letterSpacing={0.06}
        textAlign="center"
      >
        {text}
      </Text>
    </group>
  )
}

function Mirror({ sideMaterial, reflectionMaterial, args, layers, ...props }) {
  const ref = useLayers(layers)

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001
      ref.current.rotation.z += 0.008
    }
  })

  return (
    <Box
      {...props}
      ref={ref}
      args={args}
      material={[
        sideMaterial,
        sideMaterial,
        sideMaterial,
        sideMaterial,
        reflectionMaterial,
        reflectionMaterial
      ]}
    />
  )
}

function Mirrors({ envMap, layers, scale = 1 }) {
  const [thinFilmFresnelMap] = useState(() => new ThinFilmFresnelMap())

  const sideMaterial = useMemo(
    () => new THREE.MeshLambertMaterial({ map: thinFilmFresnelMap, color: '#AAAAAA' }),
    [thinFilmFresnelMap]
  )

  const reflectionMaterial = useMemo(
    () =>
      new THREE.MeshLambertMaterial({
        map: thinFilmFresnelMap,
        envMap: envMap,
        color: '#FFFFFF'
      }),
    [thinFilmFresnelMap, envMap]
  )

  return (
    <group name="mirrors" scale={scale}>
      {mirrorsData.mirrors.map((mirror, index) => (
        <Mirror
          key={`mirror-${index}`}
          layers={layers}
          {...mirror}
          name={`mirror-${index}`}
          sideMaterial={sideMaterial}
          reflectionMaterial={reflectionMaterial}
        />
      ))}
    </group>
  )
}

function TitleCopies({ layers, text = 'ROHITH NAIDU' }) {
  const vertices = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(10)
    const pos = geo.attributes.position
    const verts = []
    for (let i = 0; i < pos.count; i++) {
      verts.push([pos.getX(i), pos.getY(i), pos.getZ(i)])
    }
    return verts
  }, [])

  return (
    <group name="titleCopies">
      {vertices.map((vertex, i) => (
        <Title
          key={'titleCopy-' + i}
          name={'titleCopy-' + i}
          text={text}
          position={vertex}
          layers={layers}
        />
      ))}
    </group>
  )
}

export default function GlassMirrorScene({ customName = 'ROHITH NAIDU' }) {
  const [cubeCamera, renderTarget] = useRenderTarget()
  const group = useSlerp()
  const { viewport } = useThree()

  const [matcapTexture] = useMatcapTexture('C8D1DC_575B62_818892_6E747B')

  const mirrorScale = useMemo(() => {
    if (viewport.width < 4.5) return 0.65
    if (viewport.width < 7.5) return 0.85
    return 1.0
  }, [viewport.width])

  return (
    <group name="sceneContainer" ref={group}>
      {/* Background Octahedron for internal mirror reflections */}
      <Octahedron layers={[11]} name="background" args={[20, 4, 4]} position={[0, 0, -5]}>
        <meshMatcapMaterial
          matcap={matcapTexture}
          side={THREE.BackSide}
          transparent
          opacity={0.3}
          color="#FFFFFF"
        />
      </Octahedron>

      {/* CubeCamera capturing 3D text reflections */}
      <cubeCamera
        layers={[11]}
        name="cubeCamera"
        ref={cubeCamera}
        args={[0.1, 100, renderTarget]}
        position={[0, 0, 5]}
      />

      {/* 3D Reflection Copies of Name around icosahedron for CubeCamera */}
      <TitleCopies layers={[11]} text={customName} />

      {/* Floating Reflective Glass Mirrors with original ThinFilmFresnel reflections */}
      <Mirrors layers={[0, 11]} envMap={renderTarget.texture} scale={mirrorScale} />
    </group>
  )
}
