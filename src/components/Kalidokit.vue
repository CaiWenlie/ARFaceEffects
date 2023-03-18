<template>
  <video id="video" width="1" height="1"></video>
  <canvas id="canvas"></canvas>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue"
import * as Kalidokit from "kalidokit"
import { positionBufferData } from '../lib/positionBufferData';
import { XYZ } from "kalidokit";

const facelandmarkArray = positionBufferData.map((item, index, array) => {
  if (index % 3 === 0) {
    return {
      x: item,
      y: array[index + 1],
      z: array[index + 2]
    }
  }
}).filter(Boolean) as any as XYZ[]

export default defineComponent({
  setup() {
    onMounted(() => {
      Kalidokit.Face.solve(facelandmarkArray, {
        runtime: "tfjs", // `mediapipe` or `tfjs`
        video: '#video',
        imageSize: { height: 0, width: 0 },
        smoothBlink: false, // smooth left and right eye blink delays
        blinkSettings: [0.25, 0.75], // adjust upper and lower bound blink sensitivity
      })
    })
  }
})
</script>
