let numPoints, numBars, barWidth, barHeight, dotSize, yCoords;
let capturer;
let isRecording = false;

function setup() {
  let canvas = createCanvas(windowWidth/6, windowHeight/1.5);
  canvas.parent('sketch-holder');
  canvas.style('margin', 'auto');
  canvas.style('display', 'block');
  
  // Initialize capturer
  capturer = new CCapture({
    format: 'gif',
    workersPath: 'lib/',
    framerate: 60,
    verbose: true
  });
  
  // Add click handler for download button
  document.getElementById('downloadButton').addEventListener('click', startRecording);
  
  numPoints = random(10,10);
  numBars = random(1,105);
  barWidth = width / numBars;
  barHeight = height / numPoints;
  dotSize = random(0,10);
  yCoords = new Array(numPoints).fill(0);
  noStroke();
}

function draw() {
  // Start capturing if recording just began
  if (isRecording && frameCount === 1) {
    capturer.start();
  }
  
  background(0);
  
  stroke(128);
  strokeWeight(2);
  noFill();
  rect(0, 0, width, height);
  
  noStroke();
  fill(255);
  for (let i = 0; i < numBars; i++) {
    let xOffset = i * barWidth + barWidth / 2;
    for (let j = 0; j < numPoints; j++) {
      let yOffset = map(sin(frameCount / 30 + j / 5 + i * 10), -1, 1, -barHeight / 2, barHeight / 2);
      let x = xOffset;
      let y = j * barHeight + yCoords[j] + yOffset;
      ellipse(x, y, dotSize, dotSize);
      if (i > 0) {
        let prevXOffset = (i - 1) * barWidth + barWidth / 2;
        let prevYOffset = map(sin(frameCount / 30 + j / 5 + (i - 1) * 10), -1, 1, -barHeight / 2, barHeight / 2);
        let prevX = prevXOffset;
        let prevY = j * barHeight + yCoords[j] + prevYOffset;
        stroke(255);
        line(x, y, prevX, prevY);
        noStroke();
      }
    }
  }
  for (let i = 0; i < yCoords.length; i++) {
    yCoords[i] += random(-1, 1);
  }
  
  // Add frame to recording if active
  if (isRecording) {
    capturer.capture(canvas);
  }
}

function startRecording() {
  if (!isRecording) {
    isRecording = true;
    frameCount = 0;  // Reset frame count
    
    // Change button text while recording
    document.getElementById('downloadButton').textContent = 'Recording...';
    
    // Record for 15 seconds (15000 milliseconds)
    setTimeout(() => {
      isRecording = false;
      capturer.stop();
      
      // Save and force download
      capturer.save((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'animation.gif';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
      
      // Reset capturer for next recording
      capturer = new CCapture({
        format: 'gif',
        workersPath: 'lib/',
        framerate: 60,
        verbose: true
      });
      
      document.getElementById('downloadButton').textContent = 'Download GIF';
    }, 15000);
  }
}
