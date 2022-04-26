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
    let drawVisual;
    let drawNoteVisual;

    // Function to draw lines on the visualizer
    const draw = () => {
      drawVisual = requestAnimationFrame(draw);
      analyser.fftSize = 2048;
      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      canvasContext.fillStyle = "rgb(200, 200, 200)";
      canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = "rgb(0, 0, 0)";

      canvasContext.beginPath();

      let sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;

        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasContext.lineTo(canvas.width, canvas.height / 2);
      canvasContext.stroke();
    };

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
