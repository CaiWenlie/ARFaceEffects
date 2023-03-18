import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import { Coords3D } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";

export function initCanvas(canvas: HTMLCanvasElement) {
  const w = window.innerWidth
  const h = window.innerHeight
  const ratio = window.devicePixelRatio
  canvas.width = w * ratio
  canvas.height = h * ratio
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  canvas.style.transform = 'scale(-2, 2)'
}

export function drawCoords(ctx: CanvasRenderingContext2D, coords: Coords3D, vw: number, vh: number) {
  const w = window.innerWidth
  const h = window.innerHeight
  const scale = window.devicePixelRatio
  const offsetX = (vw - w) / 2
  const offsetY = (vh - h) / 2
  ctx.clearRect(0, 0, w * scale, h * scale)
  ctx.font = '10px serif'
  coords.forEach((item, index) => {
    ctx.fillText(String(index), (item[0] - offsetX) * scale, (item[1] - offsetY) * scale)
  })
}
