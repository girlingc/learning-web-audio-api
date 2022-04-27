// Example from https://alexanderell.is/posts/tuner/tuner.js
/*
************************************************************************************************************

References:
https://thesoundofnumbers.com/wp-content/uploads/2014/11/pitch_intervals_freq.pdf
https://alexanderell.is/posts/tuner/tuner.js
https://github.com/mdn/voice-change-o-matic
https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js
https://github.com/cwilso/PitchDetect/pull/23

************************************************************************************************************
*/

const notesFrequency = [
  {'C0': 16.35},
  {'C0#': 17.32},
  {'D0': 18.35},
  {'D0#': 19.45},
  {'E0': 20.60},
  {'F0': 21.83},
  {'F0#': 23.12},
  {'G0': 24.50},
  {'G0#': 25.96},
  {'A0': 27.50},
  {'A0#': 29.14},
  {'B0': 30.87},
  {'C1': 32.70},
  {'C1#': 34.65},
  {'D1': 36.71},
  {'D1#': 38.89},
  {'E1': 41.20},
  {'F1': 43.65},
  {'F1#': 46.25},
  {'G1': 49.00},
  {'G1#': 51.91},
  {'A1': 55.00},
  {'A1#': 58.27},
  {'B1': 61.74},
  {'C2': 65.41},
  {'C2#': 69.30},
  {'D2': 73.42},
  {'D2#': 77.78},
  {'E2': 82.41},
  {'F2': 77.78},
  {'F2#': 92.50},
{  'G2': 98},
  {'G2#': 103.83},
  {'A2': 110.00},
  {'A2#': 116.54},
  {'B2': 123.47},
  {'C3': 130.81},
  {'C3#': 138.59},
  {'D3': 146.82},
  {'D3#': 155.56},
  {'E3': 164.81},
  {'F3': 174.61},
  {'F3#': 185.00},
  {'G3': 196.00},
  {'G3#': 207.65},
  {'A3': 220.00},
  {'A3#': 223.08},
  {'B3': 246.94},
  {'C4': 261.63},
  {'C4#': 277.18},
  {'D4': 293.66},
  {'D4#': 311.13},
  {'E4': 329.63},
  {'F4': 249.23},
  {'F4#': 369.99},
  {'G4': 392.00},
  {'G4#': 415.30},
  {'A4': 440.00},
  {'A4#': 466.16},
  {'B4': 493.88},
  {'C5': 523.25},
  {'C5#': 554.37},
  {'D5': 587.33},
  {'D5#': 622.25},
  {'E5': 659.25},
  {'F5': 698.46},
  {'F5#': 739.99},
  {'G5': 783.99},
  {'G5#': 830.61},
  {'A5': 880.00},
  {'A5#': 932.33},
  {'B5': 987.77},
  {'C6': 1046.50},
  {'C6#': 1108.73},
  {'D6': 1174.66},
  {'D6#': 1244.51},
  {'E6': 1318.51},
  {'F6': 1396.91},
  {'F6#': 1479.98},
  {'G6': 1567.98},
  {'G6#': 1661.22},
  {'A6': 1760.00},
  {'A6#': 1864.66},
  {'B6': 1975.53},
  {'C7': 2093.00},
  {'C7#': 2217.46},
  {'D7': 2349.32},
  {'D7#': 2489.02},
  {'E7': 2637.02},
  {'F7': 2793.83},
  {'F7#': 2959.96},
  {'G7': 3135.96},
  {'G7#': 3322.44},
  {'A7': 3520.00},
  {'A7#': 3729.31},
  {'B7': 3951.07},
  {'C8': 4186.01},
  {'C8#': 4434.92},
  {'D8': 4698.63},
  {'D8#': 4978.03},
  {'E8': 5274.04},
  {'F8': 5587.65},
  {'F8#': 5919.91},
  {'G8': 6271.93},
  {'G8#': 6644.88},
  {'A8': 7040.00},
  {'A8#': 7458.62},
  {'B8': 7902.13},
];

