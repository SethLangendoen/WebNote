let isHighlightingMode = false; 
let isDrawingMode = false;
let isErasingMode = false;
let eraserMode = 'continuous'; // Default to continuous erase
let canvas = null;
let ctx = null;
let lineThickness = 10;
let lineColor = '#000000';
let eraserSize = 10;
let fontSize = 10; 
let highlightColor = '#FFFF00'; 
let highlightOpacity = 0.5; 



// // Create a new div element
// const redSquare = document.createElement('div');

// // Style the div to be a red square
// redSquare.style.width = '400px'; // Adjusted size to fit popup content
// redSquare.style.height = '600px'; // Adjusted size to fit popup content
// redSquare.style.backgroundColor = 'red';
// redSquare.style.position = 'fixed'; // Keep it fixed to the screen
// redSquare.style.top = '20px';
// redSquare.style.left = '20px';
// redSquare.style.zIndex = '100000000000'; // Ensure it's on top of other elements
// redSquare.style.overflow = 'auto'; // Allow scrolling in case content overflows

// // Add your HTML structure to the redSquare
// redSquare.innerHTML = `
//   <div class="popup-container">
//     <div class="popup-header">
//       <h2 class="title">WebNote</h2>
//       <button class="minimize-btn">^</button>
//       <button class="close-btn">X</button>
//     </div>

//     <div class="popup-content">
//       <div class="drawing-options">
//         <div id="drawingOptions">
//           <button class="draw-btn optionContainer" title="Drawing tool"><img src="./Assets/pencil.png" class="setttingImg"></button>
//           <button class="erase-btn optionContainer" title="Erasing tool"><img src="./Assets/eraser.png" class="setttingImg"></button>
//           <button class="highlight-btn optionContainer" title="Highlighting tool"><img src="./Assets/marker.png" class="setttingImg"></button>
//           <button class="text-btn optionContainer" title="Create Text"><img src="./Assets/text.png" class="setttingImg"></button>
//           <button class="preset-btn optionContainer" title="Save tool"><img src="./Assets/save-instagram.png" class="setttingImg"></button>
//         </div>

//         <div id="savedPresets">
//           <p id="savedText">Saved tools</p>
//         </div>

//         <div class="thickness-slider-container">
//           <span class="slider-label">Stroke Size</span>
//           <input type="range" min="1" max="100" value="10" class="thickness-slider">
//         </div>

//         <div class="eraser-slider-container">
//           <span class="slider-label">Eraser Size</span>
//           <input type="range" min="1" max="100" value="10" class="eraser-slider">
//         </div>

//         <div class="highlight-slider-container">
//           <span class="slider-label">Highlight Opacity</span>
//           <input type="range" min="0" max=".6" value="0.10" step="0.01" class="highlight-slider">
//         </div>

//         <div class="font-slider-container">
//           <span class="slider-label">Font Size</span>
//           <input type="range" min="1" max="100" value="10" class="font-slider">
//         </div>

//         <div class="colorSelector">
//           <span class="slider-label">Drawing color</span>
//           <input type="color" class="color-picker">
//         </div>

//         <div class="highlightSelector">
//           <span class="slider-label">Highlight color</span>
//           <input type="color" value="#FFFF00" class="highlight-picker">
//         </div>

//         <div id="actionButtons">
//           <button onclick="undo()" title="Undo"><img src="./Assets/undo-circular-arrow.png" class="actionImg"></button>
//           <button onclick="redo()" title="Redo"><img src="./Assets/redo-arrow-symbol.png" class="actionImg"></button>
//           <button class="clear-btn" title="Delete all"><img src="./Assets/trash-can.png" class="actionImg"></button>
//           <button class="screenshot-btn" title="Screenshot"><img src="./Assets/screenshot-icon.png" class="actionImg"></button>
//         </div>

//         <div>
//           <button class="restore-notes-btn">Restore Note</button>
//         </div>
//       </div>
//     </div>
//   </div>
// `;

// Append the red square to the body as a child
// document.body.appendChild(redSquare);



// for closing the window: 

