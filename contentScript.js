let isHighlightingMode = false; 
let isDrawingMode = false;
let isErasingMode = false;
let eraserMode = 'continuous'; // Default to continuous erase
let canvas = null;
let ctx = null;
let lineThickness = 10;
let lineColor = '#000000';
let eraserSize = 10;
let highlightColor = '#FFFF00'; 
let highlightOpacity = 0.5; 


// for closing the window: 

function closeWindow(){
  // Get the current window
    chrome.windows.getCurrent((window) => {
    // Close the window
    chrome.windows.remove(window.id);
});
}

// -------------------------------- for the text: 
let isTextMode = false;
let textInput = null;
let textX = null;
let textY = null;


// Function to toggle text mode
function toggleCreateText() {
  console.log('create text toggled'); 
  isTextMode = !isTextMode;
  isDrawingMode = false; 
  isErasingMode = false; 
  isHighlightingMode = false; 
  canvas.style.pointerEvents = isTextMode ? 'auto' : 'none';

  if (isTextMode) {
    canvas.addEventListener('click', handleCanvasClick);
  } else {
    canvas.removeEventListener('click', handleCanvasClick);
    if (textInput) {
      document.body.removeChild(textInput);
      textInput = null;
    }
  }
}

// Function to draw text on the canvas, triggers on blur. 
function drawText(text, x, y) {
  ctx.font = '20px Arial'; // Adjust font size as needed
  ctx.fillStyle = 'black'; // Adjust text color as needed
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);
}

// Function to handle canvas click event for text input
function handleCanvasClick(event) {
  if (textInput) {
    // If there's an existing text input, remove it
    document.body.removeChild(textInput);
  }

  // Store the click position
  textX = event.pageX;
  textY = event.pageY;

  // Create a text input field
  textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.style.position = 'absolute';
  textInput.style.top = `${textY}px`;
  textInput.style.left = `${textX}px`;
  textInput.style.zIndex = '100000';
  textInput.style.background = 'transparent';
  textInput.style.border= '1px solid black';
  textInput.style.outline = 'none';
  textInput.style.fontSize = '20px'; // Adjust font size as needed
  textInput.focus();

  textInput.addEventListener('blur', () => {
    const text = textInput.value;
    if (text) {
      textInput.style.border = 'none'; 
      drawText(text, textX, textY);
    }
    document.body.removeChild(textInput);
    textInput = null;
  });

  document.body.appendChild(textInput);
}





















// Initialize canvas and other functions
function initializeCanvas() {
  // loadSettings();
  canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  updateCanvasSize();
  document.body.appendChild(canvas);

  ctx = canvas.getContext('2d');
  console.log('Canvas initialized');
}

function updateCanvasSize() {
  canvas.width = document.documentElement.scrollWidth;
  canvas.height = document.documentElement.scrollHeight;
}


function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCircle(x, y, radius, isErase = false) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = isErase ? 'rgba(255, 255, 255, 1)' : lineColor;
  
  if (isErase) {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
  }
  
  ctx.fill();
  ctx.closePath();
}

let lastX = null;
let lastY = null;

