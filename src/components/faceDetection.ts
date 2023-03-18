import controls from '@mediapipe/control_utils'
import drawingUtils from '@mediapipe/drawing_utils'
import mpFaceDetection, { Results } from '@mediapipe/face_detection'

export default function init() {

  const config = {locateFile: (file: string) => {
    // https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4/${file}
    return `/face_detection/${file}`
  }};
  
  // Our input frames will come from here.
  const videoElement =
      document.getElementsByClassName('input_video')[0] as HTMLVideoElement;
  const canvasElement =
      document.getElementsByClassName('output_canvas')[0] as HTMLCanvasElement;
  const controlsElement =
      document.getElementsByClassName('control-panel')[0] as HTMLDivElement;
  const canvasCtx = canvasElement.getContext('2d')!;
  
  // We'll add this to our control panel later, but we'll save it here so we can
  // call tick() each time the graph runs.
  const fpsControl = new controls.FPS();
  
  // Optimization: Turn off animated spinner after its hiding animation is done.
  const spinner = document.querySelector('.loading')! as HTMLDivElement;
  spinner.ontransitionend = () => {
    spinner.style.display = 'none';
  };
  
  function onResults(results: mpFaceDetection.Results): void {
    // Hide the spinner.
    document.body.classList.add('loaded');
  
    // Update the frame rate.
    fpsControl.tick();
  
    // Draw the overlays.
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.detections.length > 0) {
      drawingUtils.drawRectangle(
          canvasCtx, results.detections[0].boundingBox,
          {color: 'blue', lineWidth: 4, fillColor: '#00000000'});
      drawingUtils.drawLandmarks(canvasCtx, results.detections[0].landmarks, {
        color: 'red',
        radius: 5,
      });
    }
    canvasCtx.restore();
  }
  
  const faceDetection = new mpFaceDetection.FaceDetection(config);
  faceDetection.onResults(onResults);
  
  // Present a control panel through which the user can manipulate the solution
  // options.
  new controls
      .ControlPanel(controlsElement, {
        selfieMode: true,
        model: 'short',
        minDetectionConfidence: 0.5,
      })
      .add([
        new controls.StaticText({title: 'MediaPipe Face Detection'}),
        fpsControl,
        new controls.Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
        new controls.SourcePicker({
          onSourceChanged: () => {
            faceDetection.reset();
          },
          onFrame:
              async (input: controls.InputImage, size: controls.Rectangle) => {
                const aspect = size.height / size.width;
                let width: number, height: number;
                if (window.innerWidth > window.innerHeight) {
                  height = window.innerHeight;
                  width = height / aspect;
                } else {
                  width = window.innerWidth;
                  height = width * aspect;
                }
                canvasElement.width = width;
                canvasElement.height = height;
                await faceDetection.send({image: input});
              },
          examples: {
            images: [],
            videos: [],
          },
        }),
        new controls.Slider({
          title: 'Model Selection',
          field: 'model',
          discrete: {'short': 'Short-Range', 'full': 'Full-Range'},
        }),
        new controls.Slider({
          title: 'Min Detection Confidence',
          field: 'minDetectionConfidence',
          range: [0, 1],
          step: 0.01
        }),
      ])
      .on(x => {
        const options = x as mpFaceDetection.Options;
        videoElement.classList.toggle('selfie', options.selfieMode);
        faceDetection.setOptions(options);
      });
}