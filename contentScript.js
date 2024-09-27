// Retrieve the saved settings from localStorage


let sSettings = localStorage.getItem('drawingSettings'); 
let ss = JSON.parse(sSettings) || {};  // Ensure an empty object if nothing is in storage
console.log('right neow' + ss);

// Initialize settings with saved values or defaults
let isHighlightingMode = ss.isHighlightingMode || false; 
let isDrawingMode = ss.isDrawingMode || false; 
let isErasingMode = ss.isErasingMode || false; 
let eraserMode = ss.eraserMode || 'continuous'; // Default to continuous erase
let lineThickness = ss.lineThickness || 1; 
let lineColor = ss.lineColor || '#FF0000';  // Red in hex
let eraserSize = ss.eraserSize || 1; 
let fontSize = ss.fontSize || 1; 
let highlightColor = ss.highlightColor || '#00FF00';  // Green in hex
let highlightOpacity = ss.highlightOpacity || 0.15; 
let fontType = 'Arial'



let isCursorMode = false; 





initializeCanvas();


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === 'checkInjected') { 
    // Respond that the script is already injected
    sendResponse({ status: 'injected' });
  }
});



// close the window when x button pressed. 
function closeWindow(){
  chrome.windows.getCurrent((window) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      chrome.windows.remove(window.id, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    }
  });
  // Get the current window (popup) and close it. 
    chrome.windows.getCurrent((window) => {
    chrome.windows.remove(window.id);
});
}



// -------------------------------- for the text: 
let isTextMode = false;
let textInput = null;
let textX = null;
let textY = null;
let textBox = null; 

let boundingBox = null; // To hold the bounding box object

// // Function to toggle text mode
// function toggleCreateText() {
//   console.log('create text toggled'); 
//   isTextMode = true;
//   isDrawingMode = false; 
//   isErasingMode = false; 
//   isHighlightingMode = false; 
//   canvas.style.pointerEvents = isTextMode ? 'auto' : 'none';
//   ctx.globalAlpha = 1; // Reset to full opacity when drawing

//   // disabling textbox for now. 

//   if (isTextMode) {
//     canvas.addEventListener('click', handleCanvasClick);
//   } else {
//     canvas.removeEventListener('click', handleCanvasClick);

//   }
// }
// Function to toggle text mode
function toggleCreateText() {
  console.log('create text toggled'); 
  isTextMode = true;
  isDrawingMode = false; 
  isErasingMode = false; 
  isHighlightingMode = false; 
  canvas.style.pointerEvents = isTextMode ? 'auto' : 'none';
  ctx.globalAlpha = 1; // Reset to full opacity when drawing

  if (isTextMode) {
    canvas.addEventListener('click', handleCanvasClick);
  } else {
    canvas.removeEventListener('click', handleCanvasClick);
  }
}

// Function to draw text on the canvas with line breaks
function drawTextOnCanvas(text, x, y, color = 'black', maxWidth = 100) {
  ctx.font = `${fontSize}px ${fontType}`; // Use global fontSize
  ctx.fillStyle = `${lineColor}`;

  // Split the text into lines based on line breaks
  const lines = text.split('\n');
  const lineHeight = fontSize * 1.2;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const words = line.split(' ');
    let currentLine = '';

    for (let j = 0; j < words.length; j++) {
      const testLine = currentLine + words[j] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && j > 0) {
        ctx.fillText(currentLine, x, y);
        currentLine = words[j] + ' ';
        y += lineHeight;
      } else {
        currentLine = testLine;
      }
    }

    ctx.fillText(currentLine, x, y);
    y += lineHeight; // Move down for the next line
  }
}