function handleMouseMove(event) {
  const currentX = event.pageX;
  const currentY = event.pageY;

  if (isDrawingMode) {
    ctx.globalAlpha = 1; // Reset to full opacity when drawing

    if (lastX !== null && lastY !== null) {
      // Calculate distance between the current and last positions
      const distance = Math.hypot(currentX - lastX, currentY - lastY);
      
      // Only draw every N pixels (throttle distance)
      const stepSize = Math.max(1, lineThickness / 8); // Step size can be adjusted for faster movement
    
      for (let i = 0; i < distance; i += stepSize) {
        const intermediateX = lastX + (i / distance) * (currentX - lastX);
        const intermediateY = lastY + (i / distance) * (currentY - lastY);
        drawCircle(intermediateX, intermediateY, lineThickness / 2);
      }

      // Draw a line between the last and current positions
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.lineWidth = lineThickness;
      ctx.strokeStyle = lineColor;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.closePath();
    }

    // Update last position to the current one
    lastX = currentX;
    lastY = currentY;
  } else if (isErasingMode) {
    ctx.globalAlpha = 1; // Reset to full opacity for erasing

    if (eraserMode === 'continuous') {
      drawCircle(event.pageX, event.pageY, eraserSize / 2, true);
    }
  } else if (isHighlightingMode) {
    // Set global alpha to the highlight opacity
    ctx.globalAlpha = highlightOpacity; // Use opacity for highlighting mode
  
    if (lastX !== null && lastY !== null) {
      // Calculate distance between the current and last positions
      const distance = Math.hypot(currentX - lastX, currentY - lastY);
      
      // Only draw every N pixels (throttle distance)
      const stepSize = Math.max(1, lineThickness / 4); // Step size can be adjusted for faster movement
      
      // Define rectangle height for highlighting stroke effect
      const rectHeight = lineThickness * 1.5; // Adjust height for a thicker highlighter stroke
      const rectWidth = lineThickness / 2; // Adjust width for the stroke
  
      for (let i = 0; i < distance; i += stepSize) {
        const intermediateX = lastX + (i / distance) * (currentX - lastX);
        const intermediateY = lastY + (i / distance) * (currentY - lastY);
  
        // Draw a rectangle instead of a circle to mimic highlighter strokes
        drawRect(intermediateX, intermediateY, rectWidth, rectHeight);
      }
  
      // Draw the main line between the last and current positions
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.lineWidth = rectHeight; // Use the height of the rectangle as the stroke width
      ctx.strokeStyle = highlightColor; // Use the highlight color directly
      ctx.lineCap = 'butt';
      ctx.stroke();
      ctx.closePath();
    }
  
    // Update last position to the current one
    lastX = currentX;
    lastY = currentY;
  }
}

function drawRect(x, y, width, height) {
  // Set up the rectangle fill and stroke
  ctx.fillStyle = highlightColor;
  ctx.fillRect(x - width / 2, y - height / 2, width, height);
}

function handleMouseUp(event) {
  lastX = null;
  lastY = null; // Reset last position when mouse is released
  canvas.removeEventListener('mousemove', handleMouseMove);
}

function handleMouseDown(event) {
  if (isDrawingMode) {
    drawCircle(event.pageX, event.pageY, lineThickness / 2); // Use pageX/pageY
  } else if (isErasingMode) {
    if (eraserMode === 'click') {
      canvas.addEventListener('mouseup', handleMouseUpForClickErase);
    } else if (eraserMode === 'continuous') {
      drawCircle(event.pageX, event.pageY, eraserSize / 2, true); // Use pageX/pageY
    }
  }
  canvas.addEventListener('mousemove', handleMouseMove);
}


// function handleMouseUp(event) {
//   canvas.removeEventListener('mousemove', handleMouseMove);
// }


