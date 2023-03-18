import * as THREE from "three"
import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import { Coord2D, Coord3D, Coords3D } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";
import { Clock, Material, Mesh, Object3D, Points, TextureLoader, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as Kalidokit from "kalidokit"
import { TFace } from "kalidokit";
import { TRIANGULATION } from "./triangulation";

export function getScale(coords: Coords3D, id0 = 0, id1 = 1) {
  const v1 = new Vector3(...coords[id0])
  const v2 = new Vector3(...coords[id1])
  return v1.distanceTo(v2)
}

export function getRotation(coords: Coords3D, top = 0, left = 1, right = 2) {
  const p0 = new THREE.Vector3(...coords[top])
  const p1 = new THREE.Vector3(...coords[left])
  const p2 = new THREE.Vector3(...coords[right])
  const matrix = new THREE.Matrix4()
  const x = p1.clone().sub(p2).normalize()
  const y = p1.clone().add(p2).multiplyScalar(0.5).sub(p0).multiplyScalar(-1).normalize()
  const z = new THREE.Vector3().crossVectors(x, y).normalize()
  matrix.makeBasis(x, y, z)
  return matrix.invert()
}

export interface Annotations {
  [key: string]: Coords3D
}

export interface ModelLoader {
  build(loader: GLTFLoader): Object3D
  track(object: Object3D, prediction: AnnotatedPrediction, clock?: Clock, faceRig?: TFace): void
}

export interface ModelData {
  name: string
  thumb?: string
  thumbBg?: string
  type: 'model' | 'texture'
  loader?: ModelLoader
  texture?: (textureLoader: TextureLoader) => Material
  path?: string
}

export function toXYZ(landmarks: number[]) {
  return landmarks.map((item, index, array) => {
    if (index % 3 === 0) {
      return {
        x: item,
        y: array[index + 1],
        z: array[index + 2]
      }
    }
  }).filter(Boolean) as { x: number, y: number, z: number }[]
}

export function coordsToXYZ(coords: Coords3D) {
  return coords.map(item => ({
    x: item[0],
    y: item[1],
    z: item[2]
  }))
}

export function getFaceRig(prediction: AnnotatedPrediction, video: HTMLVideoElement) {
  const faceRig = Kalidokit.Face.solve(coordsToXYZ(prediction.scaledMesh as Coords3D), {
    runtime: "tfjs", // `mediapipe` or `tfjs`
    video,
    imageSize: { height: 480, width: 640 },
    smoothBlink: false, // smooth left and right eye blink delays
    blinkSettings: [0.25, 0.75], // adjust upper and lower bound blink sensitivity
  })
  // console.log(faceRig)
  return faceRig
}

export function stabilize(prediction: AnnotatedPrediction, lastPrediction: AnnotatedPrediction, fraction = 0.8): AnnotatedPrediction {
  const scaledMesh = (prediction.scaledMesh as Coords3D).map((coord, index) => {
    const lastCoord = (lastPrediction.scaledMesh as Coords3D)[index]
    return lerp(lastCoord, coord)
  }) as any

  const annotations: Annotations = (prediction as any).annotations
  const lastAnnotations: Annotations = (lastPrediction as any).annotations
  Object.keys(annotations).forEach(key => {
    annotations[key] = annotations[key].map((coord, index) => {
      const lastCoord = lastAnnotations[key][index]
      return lerp(lastCoord, coord)
    }) as any
  })

  function lerp(coord1: Coord3D, coord2: Coord3D): Coord3D {
    const v1 = new Vector3(...coord1)
    const v2 = new Vector3(...coord2)
    const { x, y, z } = v1.lerp(v2, fraction)
    return [x, y, z]
  }

  return {
    ...prediction,
    scaledMesh
  }
}

export function findMorphTarget(nodes: THREE.Object3D): Record<string, (value: number) => void> {
  const morphTarget = {} as Record<string, (value: number) => void>
  const traverse = (node: THREE.Object3D) => {
    if (node.type === 'Mesh' && (node as Mesh).morphTargetInfluences) {
      const mesh = node as Mesh
      Object.keys(mesh.morphTargetDictionary!).forEach(key => {
        morphTarget[key] = (value: number) => {
          mesh.morphTargetInfluences![mesh.morphTargetDictionary![key]] = value
        }
      })
    }
    node.children.forEach(traverse)
  }
  traverse(nodes)
  return morphTarget
}

function distance(a: Coord3D, b: Coord3D) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function drawPath(ctx: CanvasRenderingContext2D, points: number[][], closePath: boolean) {
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.stroke(region);
}

/**
 * Draw the keypoints on the video.
 * @param ctx 2D rendering context.
 * @param faces A list of faces to render.
 * @param triangulateMesh Whether or not to display the triangle mesh.
 * @param boundingBox Whether or not to display the bounding box.
 */
export function drawResults(ctx: CanvasRenderingContext2D, faces: AnnotatedPrediction[], triangulateMesh: boolean, boundingBox: boolean) {
  const NUM_KEYPOINTS = 468
  const NUM_IRIS_KEYPOINTS = 5

  ctx.clearRect(0, 0, 1000, 1000)
  faces.forEach((face) => {
    const keypoints = face.scaledMesh as Coords3D

    if (boundingBox) {
      ctx.strokeStyle = '#FF2C35';
      ctx.lineWidth = 1;

      const box = face.boundingBox as {
        topLeft: Coord2D;
        bottomRight: Coord2D;
      }
      drawPath(
          ctx,
          [
            [box.topLeft[0], box.topLeft[1]], [box.bottomRight[0], box.topLeft[1]], [box.bottomRight[0], box.bottomRight[1]],
            [box.topLeft[0], box.bottomRight[1]]
          ],
          true);
    }

    if (triangulateMesh) {
      ctx.strokeStyle = '#32EEDB';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < TRIANGULATION.length / 3; i++) {
        const points = [
          TRIANGULATION[i * 3],
          TRIANGULATION[i * 3 + 1],
          TRIANGULATION[i * 3 + 2],
        ].map((index) => keypoints[index]);

        drawPath(ctx, points, true);
      }
    } else {
      ctx.fillStyle = '#32EEDB';

      for (let i = 0; i < NUM_KEYPOINTS; i++) {
        const x = keypoints[i][0];
        const y = keypoints[i][1];

        ctx.beginPath();
        ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    if (keypoints.length > NUM_KEYPOINTS) {
      ctx.strokeStyle = '#FF2C35';
      ctx.lineWidth = 1;

      const leftCenter = keypoints[NUM_KEYPOINTS];
      const leftDiameterY =
          distance(keypoints[NUM_KEYPOINTS + 4], keypoints[NUM_KEYPOINTS + 2]);
      const leftDiameterX =
          distance(keypoints[NUM_KEYPOINTS + 3], keypoints[NUM_KEYPOINTS + 1]);

      ctx.beginPath();
      ctx.ellipse(
          leftCenter[0], leftCenter[1], leftDiameterX / 2, leftDiameterY / 2, 0,
          0, 2 * Math.PI);
      ctx.stroke();

      if (keypoints.length > NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS) {
        const rightCenter = keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS];
        const rightDiameterY = distance(
            keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 2],
            keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 4]);
        const rightDiameterX = distance(
            keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 3],
            keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 1]);

        ctx.beginPath();
        ctx.ellipse(
            rightCenter[0], rightCenter[1], rightDiameterX / 2,
            rightDiameterY / 2, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  });
}