function createTextBox(x, y) {
  const textbox = document.createElement('div');
  textbox.contentEditable = true; // Allow text editing
  textbox.classList.add('draggable-textbox');
  textbox.style.position = 'absolute';
  textbox.style.left = `${x}px`;
  textbox.style.top = `${y}px`;
  textbox.style.minWidth = '100px';
  textbox.style.height = 'auto'; // Let height adjust automatically
  textbox.style.border = '1px solid black'; // Visible border for the textbox
  textbox.style.zIndex = '9999';
  textbox.style.backgroundColor = 'transparent'; // White background for visibility
  textbox.style.color = 'black'; // Set text color to black
  textbox.style.textAlign = 'left'; // Align text to the left
  textbox.style.whiteSpace = 'nowrap'; // Prevent wrapping
  textbox.style.overflow = 'hidden'; // Hide overflow
  textbox.style.fontSize = `${fontSize}px`; 
  textbox.style.color = `${lineColor}`;
  textbox.style.fontFamily = `${fontType}`;

  // textbox.style.resize = 'none'; // Prevent manual resizing
  textbox.style.padding = '4px'; // Add some padding for better appearance
  document.body.appendChild(textbox); // Append to body

  // Focus the textbox for immediate editing
  textbox.focus();

  // Function to handle blur event
  textbox.addEventListener('blur', () => {
    // Capture text and remove any HTML tags
    const text = textbox.innerText.trim(); // Use innerText to get plain text
    if (text) {
      const finalX = parseInt(textbox.style.left);
      const finalY = parseInt(textbox.style.top) + 16; // Adjust position
      drawTextOnCanvas(text, finalX, finalY, 16, 'black', parseInt(textbox.style.width));
    }

    // Remove the textbox from the DOM
    document.body.removeChild(textbox);
  });

  // // Adjust the textbox width based on content
  // textbox.addEventListener('input', () => {
  //   const computedStyle = window.getComputedStyle(textbox);
  //   const newWidth = Math.max(100, textbox.scrollWidth + 10); // Ensure minimum width
  //   textbox.style.width = `${newWidth}px`;
    
  //   // Prevent expanding beyond the maximum allowed width
  //   const maxWidth = window.innerWidth - x - 20; // Leave some space from the right edge
  //   if (newWidth > maxWidth) {
  //     textbox.style.width = `${maxWidth}px`;
  //     textbox.style.overflow = 'auto'; // Enable overflow if it exceeds maxWidth
  //   }
  // });
}

// Function to handle canvas click
function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;  // Adjust to canvas position
  const y = event.clientY - rect.top;   // Adjust to canvas position

  if (isTextMode) {
    createTextBox(x, y);
  }
}








// Function to draw text on the canvas
function drawText(text, x, y) {
  ctx.font = `${fontSize}px ${fontType}`;
  ctx.fillStyle = lineColor; // Fixed typo: 'fillstyle' -> 'fillStyle'
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);
}








// Function to check if the mouse is inside the bounding box
function isInsideBoundingBox(mouseX, mouseY, box) {
  return (
    mouseX >= box.x &&
    mouseX <= box.x + box.width &&
    mouseY >= box.y &&
    mouseY <= box.y + box.height
  );
}







// Function to handle canvas click event for text input
// Function to handle canvas click event for text input
// Function to handle canvas click event for text input
 

// function handleCanvasClick(event) {
//   if (!textBox) { // Only create a new text box if one doesn't already exist
//     const rect = canvas.getBoundingClientRect();
//     const clickX = event.clientX - rect.left;
//     const clickY = event.clientY - rect.top;

//     // Create a new text box
//     createTextBox(clickX, clickY);
//   }
// }

// function createTextBox(x, y) {
//   // Remove existing text box if it exists
//   if (textBox) {
//     document.body.removeChild(textBox);
//   }

//   textBox = document.createElement('div');
//   textBox.style.position = 'absolute';
//   textBox.style.background = 'white';
//   textBox.style.border = '1px solid black';
//   textBox.style.padding = '5px';
//   textBox.style.zIndex = '1000';
//   textBox.style.top = `${y}px`;
//   textBox.style.left = `${x}px`;
//   textBox.style.resize = 'both';
//   textBox.style.overflow = 'auto';
//   textBox.style.minWidth = '100px';
//   textBox.style.minHeight = '30px';

//   const input = document.createElement('input');
//   input.type = 'text';
//   input.style.border = 'none';
//   input.style.outline = 'none';
//   input.style.fontSize = '16px';
//   input.style.width = '100%'; // Ensure input takes the full width

//   textBox.appendChild(input);
//   document.body.appendChild(textBox);

//   // Focus on the input
//   input.focus();

//   // Event listener for input keydown
//   input.addEventListener('keydown', (event) => {
//     if (event.key === 'Enter') {
//       event.preventDefault(); // Prevent the default behavior of Enter key
//       const text = input.value;
//       if (text) {
//         drawText(text, parseInt(textBox.style.left), parseInt(textBox.style.top));
//       }
//       document.body.removeChild(textBox);
//       textBox = null;
//     }
//   });

//   // Prevent the canvas click event from triggering
//   textBox.addEventListener('mousedown', (e) => {
//     e.stopPropagation(); // Prevent the event from reaching the canvas
//   });

//   // Make the text box draggable
//   let isDragging = false;
//   let offsetX, offsetY;

