import { AnnotatedPrediction } from '@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh'
import { Coords3D } from '@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util'
import * as THREE from 'three'
import { Object3D, Vector3 } from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { getRotation, getScale, Annotations, ModelLoader } from '../helper'

function buildGlasses(loader: GLTFLoader) {
  const glasses = new THREE.Object3D()
  glasses.position.set( 0, 0, 0 )

  // add frame glb.
  loader.load('/models/stereo-glasses.glb', (glassesObj) => {
    glassesObj.scene.scale.set(1.1, 1.1, -1.1)
    glassesObj.scene.position.set(0, 0, 0)
    glasses.add(glassesObj.scene)
  })

  // add left lens.
  const leftLens = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.25, 32),
    new THREE.MeshStandardMaterial({
      color: 0xFFC828,
      // side: THREE.BackSide,
      transparent: true,
      opacity: 0.5,
      roughness: 0.25,
    })
  )
  leftLens.position.copy(new Vector3(-0.3, -0.01, 0))
  glasses.add(leftLens)
  // add right lens.
  const rightLens = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.25, 32),
    new THREE.MeshStandardMaterial({
      color: 0xAD50FF,
      // side: THREE.BackSide,
      transparent: true,
      opacity: 0.5,
      roughness: 0.25,
    })
  )
  rightLens.position.copy(new Vector3(0.3, -0.01, 0))
  glasses.add(rightLens)

  return glasses
}

function trackGlasses(glasses: Object3D, prediction: AnnotatedPrediction) {
  const annotations: Annotations = (prediction as any).annotations
  const position = annotations.midwayBetweenEyes[0]
  const scale = getScale(prediction.scaledMesh as Coords3D, 234, 454)
  const rotation = getRotation(prediction.scaledMesh as Coords3D, 10, 50, 280)
  glasses.position.set(...position)
  glasses.scale.setScalar(scale)
  glasses.rotation.setFromRotationMatrix(rotation)
  glasses.rotation.y = -glasses.rotation.y
  glasses.rotateZ(Math.PI)
  glasses.rotateX(- Math.PI * 0.05)
}

const glassesModel: ModelLoader = {
  build: buildGlasses,
  track: trackGlasses
}
export default glassesModel
