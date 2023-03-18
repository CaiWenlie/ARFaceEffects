import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import { Coords3D } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";
import * as THREE from "three";
import { AnimationAction, AnimationMixer, Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Annotations, getRotation, getScale, ModelLoader } from "../helper";

let mixer: AnimationMixer
let action: AnimationAction
export function build(loader: GLTFLoader) {
  const model = new THREE.Object3D()
  model.position.set( 0, 0, 0 )
  loader.load('/models/test.glb', (gltf) => {
    console.log(gltf)
    gltf.scene.scale.setScalar(20)
    gltf.scene.rotateY(Math.PI)
    gltf.scene.rotateX(Math.PI / 2)
    // gltf.scene.position.set(-30, -920, -100)
    model.add(gltf.scene)

    mixer = new THREE.AnimationMixer(gltf.scene)
    ;(window as any).mixer = mixer
    ;(window as any).gltf = gltf
    ;(window as any).actions = []
    gltf.animations.forEach(animationClip => {
      const action = mixer.clipAction(animationClip)
      action.setLoop(THREE.LoopOnce, 1)
      action.clampWhenFinished = true
      ;(window as any).actions.push(action)
    })
    action = mixer.clipAction(gltf.animations[0])
    
})
  return model
}

function track(object: Object3D, prediction: AnnotatedPrediction, clock: THREE.Clock) {
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

  mixer && mixer.update(clock.getDelta())
}

const testModel: ModelLoader = {
  build,
  track
}
export default testModel
