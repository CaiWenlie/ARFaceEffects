import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import { Coords3D } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";
import { TFace } from "kalidokit";
import * as THREE from "three";
import { AnimationAction, AnimationMixer, Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Annotations, findMorphTarget, getRotation, getScale, ModelLoader } from "../helper";

// let mixer: AnimationMixer
// let actions: AnimationAction[]
// const duration = 0.2
let morphTarget: ReturnType<typeof findMorphTarget>
export function build(loader: GLTFLoader) {
  const model = new THREE.Object3D()
  model.position.set( 0, 0, 0 )
  loader.load('/models/bingdundun/bingdundun.glb', (gltf) => {
    console.log(gltf)
    gltf.scene.scale.setScalar(300)
    gltf.scene.position.set(0, -150, -50)
    model.add(gltf.scene)

    // mixer = new THREE.AnimationMixer(gltf.scene)
    // ;(window as any).mixer = mixer
    ;(window as any).gltf = gltf
    // ;(window as any).actions = actions = []
    // gltf.animations.forEach(animationClip => {
    //   const action = mixer.clipAction(animationClip).play()
    //   action.setLoop(THREE.LoopOnce, 1)
    //   action.clampWhenFinished = true
    //   action.setDuration(duration)
    //   actions.push(action)
    // })
    morphTarget = findMorphTarget(gltf.scene)
})
  return model
}

function track(object: Object3D, prediction: AnnotatedPrediction, clock: THREE.Clock, faceRig: TFace) {
  const annotations: Annotations = (prediction as any).annotations
  const position = annotations.midwayBetweenEyes[0]
  const scale = getScale(prediction.scaledMesh as Coords3D, 234, 454)
  const rotation = getRotation(prediction.scaledMesh as Coords3D, 10, 50, 280)
  object.position.set(...position)
  object.scale.setScalar(scale / 100)
  object.scale.x *= -1
  object.rotation.setFromRotationMatrix(rotation)
  object.rotation.y = -object.rotation.y
  object.rotateZ(Math.PI)
  object.rotateX(- Math.PI * 0.05)

  
  // if (actions) {
  //   // flipped
  //   const l = faceRig.eye.l
  //   const r = faceRig.eye.r
  //   actions[0].time = (1 - r) * duration * actions[0].timeScale
  //   actions[1].time = (1 - l) * duration * actions[1].timeScale
  // }

  // mixer && mixer.update(clock.getDelta())
  if (morphTarget) {
    // flipped
    morphTarget['leftEye'] && morphTarget['leftEye'](1 - faceRig.eye.r)
    morphTarget['rightEye'] && morphTarget['rightEye'](1 - faceRig.eye.l)
    morphTarget['mouth'] && morphTarget['mouth'](faceRig.mouth.shape.A)
  }

}

const testModel: ModelLoader = {
  build,
  track
}
export default testModel