//   textBox.addEventListener('mousedown', (e) => {
//     if (e.target !== input) { // Only allow dragging if clicking outside the input
//       isDragging = true;
//       offsetX = e.clientX - textBox.getBoundingClientRect().left;
//       offsetY = e.clientY - textBox.getBoundingClientRect().top;
//       document.addEventListener('mousemove', onMouseMove);
//     }
//   });

//   document.addEventListener('mouseup', () => {
//     isDragging = false;
//     document.removeEventListener('mousemove', onMouseMove);
//   });

//   function onMouseMove(e) {
//     if (isDragging) {
//       textBox.style.left = `${e.clientX - offsetX}px`;
//       textBox.style.top = `${e.clientY - offsetY}px`;
//     }
//   }

//   // Make the text box resizable
//   const resizeHandle = document.createElement('div');
//   resizeHandle.style.width = '10px';
//   resizeHandle.style.height = '10px';
//   resizeHandle.style.background = 'black';
//   resizeHandle.style.position = 'absolute';
//   resizeHandle.style.right = '0';
//   resizeHandle.style.bottom = '0';
//   resizeHandle.style.cursor = 'nwse-resize';

//   textBox.appendChild(resizeHandle);

//   let isResizing = false;

//   resizeHandle.addEventListener('mousedown', (e) => {
//     e.stopPropagation(); // Prevent the event from reaching the canvas
//     isResizing = true;
//     document.addEventListener('mousemove', resizeTextBox);
//   });

//   document.addEventListener('mouseup', () => {
//     isResizing = false;
//     document.removeEventListener('mousemove', resizeTextBox);
//   });

//   function resizeTextBox(e) {
//     if (isResizing) {
//       const newWidth = e.clientX - textBox.getBoundingClientRect().left;
//       const newHeight = e.clientY - textBox.getBoundingClientRect().top;
//       if (newWidth > 100) textBox.style.width = `${newWidth}px`;
//       if (newHeight > 30) textBox.style.height = `${newHeight}px`;
//     }
//   }
// }

function handleKeyDown(event) {
  if (textInput) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default behavior of Enter key
      const text = textInput.value;
      if (text) {
        textInput.style.border = 'none'; 
        drawText(text, textX, textY);
      }
      document.body.removeChild(textInput);
      textInput = null;
      // Remove the event listener after use
      document.removeEventListener('keydown', handleKeyDown);
    } else if (event.key === 'Escape') {
      event.preventDefault(); // Prevent default behavior of Escape key
      document.body.removeChild(textInput);
      textInput = null;
      // Remove the event listener after use
      document.removeEventListener('keydown', handleKeyDown);
    }
  }
}




// Initialize canvas and other functions
function initializeCanvas() {
  loadSettings();
// this fixes an overwriting problem for when you open the note taker. 

  canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  updateCanvasSize();
  document.body.appendChild(canvas);
  // canvas.id = 'canvas';

  ctx = canvas.getContext('2d');
  console.log('Canvas initialized');



}





// document.getElementById('canvas').addEventListener('mousedown', function(event) {
//   event.stopPropagation();
// });



function sendSettings() {
  // let settings = localStorage.getItem('drawingSettings'); 
  // let parsedSettings = JSON.parse(settings);

  // if (parsedSettings) {
  //   chrome.runtime.sendMessage({ action: 'setSettings', data: parsedSettings }, function(response) {
  //     console.log('Settings sent from popup to content script');
  //   });
  // } else {
  //   console.log('No settings found in localStorage');
  // }
}

// setTimeout(sendSettings(), 1000)

// Get the stored drawing settings
let settings = localStorage.getItem('drawingSettings');
let parsedSettings = JSON.parse(settings);

// Retrieve all preset IDs from localStorage
let presetIds = JSON.parse(localStorage.getItem('presetIds')) || [];

// Create an array to hold all the preset data
let allPresets = [];

// Loop through preset IDs and retrieve each preset from localStorage
presetIds.forEach(presetId => {
  let presetData = localStorage.getItem(presetId); // Get preset by ID
  if (presetData) {
    allPresets.push(JSON.parse(presetData)); // Parse and push to the array
  }
});

// Send message to content script with both settings and all preset data
chrome.runtime.sendMessage({ 
  action: 'setSettings', 
  data: parsedSettings, 
  presetData: allPresets // Pass the array of presets
}, function(response) {
  console.log('Settings and presets sent from popup to content script');
});



function updateCanvasSize() {
  canvas.width = document.documentElement.scrollWidth;
  canvas.height = document.documentElement.scrollHeight;
}


// Function to clear a specific canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}




const openSitesBtn = document.querySelector('.open-sites-btn');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const linksContainer = document.getElementById('links-container');