function closeWindow(){
  // Get the current window
    chrome.windows.getCurrent((window) => {
    // Close the window
    chrome.windows.remove(window.id);
});
}





function applySettings() {
  // Retrieve settings from localStorage
  const settings = localStorage.getItem('drawingSettings');
  
  if (settings) {
    const {
      isHighlightingMode = false,
      isDrawingMode = false,
      isErasingMode = false,
      eraserMode = 'continuous',
      lineThickness = 10,
      lineColor = '#000000',
      eraserSize = 10,
      fontSize = 10,
      highlightColor = '#FFFF00',
      highlightOpacity = 0.5
    } = JSON.parse(settings);
    
    // Apply settings to the UI elements
    const drawBtn = document.querySelector('.draw-btn');
    const eraseBtn = document.querySelector('.erase-btn');
    const clearBtn = document.querySelector('.clear-btn'); 
    const thicknessSlider = document.querySelector('.thickness-slider');
    const eraserSlider = document.querySelector('.eraser-slider'); 
    const colorPicker = document.querySelector('.color-picker');
    const screenshotButton = document.querySelector('.screenshot-btn'); 
    const highlightButton = document.querySelector('.highlight-btn'); 
    const highlightColorPicker = document.querySelector('.highlight-picker'); 
    const highlightOpacitySlider = document.querySelector('.highlight-slider'); 
    const textBtn = document.querySelector('.text-btn'); 
    const closeWindowBtn = document.querySelector('.close-btn'); 
    const minimizeBtn = document.querySelector('.minimize-btn'); 
    const containingDiv = document.querySelector('.popup-container'); 
    const popupContentDiv = document.querySelector('.popup-content'); 
    // add font size

    // Set the state of buttons and sliders based on settings
    drawBtn.classList.toggle('active', isDrawingMode);
    eraseBtn.classList.toggle('active', isErasingMode);
    highlightButton.classList.toggle('active', isHighlightingMode);
    textBtn.classList.toggle('active', isTextMode);

    thicknessSlider.value = lineThickness;
    eraserSlider.value = eraserSize;
    colorPicker.value = lineColor;
    highlightColorPicker.value = highlightColor;
    highlightOpacitySlider.value = highlightOpacity;

    // Optionally apply styles or classes to other elements based on settings
    if (isDrawingMode) {
      // Apply styles or activate drawing mode
    }

    if (isErasingMode) {
      // Apply styles or activate erasing mode
    }

    if (isHighlightingMode) {
      // Apply styles or activate highlighting mode
    }

    // Add any additional logic to apply settings to other parts of the UI
  } else {
    // Handle the case where no settings are saved (optional)
    console.log('No settings found in localStorage');
  }
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
  ctx.font = `${fontSize}px Arial`; // Adjust font size as needed
  ctx.fillstyle = lineColor;
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
  textInput.style.color = `${lineColor}`;
  textInput.style.top = `${textY}px`;
  textInput.style.left = `${textX}px`;
  textInput.style.zIndex = '100000';
  textInput.style.background = 'transparent';
  textInput.style.border= '1px solid black';
  textInput.style.outline = 'none';
  textInput.style.fontSize = `${fontSize}px`; // Adjust font size as needed
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
  loadSettings();
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
    saveSettings();
    sendResponse({ status: 'success' });

  } else if (message.command === 'applySettings') {
    console.log('applyingSetting'); 
    applySettings(); 
    sendResponse({ status: 'success' });

  } else if (message.command === 'toggleErasing') {
    toggleErasingMode();
    saveSettings();
    sendResponse({ status: 'success' });

  } else if (message.command === 'createText') {
    lineColor = message.value; 
    toggleCreateText();
    saveSettings();

    sendResponse({ status: 'success' });

  } else if (message.command === 'setLineThickness') {
    lineThickness = message.value;
    saveSettings();
    saveCanvasState()
    sendResponse({ status: 'success' });

  } else if (message.command === 'setEraserSize') {
    eraserSize = message.value;
    saveSettings();
    saveCanvasState()
    sendResponse({ status: 'success' });

  } else if (message.command === 'setFontSize') {
    fontSize = message.value;
    saveSettings();
    saveCanvasState()
    sendResponse({ status: 'success' });

  } 
  
  else if (message.command === 'setLineColor') {
    lineColor = message.value;
    console.log('setting line color'); 
    saveSettings();
    saveCanvasState()
    sendResponse({ status: 'success' });

  } else if (message.command === 'clearCanvas') {
    clearCanvas();
    saveCanvasState()
    sendResponse({ status: 'success' });

  } else if (message.command === 'takeScreenshot') {
    takeScreenshot(); 
    saveCanvasState()
    sendResponse({status: 'success'}); 

  }  else if (message.command === 'setHighlightColor') {
    highlightColor = message.value; 
    saveSettings();
    saveCanvasState()
    sendResponse({status: 'success'}); 

  } else if (message.command === 'highlight') {
    toggleHighlightingMode(); 
    saveSettings();
    saveCanvasState()
    sendResponse({status: 'success'}); 

  } else if (message.command === 'restore') {
    restoreCanvasState(); 
    sendResponse({status: 'success'});

  }
  
  else if (message.command === 'addPreset') {
    const result = savePreset();
    console.log('heard add preset'); 
    sendResponse(result);
    sendResponse({status: 'success'});
  }
  
  else if (message.command === 'setHighlightOpacity') {
    highlightOpacity = message.value;
    saveSettings();
    saveCanvasState()
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


  // saving settings --------------------------------

  function saveSettings() {
    const settings = {
      isHighlightingMode,
      isDrawingMode,
      isErasingMode,
      eraserMode,
      lineThickness,
      lineColor,
      eraserSize,
      fontSize,
      highlightColor,
      highlightOpacity
    };
  
    localStorage.setItem('drawingSettings', JSON.stringify(settings));
    console.log('Settings saved.');
  }

  
  function loadSettings() {
    const settings = localStorage.getItem('drawingSettings');
    

    if (settings) {
      // defaults if none found. 
      const {
        isHighlightingMode: loadedIsHighlightingMode = false,
        isDrawingMode: loadedIsDrawingMode = false,
        isErasingMode: loadedIsErasingMode = false,
        eraserMode: loadedEraserMode = 'continuous',
        lineThickness: loadedLineThickness = 10,
        lineColor: loadedLineColor = '#000000',
        eraserSize: loadedEraserSize = 10,
        fontSize: loadedFontSize = 10,
        highlightColor: loadedHighlightColor = '#FFFF00',
        highlightOpacity: loadedHighlightOpacity = 0.5
      } = JSON.parse(settings);
  
      isHighlightingMode = loadedIsHighlightingMode;
      isDrawingMode = loadedIsDrawingMode;
      isErasingMode = loadedIsErasingMode;
      eraserMode = loadedEraserMode;
      lineThickness = loadedLineThickness;
      lineColor = loadedLineColor;
      eraserSize = loadedEraserSize;
      fontSize = loadedFontSize; 
      highlightColor = loadedHighlightColor;
      highlightOpacity = loadedHighlightOpacity;
  
      console.log('Settings loaded.');
    } else {
      console.log('No settings found in localStorage.');
    }
  }
  

  // saving and retrieving canvas: 

  function saveCanvasState() {
    if (canvas && ctx) {
      const dataURL = canvas.toDataURL(); // Get the data URL of the canvas
      localStorage.setItem('canvasState', dataURL); // Save to localStorage
      console.log('Canvas state saved');
    } else {
      console.log('Canvas or context not available');
    }
  }
  

  function restoreCanvasState() {
    const dataURL = localStorage.getItem('canvasState'); // Retrieve from localStorage
    if (dataURL && canvas && ctx) {
      const img = new Image();
      img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear existing content
        ctx.drawImage(img, 0, 0); // Draw the saved image onto the canvas
      };
      img.src = dataURL;
    } else {
      console.log('No saved canvas state found or canvas/context not available');
    }
  }
  


  // --------- this is for saving preset tools: 

  // Function to save the current tool and its properties as a preset
