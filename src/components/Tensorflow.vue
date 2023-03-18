<template>
  <div class="info">
    <div>background
      <select v-model="background">
        <option>camera</option>
        <option>white</option>
        <option>gray</option>
      </select>
    </div>
    <div>face {{ faceOn ? 'on' : 'detecting...' }}</div>
  </div>
  <canvas id="canvas" :class="'bg-' + background"></canvas>
  <video id="video" width="1" height="1"></video>
  <canvas id="coords"></canvas>
  <gallery :autoSelectFirst="true" @change="onSelectModel" />
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as tf from '@tensorflow/tfjs-core'
import '@mediapipe/face_mesh'
import '@tensorflow/tfjs-backend-webgl'
// import { setWasmPaths, getThreadsCount, setThreadsCount } from '@tensorflow/tfjs-backend-wasm'
import { MediaPipeFaceMesh } from '@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh'
import { initCamera } from '../lib/camera'
import { init3D } from '../lib/three'
// import { drawCoords, initCanvas } from './coords'
import Gallery from './Gallery.vue'
import { drawResults, ModelData } from '../lib/helper'

// setWasmPaths('/tfjs-backend-wasm/')
// setThreadsCount(2)
export default defineComponent({
  components: { Gallery },
  setup() {
    const faceOn = ref(false)
    const background = ref('gray')

    let selectedModel: ModelData | null = null
    const onSelectModel = ref((item: ModelData) => {
      selectedModel = item
    })

    async function main() {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement
      const video = document.getElementById('video') as HTMLVideoElement

      const coords = document.getElementById('coords') as HTMLCanvasElement
      const coordsCtx = coords.getContext('2d')!
      // initCanvas(coords)
      
      await tf.setBackend('webgl')
      // await tf.setBackend('wasm')
      // console.log('getThreadsCount', getThreadsCount())
      await initCamera(video)
      
      const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
        {
          shouldLoadIrisModel: true,
          maxFaces: 1,
          modelUrl: '/tfjs/facemesh/model.json',
          detectorModelUrl: '/tfjs/blazeface/model.json',
          irisModelUrl: '/tfjs/iris/model.json'
        }
      )
      
      const [render3D, resize, addModel] = init3D(canvas, video)
      coords.width = video.videoWidth
      coords.height = video.videoHeight

      onSelectModel.value = addModel
      if (selectedModel) {
        addModel(selectedModel)
        selectedModel = null
      }

      async function render(model: MediaPipeFaceMesh) {
        const predictions = await model.estimateFaces({
          input: video,
          predictIrises: true,
          // flipHorizontal: true
        })
        faceOn.value = predictions.length > 0

        if (predictions.length > 0) {
          // console.log(predictions[0])
          // const coords = (predictions[0] as any).scaledMesh
          // const annotations = (predictions[0] as any).annotations
          // const coords = [...annotations.midwayBetweenEyes, ...annotations.leftCheek, ...annotations.rightCheek]
          // const coords = annotations.midwayBetweenEyes
          
          // drawCoords(coordsCtx, coords, video.videoWidth, video.videoHeight)
        }

        render3D(predictions[0], { background: background.value === 'camera' })

        drawResults(coordsCtx, predictions, true, false)

        requestAnimationFrame(() => {
          render(model)
        })
      }

      resize()
      render(model)

      window.onresize = resize
    }

    onMounted(main)
    
    onUnmounted(() => {
      window.onresize = null
    })

    return {
      faceOn,
      background,
      onSelectModel
    }
  }
})
</script>
<style scoped>
#canvas {
  position: absolute;
  top: 0;
  left: 170px;
  right: 0;
  bottom: 0;
  z-index: 1;
  /* transform: scaleX(-1); */
  width: calc(100% - 170px);
  height: 100%;
}
#video, #coords {
  z-index: 1;
  /* display: none; */
  /* object-fit: fill; */
  object-fit: contain;
  position: absolute;
  top: 0;
  right: 0;
  width: 160px;
  height: 120px;
  z-index: 2;
  transform: scaleX(-1);
}
.info {
  position: absolute;
  z-index: 10;
  left: 180px;
  top: 0;
  text-align: left;
}
select {
  vertical-align: middle;
  outline: none;
}
.bg-gray{
  background-color: #8e8e8e;
}
</style>