import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import { Coords3D } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";
import { TFace } from "kalidokit";
import * as THREE from "three";
import { Box3, Object3D, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Annotations, findMorphTarget, getRotation, getScale, ModelLoader } from "../helper";

let morphTarget: ReturnType<typeof findMorphTarget>
export function build(loader: GLTFLoader) {
  const model = new THREE.Object3D()
  model.position.set( 0, 0, 0 )
  loader.load('/models/animal_head/giraffe.glb', (gltf) => {
    console.log(gltf)
    const object = gltf.scene
    const box = new Box3().setFromObject(object)
    const size = box.getSize(new Vector3()).length()
    const center = box.getCenter(new Vector3())
    object.position.x += (object.position.x - center.x);
    object.position.y += (object.position.y - center.y + 5);
    object.position.z += (object.position.z - center.z - 15);
    ;(window as any).gltf = gltf
    model.add(object)

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
  object.scale.setScalar(scale / 20)
  object.scale.x *= -1
  object.rotation.setFromRotationMatrix(rotation)
  object.rotation.y = -object.rotation.y
  object.rotateZ(Math.PI)
  object.rotateX(- Math.PI * 0.05)

  if (morphTarget) {
    // flipped
    morphTarget['leftEye'] && morphTarget['leftEye'](1 - faceRig.eye.r)
    morphTarget['rightEye'] && morphTarget['rightEye'](1 - faceRig.eye.l)
    morphTarget['mouth'] && morphTarget['mouth'](faceRig.mouth.shape.A)
    morphTarget['tongue'] && morphTarget['tongue'](faceRig.mouth.shape.A)
  }

}

const testModel: ModelLoader = {
  build,
  track
}
export default testModel