function savePreset() {
  // Capture the currently selected tool and its properties
  const currentTool = getCurrentTool(); // This could be 'draw', 'erase', 'highlight', etc.
  const strokeSize = document.querySelector('.thickness-slider').value; // Drawing stroke size
  const eraserSize = document.querySelector('.eraser-slider').value; // Eraser size
  const highlightOpacity = document.querySelector('.highlight-slider').value; // Highlight opacity
  const fontSize = document.querySelector('.font-slider').value; // Font size
  const lineColor = document.querySelector('.color-picker').value; // Drawing color
  const highlightColor = document.querySelector('.highlight-picker').value; // Highlight color

  // Create an object to store the current preset
  const preset = {
      tool: currentTool,
      strokeSize: strokeSize,
      eraserSize: eraserSize,
      highlightOpacity: highlightOpacity,
      fontSize: fontSize,
      lineColor: lineColor,
      highlightColor: highlightColor
  };

  // Append the preset to the popup container (inside the 'savedPresets' section)
  const savedPresetsContainer = document.getElementById('savedPresets');

  // Create a new preset div element
  const presetDiv = document.createElement('div');
  presetDiv.classList.add('preset-item');

  // Set the content of the preset div to display the tool and its properties
  presetDiv.textContent = `Tool: ${preset.tool}, Stroke Size: ${preset.strokeSize}, Eraser Size: ${preset.eraserSize}, Highlight Opacity: ${preset.highlightOpacity}, Font Size: ${preset.fontSize}, Color: ${preset.lineColor}`;

  // Add an event listener to apply this preset when clicked
  presetDiv.addEventListener('click', function () {
      applyPreset(preset); // Function to apply the preset properties
  });

  // Append the preset div to the savedPresets container
  savedPresetsContainer.appendChild(presetDiv);

  // Send response back (if needed)
  return { status: 'success' };
}

