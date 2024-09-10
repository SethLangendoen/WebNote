// contentScript.js

let isDrawingMode = false;
let canvas = null;
let ctx = null;

// Function to initialize drawing canvas
function initializeCanvas() {
  // Create a canvas element
  canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none'; // Allows clicks to pass through to the underlying page
  canvas.width = window.innerWidth; // Match canvas size to window
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
	console.log('canvas initialized'); 
  // Get the 2D drawing context
  ctx = canvas.getContext('2d');
}

// Function to handle mouse movement for drawing
function handleMouseMove(event) {
  if (isDrawingMode) {
    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
  }
}

// Function to handle mouse down for starting drawing
function handleMouseDown(event) {
  if (isDrawingMode) {
    ctx.beginPath();
    ctx.moveTo(event.clientX, event.clientY);
    canvas.addEventListener('mousemove', handleMouseMove);
  }
}

// Function to handle mouse up for ending drawing
function handleMouseUp(event) {
  if (isDrawingMode) {
    canvas.removeEventListener('mousemove', handleMouseMove);
  }
}

// Function to toggle drawing mode
function toggleDrawingMode() {
	console.log(' drawing mode has been toggled'); 

	isDrawingMode = !isDrawingMode;
	if (isDrawingMode) {
		canvas.style.pointerEvents = 'auto'; // Allow canvas to intercept mouse events
		canvas.addEventListener('mousedown', handleMouseDown);
		canvas.addEventListener('mouseup', handleMouseUp);
		console.log('drawing mode toggled on')
	} else {
		canvas.style.pointerEvents = 'none'; // Disable canvas interaction
		canvas.removeEventListener('mousedown', handleMouseDown);
		canvas.removeEventListener('mouseup', handleMouseUp);
		console.log('drawing mode toggled off')
	}
}

// Initialize canvas and setup initial state
initializeCanvas();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.command === 'toggleDrawing') {
	  console.log("Drawing mode toggled");
	  toggleDrawingMode(); // Call your drawing mode function here
	  sendResponse({ status: 'success' });
	}
  });