function getAllSites(callback) {
  // Get all items from Chrome local storage
  chrome.storage.local.get(null, function(items) {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving items:", chrome.runtime.lastError);
      return;
    }

    // Array to hold sites with notes
    const sitesWithNotes = [];

    // Loop through each item in local storage
    for (const [url, note] of Object.entries(items)) {
      if (isValidUrl(url) && note) {  // Check if the key is a valid URL and has notes
        sitesWithNotes.push({ url, note });
      }
    }

    // Handle the case where there are no saved links
    if (sitesWithNotes.length === 0) {
      console.log('No saved sites with notes.');
    }

    // Call the callback function with the retrieved sites
    callback(sitesWithNotes);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === 'getAllSites') {
    getAllSites(function(sites) {
      sendResponse({ status: 'success', data: sites });
    });
    
    // Important: Return true to indicate the response will be sent asynchronously
    return true;
  }
});




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


    // delte later
    // Send a message to content script
    chrome.runtime.sendMessage({ action: 'getSettings' }, function(response) {
      console.log('Settings from content script:', response.settings);
    });


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

    ctx.globalAlpha = 1; // Reset opacity to full
    ctx.globalCompositeOperation = 'source-over'; // Reset to default mode


  } else if (isErasingMode) {
    ctx.globalAlpha = 1; // Reset to full opacity for erasing
    ctx.globalCompositeOperation = 'source-over'; // Reset to default mode

    if (eraserMode === 'continuous') {
      drawCircle(event.pageX, event.pageY, eraserSize / 2, true);
    }

    ctx.globalAlpha = 1; // Reset opacity to full
    ctx.globalCompositeOperation = 'source-over'; // Reset to default mode
  } else if (isHighlightingMode) {
    // Set global alpha to the highlight opacity
    ctx.globalAlpha = highlightOpacity; // Set highlight opacity
  
    // Use 'source-over' mode to ensure that overlapping doesn't accumulate opacity
    ctx.globalCompositeOperation = 'destination-over';
  
    if (lastX !== null && lastY !== null) {
      // Calculate the distance and angle between the current and last positions
      const distance = Math.hypot(currentX - lastX, currentY - lastY);
      const angle = Math.atan2(currentY - lastY, currentX - lastX);
  
      // Step size to space out the intermediate points to reduce overlap
      const stepSize = Math.max(0.5, lineThickness / 64);
  
      // Define rectangle dimensions for highlighter stroke effect
      const rectHeight = lineThickness * 1.5; // Highlighter stroke height
      const rectWidth = lineThickness / 2;    // Highlighter stroke width
  
      for (let i = 0; i < distance; i += stepSize) {
        const intermediateX = lastX + (i / distance) * (currentX - lastX);
        const intermediateY = lastY + (i / distance) * (currentY - lastY);
  
        // Draw a rotated rectangle for each step
        ctx.save();
        ctx.translate(intermediateX, intermediateY);
        ctx.rotate(angle); // Rotate based on the angle of the stroke
        ctx.fillStyle = highlightColor;
  
        // Draw the rectangle using 'source-over' to prevent opacity buildup
        ctx.fillRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);
        ctx.restore();
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
  
    // Update the last position to the current one for the next frame
    lastX = currentX;
    lastY = currentY;
    ctx.globalAlpha = 1; // Reset opacity to full
    ctx.globalCompositeOperation = 'source-over'; // Reset to default mode
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


  // document.addEventListener('DOMContentLoaded', function() {
  //   console.log('Popup DOM fully loaded');
  //     // random for testing
  //     let settings = localStorage.getItem('drawingSettings'); 
  //     let parsedSettings = JSON.parse(settings);
  //     chrome.runtime.sendMessage({ action: 'setSettings', data: parsedSettings }, function(response) {
  //       console.log('Settings sent from popup to content script');
  //     })
  //   // Add your initialization logic here
  // });
  





  
function toggleDrawingMode() {
  isErasingMode = false;
  isHighlightingMode = false; 
  isDrawingMode = true;
  isTextMode = false; // 
  // canvas.removeEventListener('click', handleCanvasClick); 


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
  isHighlightingMode = true;
  isDrawingMode = false;
  isErasingMode = false;
  isTextMode = false; 
  // canvas.removeEventListener('click', handleCanvasClick); 
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
  isErasingMode = true;
  isDrawingMode = false;
  isHighlightingMode = false; 
  isTextMode = false; 
  // canvas.removeEventListener('click', handleCanvasClick); 

  canvas.style.pointerEvents = isErasingMode ? 'auto' : 'none';
  if (isErasingMode) {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
  } else {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mouseup', handleMouseUp);
  }
}

// Listen for messages from popup.js
// Listen for messages from popup.js

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'removeTool') {
    let id = request.id; // The presetId you want to remove

    try {
      // Retrieve all preset IDs
      let presetIds = JSON.parse(localStorage.getItem('presetIds')) || [];
      let presetFound = false;

      // Check if the ID exists in the preset data
      for (const presetId of presetIds) {
        const preset = JSON.parse(localStorage.getItem(presetId));
        if (preset && preset.presetId === id) {
          // Remove the preset from localStorage
          localStorage.removeItem(presetId);
          presetFound = true;

          // Remove the preset ID from the presetIds array
          presetIds = presetIds.filter(pid => pid !== presetId);
          localStorage.setItem('presetIds', JSON.stringify(presetIds));

          // Check if the most recent preset ID was the one removed
          let mostRecentPresetId = localStorage.getItem('mostRecentPresetId');
          if (mostRecentPresetId === presetId && presetIds.length > 0) {
            // If it was removed, set the most recent preset to the last one in the list
            localStorage.setItem('mostRecentPresetId', presetIds[presetIds.length - 1]);
          } else if (mostRecentPresetId === presetId && presetIds.length === 0) {
            // If no presets are left, remove the most recent preset ID
            localStorage.removeItem('mostRecentPresetId');
          }

          console.log('Preset removed successfully with ID:', id);
          sendResponse({ success: true });
          break; // Exit the loop since we found and removed the preset
        }
      }

      if (!presetFound) {
        console.error('Preset ID not found:', id);
        sendResponse({ success: false, error: 'Preset ID not found' });
      }
    } catch (error) {
      console.error('Error processing the request:', error);
      sendResponse({ success: false, error });
    }

    // Return true to indicate the response will be sent asynchronously
    return true;
  }
});


