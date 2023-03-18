<template>
  <div class="container">
    <video class="input_video"></video>
    <div class="canvas-container">
    <canvas class="output_canvas" width="1280px" height="720px">
    </canvas>
    </div>
    <div class="loading">
      <div class="spinner"></div>
      <div class="message">
        Loading
      </div>
    </div>
    <a class="abs logo" href="http://www.mediapipe.dev" target="_blank">
      <div style="display: flex;align-items: center;bottom: 0;right: 10px;">
        <span class="title">MediaPipe</span>
      </div>
    </a>
    <div class="shoutout">
      <div>
        <a href="https://solutions.mediapipe.dev/face_mesh">
          Click here for more info
        </a>
      </div>
    </div>
  </div>
  <div class="control-panel">
  </div>
  <img id="img" src="/textures/facepaint.png" alt="">
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import init from './faceMesh'

export default defineComponent({
  name: 'FaceMesh',
  setup() {
    onMounted(() => {
      init()
    })
  }
})
</script>
<style lang="scss" scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.abs {
  position: absolute;
}

a {
  color: white;
  text-decoration: none;
  &:hover {
    color: lightblue;
  }
}

body {
  bottom: 0;
  font-family: 'Titillium Web', sans-serif;
  color: white;
  left: 0;
  margin: 0;
  position: absolute;
  right: 0;
  top: 0;
  transform-origin: 0px 0px;
  overflow: hidden;
}

.container {
  position: absolute;
  background-color: #596e73;
  width: 100%;
  max-height: 100%;
}

.input_video {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  &.selfie {
    transform: scale(-1, 1);
  }
}

.input_image {
  position: absolute;
}

.canvas-container {
  display:flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items:center;
}

.output_canvas {
  max-width: 100%;
  display: block;
  position: relative;
  left: 0;
  top: 0;
}

.logo {
  bottom: 10px;
  right: 20px;

  .title {
    color: white;
    font-size: 28px;
  }

  .subtitle {
    position: relative;
    color: white;
    font-size: 10px;
    left: -30px;
    top: 20px;
  }
}

.control-panel {
  position: absolute;
  left: 10px;
  top: 10px;
}

.loading {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  backface-visibility: hidden;
  justify-content: center;
  opacity: 1;
  transition: opacity 1s;

  .message {
    font-size: x-large;
  }

  .spinner {
    position: absolute;
    width: 120px;
    height: 120px;
    animation: spin 1s linear infinite;
    border: 32px solid #bebebe;
    border-top: 32px solid #3498db;
    border-radius: 50%;
  }
}

.loaded .loading {
  opacity: 0;
}

.shoutout {
  left: 0;
  right: 0;
  bottom: 40px;
  text-align: center;
  font-size: 24px;
  position: absolute;
}
</style>