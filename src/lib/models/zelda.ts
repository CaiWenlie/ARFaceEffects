import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import { Coords3D } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";
import * as THREE from "three";
import { Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Annotations, getRotation, getScale, ModelLoader } from "../helper";

export function build(loader: GLTFLoader) {
  const zelda = new THREE.Object3D()
  zelda.position.set( 0, 0, 0 )
  loader.load('/models/zelda_-_breath_of_the_wild/scene.gltf', (gltf) => {
    gltf.scene.scale.setScalar(6)
    gltf.scene.position.set(-30, -920, -100)
    zelda.add(gltf.scene)
  })
  return zelda
}

function track(object: Object3D, prediction: AnnotatedPrediction) {
  const annotations: Annotations = (prediction as any).annotations
  const position = annotations.midwayBetweenEyes[0]
  const scale = getScale(prediction.scaledMesh as Coords3D, 234, 454)
  const rotation = getRotation(prediction.scaledMesh as Coords3D, 10, 50, 280)
  object.position.set(...position)
  object.scale.setScalar(scale / 100)
  object.rotation.setFromRotationMatrix(rotation)
  object.rotation.y = -object.rotation.y
  object.rotateZ(Math.PI)
  object.rotateX(- Math.PI * 0.05)
}

const zeldaModel: ModelLoader = {
  build,
  track
}
export default zeldaModel
