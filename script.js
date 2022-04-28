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
  { note: "C0", frequency: 16.35 },
  { note: "C0#", frequency: 17.32 },
  { note: "D0", frequency: 18.35 },
  { note: "D0#", frequency: 19.45 },
  { note: "E0", frequency: 20.6 },
  { note: "F0", frequency: 21.83 },
  { note: "F0#", frequency: 23.12 },
  { note: "G0", frequency: 24.5 },
  { note: "G0#", frequency: 25.96 },
  { note: "A0", frequency: 27.5 },
  { note: "A0#", frequency: 29.14 },
  { note: "B0", frequency: 30.87 },
  { note: "C1", frequency: 32.7 },
  { note: "C1#", frequency: 34.65 },
  { note: "D1", frequency: 36.71 },
  { note: "D1#", frequency: 38.89 },
  { note: "E1", frequency: 41.2 },
  { note: "F1", frequency: 43.65 },
  { note: "F1#", frequency: 46.25 },
  { note: "G1", frequency: 49.0 },
  { note: "G1#", frequency: 51.91 },
  { note: "A1", frequency: 55.0 },
  { note: "A1#", frequency: 58.27 },
  { note: "B1", frequency: 61.74 },
  { note: "C2", frequency: 65.41 },
  { note: "C2#", frequency: 69.3 },
  { note: "D2", frequency: 73.42 },
  { note: "D2#", frequency: 77.78 },
  { note: "E2", frequency: 82.41 },
  { note: "F2", frequency: 77.78 },
  { note: "F2#", frequency: 92.5 },
  { note: "G2", frequency: 98.0 },
  { note: "G2#", frequency: 103.83 },
  { note: "A2", frequency: 110.0 },
  { note: "A2#", frequency: 116.54 },
  { note: "B2", frequency: 123.47 },
  { note: "C3", frequency: 130.81 },
  { note: "C3#", frequency: 138.59 },
  { note: "D3", frequency: 146.82 },
  { note: "D3#", frequency: 155.56 },
  { note: "E3", frequency: 164.81 },
  { note: "F3", frequency: 174.61 },
  { note: "F3#", frequency: 185.0 },
  { note: "G3", frequency: 196.0 },
  { note: "G3#", frequency: 207.65 },
  { note: "A3", frequency: 220.0 },
  { note: "A3#", frequency: 223.08 },
  { note: "B3", frequency: 246.94 },
  { note: "C4", frequency: 261.63 },
  { note: "C4#", frequency: 277.18 },
  { note: "D4", frequency: 293.66 },
  { note: "D4#", frequency: 311.13 },
  { note: "E4", frequency: 329.63 },
  { note: "F4", frequency: 249.23 },
  { note: "F4#", frequency: 369.99 },
  { note: "G4", frequency: 392.0 },
  { note: "G4#", frequency: 415.3 },
  { note: "A4", frequency: 440.0 },
  { note: "A4#", frequency: 466.16 },
  { note: "B4", frequency: 493.88 },
  { note: "C5", frequency: 523.25 },
  { note: "C5#", frequency: 554.37 },
  { note: "D5", frequency: 587.33 },
  { note: "D5#", frequency: 622.25 },
  { note: "E5", frequency: 659.25 },
  { note: "F5", frequency: 698.46 },
  { note: "F5#", frequency: 739.99 },
  { note: "G5", frequency: 783.99 },
  { note: "G5#", frequency: 830.61 },
  { note: "A5", frequency: 880.0 },
  { note: "A5#", frequency: 932.33 },
  { note: "B5", frequency: 987.77 },
  { note: "C6", frequency: 1046.5 },
  { note: "C6#", frequency: 1108.73 },
  { note: "D6", frequency: 1174.66 },
  { note: "D6#", frequency: 1244.51 },
  { note: "E6", frequency: 1318.51 },
  { note: "F6", frequency: 1396.91 },
  { note: "F6#", frequency: 1479.98 },
  { note: "G6", frequency: 1567.98 },
  { note: "G6#", frequency: 1661.22 },
  { note: "A6", frequency: 1760.0 },
  { note: "A6#", frequency: 1864.66 },
  { note: "B6", frequency: 1975.53 },
  { note: "C7", frequency: 2093.0 },
  { note: "C7#", frequency: 2217.46 },
  { note: "D7", frequency: 2349.32 },
  { note: "D7#", frequency: 2489.02 },
  { note: "E7", frequency: 2637.02 },
  { note: "F7", frequency: 2793.83 },
  { note: "F7#", frequency: 2959.96 },
  { note: "G7", frequency: 3135.96 },
  { note: "G7#", frequency: 3322.44 },
  { note: "A7", frequency: 3520.0 },
  { note: "A7#", frequency: 3729.31 },
  { note: "B7", frequency: 3951.07 },
  { note: "C8", frequency: 4186.01 },
  { note: "C8#", frequency: 4434.92 },
  { note: "D8", frequency: 4698.63 },
  { note: "D8#", frequency: 4978.03 },
  { note: "E8", frequency: 5274.04 },
  { note: "F8", frequency: 5587.65 },
  { note: "F8#", frequency: 5919.91 },
  { note: "G8", frequency: 6271.93 },
  { note: "G8#", frequency: 6644.88 },
  { note: "A8", frequency: 7040.0 },
  { note: "A8#", frequency: 7458.62 },
  { note: "B8", frequency: 7902.13 },
];

const closestNoteAndFreqDiff = (freq) => {
  let smallestDifference = Infinity;
  let actualClosestNote = "";
  for (let note of notesFrequency) {
    if (Math.abs(note.frequency) - Math.abs(freq) < smallestDifference) {
      if (Math.abs(note.frequency) - Math.abs(freq) < 0) {
        smallestDifference = Math.abs(note.frequency) - Math.abs(freq) * -1;
        actualClosestNote = note.note;
      } else {
        smallestDifference = Math.abs(note.frequency) - Math.abs(freq);
        actualClosestNote = note.note;
      }
    }
  }
  return `${smallestDifference} Hz, ${actualClosestNote}`;
};



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

    const drawNote = () => {
      drawNoteVisual = requestAnimationFrame(drawNote);
      const bufferLength = analyser.fftSize;
      const buffer = new Float32Array(bufferLength);
      analyser.getFloatTimeDomainData(buffer);
      const autoCorrelateValue = autoCorrelate(buffer, audioContext.sampleRate);

      let valueToDisplay = autoCorrelateValue;
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
        valueToDisplay = closestNoteAndFreqDiff(valueToDisplay);
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
