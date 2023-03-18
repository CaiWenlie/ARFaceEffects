import controls from '@mediapipe/control_utils'
import drawingUtils from '@mediapipe/drawing_utils'
import mpFaceMesh, { Results } from '@mediapipe/face_mesh'
import { CV, Mat } from 'mirada';
import { readFaceOval } from './helper';
const cv = (window as any).cv as CV
export default function init() {

  const config = {locateFile: (file: string) => {
    // https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}
    return `/face_mesh/${file}`
  }};

  // Our input frames will come from here.
  const videoElement =
      document.getElementsByClassName('input_video')[0] as HTMLVideoElement;
  const canvasElement =
      document.getElementsByClassName('output_canvas')[0] as HTMLCanvasElement;
  const controlsElement =
      document.getElementsByClassName('control-panel')[0] as HTMLDivElement;
  const canvasCtx = canvasElement.getContext('2d')!;

  /**
   * Solution options.
   */
  const solutionOptions = {
    selfieMode: true,
    enableFaceGeometry: true,
    maxNumFaces: 1,
    refineLandmarks: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  };

  // We'll add this to our control panel later, but we'll save it here so we can
  // call tick() each time the graph runs.
  const fpsControl = new controls.FPS();

  // Optimization: Turn off animated spinner after its hiding animation is done.
  const spinner = document.querySelector('.loading')! as HTMLDivElement;
  spinner.ontransitionend = () => {
    spinner.style.display = 'none';
  };

  function onResults(results: Results): void {
    // Hide the spinner.
    document.body.classList.add('loaded');

    // Update the frame rate.
    fpsControl.tick();

    // Draw the overlays.
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        // const faceOval = readFaceOval(landmarks)
        // const cvpoints = ([] as number[]).concat(...faceOval.map(item => [item.x, item.y]))
        // const contours = cv.matFromArray(results.image.height, results.image.width, cv.CV_32SC2, cvpoints)
        // const img = cv.imread(document.getElementById('img')!)
        // const result = new Mat()
        // debugger
        // cv.fillConvexPoly(img, result, contours, 255)
        // const mat = new cv.Mat()
        // cv.convexHull()
        // cv.convexHull(landmarks.map(item => [item.x, item.y])
        // cv.fillConvexPoly(null as any, landmarks, 255)
        drawingUtils.drawConnectors(
            canvasCtx, landmarks, mpFaceMesh.FACEMESH_TESSELATION,
            {color: '#C0C0C070', lineWidth: 1});
        drawingUtils.drawConnectors(
            canvasCtx, landmarks, mpFaceMesh.FACEMESH_RIGHT_EYE,
            {color: '#FF3030'});
        drawingUtils.drawConnectors(
            canvasCtx, landmarks, mpFaceMesh.FACEMESH_RIGHT_EYEBROW,
            {color: '#FF3030'});
        drawingUtils.drawConnectors(
            canvasCtx, landmarks, mpFaceMesh.FACEMESH_LEFT_EYE,
            {color: '#30FF30'});
        drawingUtils.drawConnectors(
            canvasCtx, landmarks, mpFaceMesh.FACEMESH_LEFT_EYEBROW,
            {color: '#30FF30'});
        drawingUtils.drawConnectors(
            canvasCtx, landmarks, mpFaceMesh.FACEMESH_FACE_OVAL,
            {color: '#E0E0E0'});
        drawingUtils.drawConnectors(
            canvasCtx, landmarks, mpFaceMesh.FACEMESH_LIPS, {color: '#E0E0E0'});
            if (solutionOptions.refineLandmarks) {
        drawingUtils.drawConnectors(
            canvasCtx, landmarks, mpFaceMesh.FACEMESH_RIGHT_IRIS,
            {color: '#FF3030'});
        drawingUtils.drawConnectors(
            canvasCtx, landmarks, mpFaceMesh.FACEMESH_LEFT_IRIS,
            {color: '#30FF30'});
        }
      }
    }
    canvasCtx.restore();
  }

  const faceMesh = new mpFaceMesh.FaceMesh(config);
  faceMesh.setOptions(solutionOptions);
  faceMesh.onResults(onResults);

  // Present a control panel through which the user can manipulate the solution
  // options.
  new controls
      .ControlPanel(controlsElement, solutionOptions)
      .add([
        new controls.StaticText({title: 'MediaPipe Face Mesh'}),
        fpsControl,
        new controls.Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
        new controls.SourcePicker({
          onFrame:
              async (input: any, size: any) => {
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
                await faceMesh.send({image: input});
              },
        }),
        new controls.Slider({
          title: 'Max Number of Faces',
          field: 'maxNumFaces',
          range: [1, 4],
          step: 1
        }),
        new controls.Toggle(
          {title: 'Refine Landmarks', field: 'refineLandmarks'}),
        new controls.Slider({
          title: 'Min Detection Confidence',
          field: 'minDetectionConfidence',
          range: [0, 1],
          step: 0.01
        }),
        new controls.Slider({
          title: 'Min Tracking Confidence',
          field: 'minTrackingConfidence',
          range: [0, 1],
          step: 0.01
        }),
      ])
      .on((x: any) => {
        const options = x as any;
        videoElement.classList.toggle('selfie', options.selfieMode);
        faceMesh.setOptions(options);
      });
}