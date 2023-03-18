import { FACEMESH_FACE_OVAL, NormalizedLandmarkList } from "@mediapipe/face_mesh";
import { Coords3D } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";

export function readFaceOval(landmarks: NormalizedLandmarkList) {
  return FACEMESH_FACE_OVAL.map(item => landmarks[item[0]])
}