// Example function to get the current selected tool (replace with your own logic)
function getCurrentTool() {
  console.log(' in get tool'); 
  // Return the currently selected tool (based on your app's current state)
  // For example, if a draw button is active, return 'draw'
  const drawBtn = document.querySelector('.draw-btn');
  if (drawBtn.classList.contains('active')) return 'draw';

  const eraseBtn = document.querySelector('.erase-btn');
  if (eraseBtn.classList.contains('active')) return 'erase';

  const highlightBtn = document.querySelector('.highlight-btn');
  if (highlightBtn.classList.contains('active')) return 'highlight';

  const textBtn = document.querySelector('.text-btn');
  if (textBtn.classList.contains('active')) return 'text';

  return 'none'; // Default fallback
}

// Function to apply the preset properties (when a saved preset is clicked)
function applyPreset(preset) {
  // Apply the properties from the preset
  document.querySelector('.thickness-slider').value = preset.strokeSize;
  document.querySelector('.eraser-slider').value = preset.eraserSize;
  document.querySelector('.highlight-slider').value = preset.highlightOpacity;
  document.querySelector('.font-slider').value = preset.fontSize;
  document.querySelector('.color-picker').value = preset.lineColor;
  document.querySelector('.highlight-picker').value = preset.highlightColor;

  // Activate the corresponding tool (if needed)
  activateTool(preset.tool);
}

// Example function to activate a tool based on the preset
function activateTool(tool) {
  document.querySelectorAll('.optionContainer').forEach(btn => {
    // Remove 'active' class from all buttons to reset their state
    btn.classList.remove('active');
});

// Add 'active' class to the correct tool based on the preset
switch (tool) {
    case 'draw':
        document.querySelector('.draw-btn').classList.add('active');
        break;
    case 'erase':
        document.querySelector('.erase-btn').classList.add('active');
        break;
    case 'highlight':
        document.querySelector('.highlight-btn').classList.add('active');
        break;
    case 'text':
        document.querySelector('.text-btn').classList.add('active');
        break;
    default:
        console.log('Unknown tool');
}
}

// Listen for the 'addPreset' command and trigger the savePreset function
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// if (message.command === 'addPreset') {
//     const result = savePreset();
//     console.log('heard add preset'); 
//     sendResponse(result);
// }
// });
