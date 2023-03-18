export async function getVideoDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices()
  const videoDevices = devices.filter(item => item.kind === 'videoinput')
  return videoDevices
}

export async function getVideoStream(deviceId: string, width?: number, height?: number) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId, width, height }
    })
    return stream
  } catch (error) {
    return Promise.reject(error)
  }
}

export function setVideoElement(video: HTMLVideoElement) {
  (video.srcObject as MediaStream)?.getTracks().forEach((track) => {
    track.stop()
  })
  // video.style.display = 'none'
  video.autoplay = true
  video.playsInline = true
}

export function initCamera(video: HTMLVideoElement, w?: number, h?: number, ) {
  return new Promise(async resolve => {
    const cameraDevices = await getVideoDevices()
    if (cameraDevices.length) {
      const stream = await getVideoStream(cameraDevices[0].deviceId, w, h)
      setVideoElement(video)
      video.onloadeddata = resolve
      video.srcObject = stream
    }
  }) 
}