window.addEventListener('resize', updateCanvasSize);

function update(){
// THIS UPDATE FUNCTION NEEDS TO SAVE THE CANVAS EACH TIME TO IT'S APPROPRIATE SPOT. 
// HOWEVER, FIRST WE NEED TO MAKE SURE THAT WE ARE SAVING THE PRESET WE ARE ON FOR EACH PAGE.

// Get the stored drawing settings
let settings = localStorage.getItem('drawingSettings');
let parsedSettings = JSON.parse(settings);

// get the saved tools. 
  // Retrieve all preset IDs from localStorage
  let presetIds = JSON.parse(localStorage.getItem('presetIds')) || [];
  let allPresets = presetIds.map(id => JSON.parse(localStorage.getItem(id)));

// Send message to content script with both settings and all preset data
chrome.runtime.sendMessage({ 
  action: 'setSettings', // also nee
  data: parsedSettings, 
  presetData: allPresets // Pass the array of presets
}, function(response) {
  console.log('Settings and tools sent from popup to content script');
});

}; 



function setCursorActive(){
  isHighlightingMode = false; 
  isDrawingMode = false; 
  isTextMode = false; 
  isErasingMode = false; 
  isDrawingMode = false; 

  if (canvas){
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseUp);
    canvas.removeEventListener('mouseup', handleMouseUp);
    // canvas.removeEventListener('click', handleCanvasClick);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.style.pointerEvents = 'none';
  }

}


// called when we click the delte presets button 
function deleteAllPresets() {
  // Retrieve the array of preset IDs from localStorage
  let presetIds = JSON.parse(localStorage.getItem('presetIds')) || [];

  // Loop through each preset ID and remove the corresponding preset from localStorage
  presetIds.forEach(presetId => {
    localStorage.removeItem(presetId);
  });

  // Clear the presetIds array and mostRecentPresetId from localStorage
  localStorage.removeItem('presetIds');
  localStorage.removeItem('mostRecentPresetId');

  console.log('All presets deleted');
}