function handleMouseUpForClickErase(event) {
	// Calculate eraser bounds
	const startX = event.clientX;
	const startY = event.clientY;
	const radius = eraserSize / 2;
	
	// Draw a circular eraser on the canvas
	ctx.globalCompositeOperation = "destination-out";
	ctx.beginPath();
	ctx.arc(startX, startY, radius, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.closePath();
	ctx.globalCompositeOperation = "source-over"; // Reset to default
  
	canvas.removeEventListener('mouseup', handleMouseUpForClickErase);
  }
  
function toggleDrawingMode() {
  isDrawingMode = !isDrawingMode;
  isErasingMode = false;
  isHighlightingMode = false; 
  isTextMode = false; 
  canvas.style.pointerEvents = isDrawingMode ? 'auto' : 'none';
  if (isDrawingMode) {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
  } else {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mouseup', handleMouseUp);
  }
}

function toggleHighlightingMode() {
  isHighlightingMode = !isHighlightingMode;
  isDrawingMode = false;
  isErasingMode = false;
  isTextMode = false; 
  canvas.style.pointerEvents = isHighlightingMode ? 'auto' : 'none';
  if (isHighlightingMode) {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
  } else {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mouseup', handleMouseUp);
  }
}

function toggleErasingMode() {
  isErasingMode = !isErasingMode;
  isDrawingMode = false;
  isHighlightingMode = false; 
  isTextMode = false; 
  canvas.style.pointerEvents = isErasingMode ? 'auto' : 'none';
  if (isErasingMode) {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
  } else {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mouseup', handleMouseUp);
  }
}


initializeCanvas();
window.addEventListener('resize', updateCanvasSize);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === 'toggleDrawing') {
    toggleDrawingMode();
    sendResponse({ status: 'success' });
  } else if (message.command === 'toggleErasing') {
    toggleErasingMode();
    sendResponse({ status: 'success' });
  } else if (message.command === 'createText') {
    toggleCreateText();
    sendResponse({ status: 'success' });
  } else if (message.command === 'setLineThickness') {
    lineThickness = message.value;
    // saveSettings();
    sendResponse({ status: 'success' });
  } else if (message.command === 'setEraserSize') {
    eraserSize = message.value;
    // saveSettings();
    sendResponse({ status: 'success' });
  } else if (message.command === 'setLineColor') {
    lineColor = message.value;
    // saveSettings();
    sendResponse({ status: 'success' });
  } else if (message.command === 'clearCanvas') {
    clearCanvas();
    sendResponse({ status: 'success' });
  } else if (message.command === 'takeScreenshot') {
    takeScreenshot(); 
    sendResponse({status: 'success'}); 
  }  else if (message.command === 'setHighlightColor') {
    highlightColor = message.value; 
    sendResponse({status: 'success'}); 
  } else if (message.command === 'highlight') {
    toggleHighlightingMode(); 
    sendResponse({status: 'success'}); 
  }  else if (message.command === 'setHighlightOpacity') {
    highlightOpacity = message.value;
    sendResponse({ status: 'success' });
  } else if (message.command === 'closeWindow') {
    closeWindow(); 
    sendResponse({ status: 'success' });
  }
});



// instantiations of an action that's been performed containing 
class Action {
	constructor(type, data) {
	  this.type = type; // 'draw', 'erase', etc.
	  this.data = data; // Data related to the action
	}
  }

// arrays 
const undoStack = [];
const redoStack = [];

// when an action is performed we create an instance of it and store it in our arrays. 
function performAction(type, data) {
	const action = new Action(type, data);
	undoStack.push(action);
	redoStack.length = 0; 
}

function undo() {
	if (undoStack.length === 0) return; // nothing to undo
	
	const action = undoStack.pop();
	redoStack.push(action);
	redrawCanvas();
  }
  

  function redrawCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	undoStack.forEach(action => {
	  // Redraw actions based on their type
	  if (action.type === 'draw') {
		drawFromData(action.data);
	  } else if (action.type === 'erase') {
		eraseFromData(action.data);
	  }
	});
  }
  
  // need to store the data in such a way that it can be re-drawn onto the canvas
  function drawFromData(data) {
	// Implement drawing logic based on data
  }
  
  function eraseFromData(data) {
	// Implement erasing logic based on data
  }
  


  // ---------------------------------------------------- for taking a screenshot: 

  // this uses an api for taking screenshots of the page. // asks for permission...
  async function takeScreenshot() {
    try {
      const captureStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen'
        }
      });
  
      // Create a video element to hold the captured stream
      const video = document.createElement('video');
      video.srcObject = captureStream;
      video.play();
  
      // Wait for the video to be ready
      video.onloadedmetadata = async () => {
        // Create a canvas to draw the screen capture
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
  
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
        // Stop capturing the screen once we have the image
        const tracks = captureStream.getTracks();
        tracks.forEach(track => track.stop());
  
        // Convert canvas to image and download it
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'screenshot.png';
        link.click();
      };
    } catch (err) {
      console.error('Error capturing screen:', err);
    }
  }

