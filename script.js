const volume = document.getElementById("volume");
const bass = document.getElementById("bass");
const mid = document.getElementById("mid");
const treble = document.getElementById("treble");
const visualizer = document.getElementById("visualizer");

const context = new AudioContext();
const analizerNode = new AnalyserNode(context, { fftSize: 256 });

const setupContext = async () => {
  const audio = await getAudio();
  if (context.state === "suspended") {
    await context.resume();
  }
  const source = context.createMediaStreamSource(audio);
  source
  .connect(analizerNode)
  .connect(context.destination);
};

const getAudio = async () => {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      autoGainControl: false,
      noiseSuppression: false,
      latency: 0,
    },
  });
};

const drawVisualizer = () => {
  requestAnimationFrame(drawVisualizer);
  const bufferLength = analizerNode.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  analizerNode.getByteFrequencyData(dataArray)
};

setupContext();