function updateNewestPreset() {
  // Retrieve the ID of the most recent preset from localStorage
  const mostRecentPresetId = localStorage.getItem('mostRecentPresetId'); 
  // Check if the ID exists
  if (mostRecentPresetId) {
    const preset = localStorage.getItem(mostRecentPresetId); 
    // Check if the preset exists
    if (preset) {
      const presetParsed = JSON.parse(preset);
      chrome.runtime.sendMessage({ action: 'presetTool', data: presetParsed }, function(response) {
        console.log('Preset sent from popup to content script');
      });
    } else {
      console.error('Preset not found for ID:', mostRecentPresetId);
    }
  } else {
    console.error('Most recent preset ID not found in localStorage.');
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === 'toggleDrawing') {
    toggleDrawingMode();
    saveSettings(); 
    sendSettings(); 
    // update();
    sendResponse({ status: 'success' });

  } else if (message.command === 'applySettings') {
    console.log('applyingSetting'); 
    loadSettings(); 
    sendResponse({ status: 'success' });

  } else if (message.command === 'toggleErasing') {
    toggleErasingMode();
    saveSettings(); 
    sendSettings(); 
    update();
    sendResponse({ status: 'success' });

  } else if (message.command === 'createText') {
    // lineColor = message.value; 
    toggleCreateText();
    saveSettings(); 
    sendSettings(); 
    update();
    sendResponse({ status: 'success' });

  } else if (message.command === 'setLineThickness') {
    lineThickness = message.value;
    saveSettings(); 
    sendSettings(); 
    update();
    sendResponse({ status: 'success' });

  } else if (message.command === 'deleteTools') {
    
    deleteAllPresets(); 
    update(); // 

  }
  
  
  else if (message.command === 'font') {
    fontType = message.value;
    saveSettings(); 
    sendSettings(); 
    sendResponse({ status: 'success' });
    update();
   }
  
  else if (message.command === 'setEraserSize') {
    eraserSize = message.value;
    saveSettings(); 
    sendSettings(); 
    update();

    sendResponse({ status: 'success' });

  } else if (message.command === 'setFontSize') {
    fontSize = message.value;
    saveSettings(); 
    sendSettings(); 
    update();
    sendResponse({ status: 'success' });

  } else if (message.command === 'getLinks') {
    getLinks();

  } else if (message.command === 'setLineColor') {
    lineColor = message.value;
    console.log('setting line color'); 
    saveSettings(); 
    sendSettings(); 
    update();
    sendResponse({ status: 'success' });

  } else if (message.command === 'cursorActive') {
    setCursorActive(); 

  } else if (message.command === 'getAllSites') {
    getAllSites(function(sites) {
      sendResponse({ status: 'success', data: sites });
    });
  
    // Important: Return true to indicate the response will be sent asynchronously
    return true;
  }
  
  
  else if (message.command === 'clearCanvas') {
    saveLink()
    clearCanvas(); 
    saveSettings(); 
    let lastOpenedPreset = Number(localStorage.getItem('lastOpenedPreset'));
    saveCanvasState(lastOpenedPreset); 

    sendSettings(); 
    sendResponse({ status: 'success' });

  } else if (message.command === 'takeScreenshot') {
    takeScreenshot(); 
    saveSettings(); 
    sendSettings(); 

    sendResponse({status: 'success'}); 

  }  else if (message.command === 'setHighlightColor') {
    highlightColor = message.value; 
    sendResponse({status: 'success'}); 

  } else if (message.command === 'highlight') {
    toggleHighlightingMode(); 
    saveSettings(); 
    sendSettings(); 
    update();


    sendResponse({status: 'success'}); 

  } else if (message.command === 'savePresetSettings'){

      let s = message.value; // object of settings. 

      isHighlightingMode = s.isHighlightingMode;
      isDrawingMode = s.isDrawingMode;
      isErasingMode = s.isErasingMode
      eraserMode = s.eraserMode
      lineThickness = s.lineThickness
      lineColor = s.lineColor; 
      eraserSize = s.eraserSize
      fontSize = s.fontSize
      highlightColor = s.highlightColor
      highlightOpacity = s.highlightOpacity

    saveSettings(); 
    update(); 
  }
  
  
  else if (message.command === 'restore') { // don't think I use this anymore...
      let setPresetSettings = message.value; // an object

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

    sendResponse({status: 'success'});

  }  else if (message.command === 'note1') {



    saveSettings(); 
    // saveCanvasState(2); 
    restoreCanvasState(1);
    sendResponse({status: 'success'});
    update();

  }  else if (message.command === 'note2') {
    // saveSettings(); 
    // saveCanvasState(1); 
    restoreCanvasState(2);
    sendResponse({status: 'success'});
    update();

  } else if (message.command === 'pageOpened') {
    saveSettings(); 

    let lastOpenedPreset = Number(localStorage.getItem('lastOpenedPreset'));
    if(lastOpenedPreset){
      // also want to load 
      // let otherPreset = 1; 
      // if (lastOpenedPreset === 1){otherPreset = 2}

      // saveCanvasState(otherPreset); 
      restoreCanvasState(lastOpenedPreset);
      chrome.runtime.sendMessage({ action: 'presetReopened', activePreset: lastOpenedPreset });
    }

    update();
    sendResponse({status: 'success'});
  }
  
  else if (message.command === 'addPreset') {
    let presetId = createPreset(); 
    updateNewestPreset(); // send a message back to popup.js (contains newest settings. )
    sendResponse({status: 'success', value: presetId});
  }
  
  else if (message.command === 'setHighlightOpacity') {
    highlightOpacity = message.value;
    saveSettings();
    sendSettings();
    update();
    sendResponse({ status: 'success' });

  } else if (message.command === 'closeWindow') {
    closeWindow(); 
    sendResponse({ status: 'success'});
  }
});