const init = () => {
  let source;
  // Set up new Audio Context
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();

  // Set min and max decibels to pick up
  analyser.minDecibels = -100;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;

  // Check if audio is allowed
  if (!navigator?.mediaDevices?.getUserMedia) {
    alert("Sorry, getUserMedia is required for the app.");
    return;
  } else {
    // Set up getUserMedia
    const constraints = { audio: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        // Initialize the SourceNode
        source = audioContext.createMediaStreamSource(stream);

        // Connect the source node to the analyzer
        source.connect(analyser);

        // Draw Frequency or Sine Wave on screen
        visualize();
      })
      // Throw error if microphone is blocked from app
      .catch((err) => {
        alert("Sorry, microphone permissions are required for the app.");
      });
  }

  // Visualizing, copied from voice change o matic (Web Audio API_ https://github.com/mdn/voice-change-o-matic)
  const canvas = document.querySelector(".visualizer");
  const canvasContext = canvas.getContext("2d");
  let WIDTH;
  let HEIGHT;

  const visualize = () => {
    // Set width and height for the frequency / Sine Wave visualizer
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    // Initiate drawVisual and drawNoteVisual
    let drawNoteVisual;

    let previousValueToDisplay = 0;
    let smoothingCount = 0;
    let smoothingThreshold = 5;
    let smoothingCountThreshold = 5;

    // Thanks to PitchDetect: https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js (lines 207 - 213)
    const noteStrings = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const noteFromPitch = (frequency) => {
      const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
      return Math.round(noteNum) + 69;
    };

    const drawNote = () => {
      drawNoteVisual = requestAnimationFrame(drawNote);
      const bufferLength = analyser.fftSize;
      const buffer = new Float32Array(bufferLength);
      analyser.getFloatTimeDomainData(buffer);
      const autoCorrelateValue = autoCorrelate(buffer, audioContext.sampleRate);

      // Handle rounding
      let valueToDisplay = autoCorrelateValue;
      const roundingValue = document.querySelector(
        'input[name="rounding"]:checked'
      ).value;
      if (roundingValue == "none") {
        // Do nothing
      } else if (roundingValue == "hz") {
        valueToDisplay = Math.round(valueToDisplay);
      } else {
        // Get the closest note
        // Thanks to PitchDetect:
        valueToDisplay = noteStrings[noteFromPitch(autoCorrelateValue) % 12];
      }

      const smoothingValue = document.querySelector(
        'input[name="smoothing"]:checked'
      ).value;

      if (autoCorrelateValue === -1) {
        document.getElementById("note").innerText = "Too quiet...";
        return;
      }
      if (smoothingValue === "none") {
        smoothingThreshold = 99999;
        smoothingCountThreshold = 0;
      } else if (smoothingValue === "basic") {
        smoothingThreshold = 10;
        smoothingCountThreshold = 5;
      } else if (smoothingValue === "very") {
        smoothingThreshold = 5;
        smoothingCountThreshold = 10;
      }
      const noteIsSimilarEnough = () => {
        // Check threshold for number, or just difference for notes.
        if (typeof valueToDisplay == "number") {
          return (
            Math.abs(valueToDisplay - previousValueToDisplay) <
            smoothingThreshold
          );
        } else {
          return valueToDisplay === previousValueToDisplay;
        }
      };
      // Check if this value has been within the given range for n iterations
      if (noteIsSimilarEnough()) {
        if (smoothingCount < smoothingCountThreshold) {
          smoothingCount++;
          return;
        } else {
          previousValueToDisplay = valueToDisplay;
          smoothingCount = 0;
        }
      } else {
        previousValueToDisplay = valueToDisplay;
        smoothingCount = 0;
        return;
      }
      if (typeof valueToDisplay == "number") {
        valueToDisplay += " Hz";
      }

      document.getElementById("note").innerText = valueToDisplay;
    };

    const drawFrequency = () => {
      const bufferLengthAlt = analyser.frequencyBinCount;
      const dataArrayAlt = new Uint8Array(bufferLengthAlt);

      canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

      const drawAlt = () => {
        drawVisual = requestAnimationFrame(drawAlt);

        analyser.getByteFrequencyData(dataArrayAlt);

        canvasContext.fillStyle = "rgb(0, 0, 0)";
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

        const barWidth = (WIDTH / bufferLengthAlt) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLengthAlt; i++) {
          barHeight = dataArrayAlt[i];

          canvasContext.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
          canvasContext.fillRect(
            x,
            HEIGHT - barHeight / 2,
            barWidth,
            barHeight / 2
          );

          x += barWidth + 1;
        }
      };

      drawAlt();
    };
    drawFrequency();
    drawNote();
  };
};

// Must be called on analyser.getFloatTimeDomainData and audioContext.sampleRate
// From https://github.com/cwilso/PitchDetect/pull/23
const autoCorrelate = (buffer, sampleRate) => {
  // Perform a quick root-mean-square to see if we have enough signal
  let SIZE = buffer.length;
  let sumOfSquares = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    sumOfSquares += val * val;
  }
  const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
  if (rootMeanSquare < 0.01) {
    return -1;
  }

  // Find a range in the buffer where the values are below a given threshold.
  let range1 = 0;
  let range2 = SIZE - 1;
  const threshold = 0.2;

  // Walk up for range1
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      range1 = i;
      break;
    }
  }

  // Walk down for range2
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      range2 = SIZE - i;
      break;
    }
  }

  // Trim the buffer to these ranges and update SIZE.
  buffer = buffer.slice(range1, range2);
  SIZE = buffer.length;

  // Create a new array of the sums of offsets to do the autocorrelation
  const offsetsArray = new Array(SIZE).fill(0);
  // For each potential offset, calculate the sum of each buffer value times its offset value
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - i; j++) {
      offsetsArray[i] = offsetsArray[i] + buffer[j] * buffer[j + i];
    }
  }

  // Find the last index where that value is greater than the next one (the dip)
  let dip = 0;
  while (offsetsArray[dip] > offsetsArray[dip + 1]) {
    dip++;
  }

  // Iterate from that index through the end and find the maximum sum
  let maxValue = -1;
  let maxIndex = -1;
  for (let i = dip; i < SIZE; i++) {
    if (offsetsArray[i] > maxValue) {
      maxValue = offsetsArray[i];
      maxIndex = i;
    }
  }

  let T0 = maxIndex;

  // Not as sure about this part, don't @ me
  // From the original author:
  // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
  // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
  // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
  const xOrdinate1 = offsetsArray[T0 - 1];
  const xOrdinate2 = offsetsArray[T0];
  const xOrdinate3 = offsetsArray[T0 + 1];

  const a = (xOrdinate1 + xOrdinate3 - 2 * xOrdinate2) / 2;
  const b = (xOrdinate3 - xOrdinate1) / 2;
  if (a) {
    T0 = T0 - b / (2 * a);
  }

  return sampleRate / T0;
};