// Function to save the current website's link and note to localStorage
function saveLink(note = '') {
  const currentLink = window.location.href;  // Get the current URL

  // Retrieve the existing links from localStorage or initialize an empty array if none exist
  let savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];

  // Check if the current link is already in the array (based on URL)
  let linkExists = savedLinks.some(linkObj => linkObj.url === currentLink);

  if (!linkExists) {
    // Add the new link as an object with url and note to the array
    savedLinks.push({ url: currentLink, note: note });

    // Save the updated array to localStorage
    localStorage.setItem('savedLinks', JSON.stringify(savedLinks));
    console.log('Link saved:', currentLink);
  } else {
    console.log('Link already saved:', currentLink);
  }
}


// Function to get all saved links from localStorage and send them to popup.js
function getLinks() {
  // Retrieve the saved links from localStorage
  let savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];
  
  // Log for debugging
  if (savedLinks.length === 0) {
    console.log('No saved links found.');
  } else {
    console.log('Saved links:', savedLinks);
  }

  // Send the savedLinks to popup.js
  chrome.runtime.sendMessage({ command: 'sendLinks', links: savedLinks });
}





function createPreset() {
  // Generate a unique ID for the preset
  const presetId = `presetTool_${Date.now()}`;

  // Define the preset object
  const preset = {
    isHighlightingMode,
    isDrawingMode,
    isErasingMode,
    isTextMode,
    eraserMode,
    lineThickness,
    lineColor,
    eraserSize,
    fontSize,
    highlightColor,
    highlightOpacity,
    fontType,
    presetId
  };

  // Store the preset in localStorage with the unique ID
  localStorage.setItem(presetId, JSON.stringify(preset));
  console.log('Settings saved with ID:', presetId);

  // Retrieve existing preset IDs from localStorage
  let presetIds = JSON.parse(localStorage.getItem('presetIds')) || [];

  // Add the new preset ID to the list
  presetIds.push(presetId);
  localStorage.setItem('presetIds', JSON.stringify(presetIds));

  // Store the ID of the most recent preset
  localStorage.setItem('mostRecentPresetId', presetId);

  return presetId; // Return the ID of the stored preset
}



  // ---------------------------------------------------- for taking a screenshot: 

  // this uses an api for taking screenshots of the page. // asks for permission...
  async function takeScreenshot() {

    window.print(); 

    // try {
    //   const captureStream = await navigator.mediaDevices.getDisplayMedia({
    //     video: {
    //       mediaSource: 'screen'
    //     }
    //   });
  
    //   // Create a video element to hold the captured stream
    //   const video = document.createElement('video');
    //   video.srcObject = captureStream;
    //   video.play();
  
    //   // Wait for the video to be ready
    //   video.onloadedmetadata = async () => {
    //     // Create a canvas to draw the screen capture
    //     const canvas = document.createElement('canvas');
    //     canvas.width = video.videoWidth;
    //     canvas.height = video.videoHeight;
  
    //     const ctx = canvas.getContext('2d');
    //     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    //     // Stop capturing the screen once we have the image
    //     const tracks = captureStream.getTracks();
    //     tracks.forEach(track => track.stop());
  
    //     // Convert canvas to image and download it
    //     const link = document.createElement('a');
    //     link.href = canvas.toDataURL('image/png');
    //     link.download = 'screenshot.png';
    //     link.click();
    //   };
    // } catch (err) {
    //   console.error('Error capturing screen:', err);
    // }
  }


//   document.getElementById('canvas').addEventListener('mousedown', function(event) {
//     event.stopPropagation();
// });


  // saving settings --------------------------------

  function saveSettings() {

    // every time that we make a change to the canvas it saves the preset we are working on currently. (autoupdate)
    let lastOpenedPreset = Number(localStorage.getItem('lastOpenedPreset'));
    saveCanvasState(lastOpenedPreset); 


    // toggleCreateText(); // does get called, meaning we know that saveSettings is being called. 
    const settings = {
      isHighlightingMode,
      isDrawingMode,
      isErasingMode,
      isTextMode,
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

// This function saves the current page's URL with an associated note
function saveSiteWithNote() {
  console.log("Trying to save site with note...");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (chrome.runtime.lastError) {
      console.error("Error querying tabs:", chrome.runtime.lastError);
      return;
    }

    const activeTab = tabs[0];
    if (!activeTab) {
      console.error("No active tab found.");
      return;
    }
    
    const url = activeTab.url;
    const note = 'This is a note for ' + url; // Replace with actual user input

    // Store the URL as the key and the note as the value
    let siteData = {};
    siteData[url] = note;

    // Save to local storage
    chrome.storage.local.set(siteData, function () {
      if (chrome.runtime.lastError) {
        console.error("Error saving data:", chrome.runtime.lastError);
      } else {
        console.log("Saved:", url, note);
      }
    });
  });
}

// Call this function to save a site and note
// saveSiteWithNote();






  
  function loadSettings() {
        chrome.runtime.sendMessage({ action: 'getSettings' });
}

// // no need for the currently active canvas because it's saved in the ctx variable... duh. 
// function clearCanvas(activeCanvasNumber){
//   // // ctx.clearRect(0, 0, canvas.width, canvas.height);
//   // // const canvas = document.createElement('canvas');
//   // const dataURL = canvas.toDataURL(); // Get the data URL of the canvas
//   // if(activeCanvasNumber === 1 && canvas && ctx){
//   //   storage.local.setItem('canvasState1', dataURL); 
//   //   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   // } else if(activeCanvasNumber === 2 && canvas && ctx){
//   //   storage.local.setItem('canvasState2', dataURL); 
//   // }
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   // this single line should work because it's accessing the current canvas, clearing it, 
//   // and then when they go to switch canvases it swaps to the new canvas. (assuming it's not empty)

// }

  // saving and retrieving canvas: 

// Save the canvas state to a specific slot (1 or 2)
// Save the canvas state to a specific slot (1 or 2)
function saveCanvasState(slot) {
  if (canvas && ctx) {
    const dataURL = canvas.toDataURL(); // Get the data URL of the canvas

    // Check if the canvas is empty

    // by removing this, when we clear a canvas we are allowing the empty canvas to save itself, so that wehn 
    // you reopen the extension the canvas doesn't reappear again. 

    // if (isCanvasEmpty(canvas)) {
    //   console.log('Canvas is empty, not saving to slot', slot);
    //   return;
    // }


    // Save to the specific slot
    if (slot === 1) {
      localStorage.setItem('canvasState1', dataURL); // Save to Slot 1
      localStorage.setItem('lastOpenedPreset', '1'); 
      console.log('Canvas state saved to Slot 1');
    } else if (slot === 2) {
      localStorage.setItem('canvasState2', dataURL); // Save to Slot 2
      localStorage.setItem('lastOpenedPreset', '2'); 
      console.log('Canvas state saved to Slot 2');
    }
  } else {
    console.log('Canvas or context not available');
  }
}

// // Check if the canvas is empty
// function isCanvasEmpty(canvas) {
//   const ctx = canvas.getContext('2d', { willReadFrequently: true });
//   const width = canvas.width;
//   const height = canvas.height;

//   // Get the pixel data from the canvas
//   const imageData = ctx.getImageData(0, 0, width, height);
//   const pixels = imageData.data;

//   // Check if all pixels are transparent (empty canvas)
//   for (let i = 0; i < pixels.length; i += 4) {
//     if (pixels[i + 3] > 0) { // Check alpha channel
//       return false; // Canvas is not empty
//     }
//   }

//   return true; // Canvas is empty
// }




// Restore the canvas state from a specific slot (1 or 2)
function restoreCanvasState(slot) {
  let dataURL;
  
  // Retrieve from the specific slot
  if (slot === 1) {
      localStorage.setItem('lastOpenedPreset', '1'); 
      dataURL = localStorage.getItem('canvasState1');
  } else if (slot === 2) {
      localStorage.setItem('lastOpenedPreset', '2'); 
      dataURL = localStorage.getItem('canvasState2');
  }
  
  if (dataURL && canvas && ctx) {
      const img = new Image();
      img.onload = function() {
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear existing content
          ctx.drawImage(img, 0, 0); // Draw the saved image onto the canvas
      };
      img.src = dataURL;
      console.log(`Canvas restored from Slot ${slot}`);

      // attempt to fix eraser bug
      ctx.globalAlpha = 1; // Reset to full opacity for erasing
      ctx.globalCompositeOperation = 'source-over'; // Reset to default mode
  } else {
      console.log(`No saved canvas state found in Slot ${slot} or canvas/context not available`);
  }
}

