// saving work: 

// git add .
// git commit -m "features additions and style changes"
// git push origin master

let isDrawingMode = false;
let isErasingMode = false;
let isHighlightingMode = false; 
let isCreatingText = false; 
let isCursor = false; 
// const popupWindow = window.open('https://your-url.com', 'popup', 'width=400,height=400');

// necessary to connect my content script and interact with the chrome's dom. 
chrome.runtime.sendMessage({ command: 'injectScript' }, (response) => {
  // attempting to injec
  console.log('attempting to inject script // popup has opened'); 
  if (response.status === 'success') {
    console.log('script injected'); 
  }
});

// // cursors: 
// // const pencilCursor = chrome.runtime.getURL('./Assets/pencilImg.png'); // Update this path
// function setCustomCursor(cursorType) {
//   const style = document.createElement('style');
//   style.textContent = `
//     body {
//       cursor: url(${cursorType}), auto;
//     }
//   `;
//   document.head.appendChild(style);
// }

// // Call this function with your cursor image
// const cursorImageUrl = chrome.runtime.getURL('./Assets/marker.png');
// setCustomCursor(cursorImageUrl);

// Get elements
const drawBtn = document.querySelector('.draw-btn');
const eraseBtn = document.querySelector('.erase-btn');
const clearBtn = document.querySelector('.clear-btn'); 
const thicknessSlider = document.querySelector('.thickness-slider');
const eraserSlider = document.querySelector('.eraser-slider'); 
const fontSlider = document.querySelector('.font-slider'); 
const colorPicker = document.querySelector('.color-picker');
const screenshotButton = document.querySelector('.screenshot-btn'); 
const highlightButton = document.querySelector('.highlight-btn'); 
const highlightColorPicker = document.querySelector('.highlight-picker'); 
const highlightOpacitySlider = document.querySelector('.highlight-slider'); 
const textBtn = document.querySelector('.text-btn'); 
const closeWindowBtn = document.querySelector('.close-btn'); 
// const minimizeBtn = document.querySelector('.minimize-btn'); 
const containingDiv = document.querySelector('.popup-container'); 
const popupContentDiv = document.querySelector('.popup-content'); 
const restoreNotes = document.querySelector('.restore-notes-btn'); 
const presetBtn = document.querySelector('.preset-btn'); 
const saveNotesBtn = document.querySelector('.save-notes-btn'); 
const saveNotesBtn2 = document.querySelector('.save-notes-btn2'); 
const fontType = document.querySelector('#font-type'); 
const cursorBtn = document.querySelector('.cursor-btn'); 
const deleteAllTools = document.querySelector('.delete-tools-btn')

let settingsFromStorage; 



// this is necessary.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'setSettings') {
    retrieveSettings(request.data); 
    displayAllPresets(request.presetData); 
    console.log('retreiving settings rn'); 
  }
});

// load settings. 
document.addEventListener('DOMContentLoaded', () => {
  console.log('dom loaded'); 

  chrome.runtime.sendMessage({ command: 'injectScript' }, (response) => {
    if (response.status === 'success') {
      console.log('script injected'); 

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { command: 'pageOpened'});
      });

      
    } else if(response.status === 'alreadyInjected') {
      console.log('script already injected from - popup.js dom listenser')
      // here is where we will populate stuff etc. This is 
      console.log('displaying All Presets'); 
      // open the last open preset: 
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { command: 'pageOpened'});
      });
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'presetReopened') {
          const activePreset = message.activePreset;
          if (activePreset === 1) {
            saveNotesBtn.classList.add('on');
            saveNotesBtn2.classList.remove('on');
          } else if (activePreset === 2) {
            saveNotesBtn2.classList.add('on');
            saveNotesBtn.classList.remove('on');
          }
        }
      });


    }

  });


  // to the browser in chrome. 

});

// popup.js (your popup script)
closeWindowBtn.addEventListener("click", () => {
  window.close(); 
});


// a timer on retrieving. 
// setTimeout(retrieveSettings(), 10000);

function retrieveSettings(settings) {
  console.log('retrieveSettings called'); 
  console.log('settings'); 


  // Instead of retrieving from localStorage, use the settings passed from the message
  if (settings) {
    // isHighlightingMode = false; 
    // isDrawingMode = false; 
    // isErasingMode = false; 
    // isCursorMode = false; 
    // isTextMode = false; 

    // highlightButton.classList.remove('active', settings.isHighlightingMode);
    // drawBtn.classList.remove('active', settings.isDrawingMode);
    // eraseBtn.classList.remove('active', settings.isErasingMode);
    // textBtn.classList.remove('active', settings.isTextMode);
    // cursorBtn.classList.remove('active', settings.isCursorMode);


    console.log('Hooray, settings received:', settings); 

    // Update all the HTML components based on the settings received
    if (settings.isHighlightingMode !== undefined) {
      isHighlightingMode = true; 
   
      highlightButton.classList.toggle('active', settings.isHighlightingMode);
    }

    if (settings.isDrawingMode !== undefined) {
      isDrawingMode = true; 
    
      drawBtn.classList.toggle('active', settings.isDrawingMode);
    }

    if (settings.isErasingMode !== undefined) {
      isErasingMode = true; 

      eraseBtn.classList.toggle('active', settings.isErasingMode);
    }     

    if (settings.isTextMode !== undefined) {
      isTextMode = true; 
 
      textBtn.classList.toggle('active', settings.isTextMode);
    }

    if (settings.lineThickness !== undefined) {
      thicknessSlider.value = settings.lineThickness;
      const thicknessValue = document.getElementById('thicknessValue');
      thicknessValue.textContent = settings.lineThickness; 

      // set the value here. 
    }

    if (settings.highlightOpacity !== undefined) {
      highlightOpacitySlider.value = settings.highlightOpacity;
      const highlightValue = document.getElementById('highlightValue');
      highlightValue.textContent = settings.highlightOpacity; 

      // set the value here. 
    }


    if (settings.eraserSize !== undefined) {
      eraserSlider.value = settings.eraserSize;
      const eraserValue = document.getElementById('eraserValue');
      eraserValue.textContent = settings.eraserSize; 
    }

    if (settings.fontSize !== undefined) {
      fontSlider.value = settings.fontSize;
      const fontValue = document.getElementById('fontValue');
      fontValue.textContent = settings.fontSize; 
    }

    if (settings.fontType !== undefined) {
      // fontType.value = settings.fontType;
      const fontType = document.getElementById('font-type');
      fontType.value = settings.fontType; 
    }

    if (settings.lineColor !== undefined) {
      colorPicker.value = settings.lineColor;
    }

    if (settings.highlightColor !== undefined) {
      highlightColorPicker.value = settings.highlightColor;
    }

    if (settings.highlightOpacity !== undefined) {
      highlightOpacitySlider.value = settings.highlightOpacity;
      const highlightValue = document.getElementById('highlightValue');
      highlightValue.value = settings.highlightOpacity; 
    }

    console.log('Settings restored from message.');
  } else {
    console.log('No settings received.');
  }
}



// popup.js
// chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
//   const parsedSettings = JSON.parse(response.settings);

//   document.querySelector('.thickness-slider').value = parsedSettings.lineThickness || 10;
//   document.querySelector('.eraser-slider').value = parsedSettings.eraserSize || 10;
//   document.querySelector('.highlight-slider').value = parsedSettings.highlightOpacity || 0.5;
//   document.querySelector('.font-slider').value = parsedSettings.fontSize || 10;
//   document.querySelector('.color-picker').value = parsedSettings.lineColor || '#000000';
//   document.querySelector('.highlight-picker').value = parsedSettings.highlightColor || '#FFFF00';
// });




// minimizeBtn.addEventListener('click', function () {
//   if( popupContentDiv.style.display === 'none'){
//     popupContentDiv.style.display = 'flex'; // show content.
//   } else {
//     popupContentDiv.style.display = 'none' // remove it. 
//   }

// })

// Toggle drawing mode
drawBtn.addEventListener('click', function () {
  isDrawingMode = true;
  isErasingMode = false;
  isHighlightingMode = false; 
  isCreatingText = false; 
  isCursor = false; 

  if (isDrawingMode) {
    // setCustomCursor(chrome.runtime.getURL('./Assets/pencil.png'));
    drawBtn.classList.add('active');
    eraseBtn.classList.remove('active');
    highlightButton.classList.remove('active'); 
    textBtn.classList.remove('active');
    cursorBtn.classList.remove('active');


    // chrome.runtime.sendMessage({ command: 'injectScript' }, (response) => {
    //   if (response.status === 'success') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'toggleDrawing' });
      //   });
      // }
    });
  } else {
    drawBtn.classList.remove('active');
  }
});


// Toggle highlight mode
highlightButton.addEventListener('click', function () {
  console.log('calledHighlight'); 
  isDrawingMode = false;
  isErasingMode = false;
  isHighlightingMode = true; 
  isCreatingText = false; 
  isCursor = false; 

  if (isHighlightingMode) {
    eraseBtn.classList.remove('active');
    drawBtn.classList.remove('active');
    highlightButton.classList.add('active'); 
    textBtn.classList.remove('active');
    cursorBtn.classList.remove('active'); 

    // tell the content script we want to highlight. 
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'highlight' });

    });
  } else {
    highlightButton.classList.remove('active');
  }
});


// Toggle erasing mode
eraseBtn.addEventListener('click', function () {
  isDrawingMode = false;
  isErasingMode = true;
  isHighlightingMode = false; 
  isCreatingText = false; 
  isCursor = false; 


  if (isErasingMode) {
    eraseBtn.classList.add('active');
    drawBtn.classList.remove('active');
    highlightButton.classList.remove('active'); 
    textBtn.classList.remove('active');
    cursorBtn.classList.remove('active'); 

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'toggleErasing' });

    });
  } else {
    eraseBtn.classList.remove('active');
  }
});


// Toggle text mode
textBtn.addEventListener('click', function () {
  isDrawingMode = false;
  isErasingMode = false;
  isHighlightingMode = false; 
  isCreatingText = true; 
  isCursor = false; 

  if (isCreatingText) {
    eraseBtn.classList.remove('active');
    drawBtn.classList.remove('active');
    highlightButton.classList.remove('active'); 
    textBtn.classList.add('active');
    cursorBtn.classList.remove('active'); 

    const colorValue = colorPicker.value; 
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'createText'});

    });
  } else {
    textBtn.classList.remove('active');
  }
});




chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'restore' && message.preset === 1) {
      // Handle the message (e.g., update UI or state)
      console.log('Preset 1 is active.');
      saveNotesBtn.classList.add('on'); 
      saveNotesBtn2.classList.remove('on'); 
      // Perform actions in popup.js based on the message
  }
});



function displayAllPresets(presetData) {
  console.log('Received preset data:', presetData);

  // Get the container where you want to display the presets
  let savedPresetsDiv = document.getElementById('savedPresets');

  // Clear the existing presets from the container
  savedPresetsDiv.innerHTML = '';
  // Loop through the presetData array and create buttons for each preset
  presetData.forEach(preset => {
    console.log('This is the preset Data:', preset); 

    if (preset) {
      let lineColor = preset.lineColor; // Extract lineColor from preset data
      let toolImgSrc; // Variable to hold the image source URL

      // Create a new button element for the preset
      let tool = document.createElement('button');
      tool.className = 'preset-btn'; // Set classes
      tool.title = 'Save tool'; // Set title
      tool.style.backgroundColor = preset.lineColor;  

      // Create and add an image element to the button
      let toolImg = document.createElement('img');

      // Determine the image source based on the mode
      if (preset.isHighlightingMode) {
        toolImgSrc = './Assets/marker.png';
        tool.style.backgroundColor = preset.highlightColor;
      } else if (preset.isDrawingMode) {
        toolImgSrc = './Assets/pencilImg.png';
        tool.style.backgroundColor = lineColor; // Apply lineColor as the background color
      } else if (preset.isErasingMode) {
        toolImgSrc = './Assets/eraser.png';
        tool.style.backgroundColor = 'white'; // Set to white for eraser mode
      } else if (preset.isTextMode) {
        toolImgSrc = './Assets/text.png';
        tool.style.backgroundColor = lineColor; // Set to white for eraser mode
      }

      toolImg.src = toolImgSrc; // Set image source based on mode
      toolImg.className = 'setttingImg'; // Set image class
      tool.appendChild(toolImg);

      // Set a custom data attribute to store the settings
      tool.dataset.settings = JSON.stringify(preset);

      // Add event listener to apply the preset settings when the button is clicked
      tool.addEventListener('click', function() {
        // Apply the settings here
        let settings = JSON.parse(this.dataset.settings);
        retrieveSettings(settings); // Custom function to apply the preset settings

        // Send message to content script to apply preset settings
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { command: 'savePresetSettings', value: settings });
        });

        console.log('Preset applied:', settings);
      });

      // Append the tool button to the container
      savedPresetsDiv.appendChild(tool);
    }
  });
}

// Call `update` function to ensure presets are retrieved and displayed
// update();



 function update(){
  console.log('update function called')
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'setSettings') {
      
      retrieveSettings(request.data); 
      if(presetData){
        displayAllPresets(presetData.allPresets); 
      }
      console.log('retreiving settings hereeeeee')
    }
  });
 }



// Handle line thickness changes
thicknessSlider.addEventListener('change', (event) => {
  const thicknessValue = event.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'setLineThickness', value: thicknessValue });
  });
  update(); 

});

// Handle eraser size changes
eraserSlider.addEventListener('change', (event) => {
  const eraserValue = event.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'setEraserSize', value: eraserValue });
  });
  update(); 

});

// Handle eraser size changes
highlightOpacitySlider.addEventListener('change', (event) => {
  retrieveSettings(); 
  const highlightOpacity = event.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'setHighlightOpacity', value: highlightOpacity });
  });
  update(); 

});

fontSlider.addEventListener('change', (event) => {
  const fontSize = event.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'setFontSize', value: fontSize });
  });
  update(); 

});

// Handle color picker changes
colorPicker.addEventListener('input', (event) => {
  const colorValue = event.target.value; // gets the color value
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	// destination tab and message object 
    chrome.tabs.sendMessage(tabs[0].id, { command: 'setLineColor', value: colorValue });
  });
  update(); 

});


highlightColorPicker.addEventListener('input', (event) => {
  const colorValue = event.target.value; // gets the color value
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	// destination tab and message object 
    chrome.tabs.sendMessage(tabs[0].id, { command: 'setHighlightColor', value: colorValue });
  });
  update(); 

});


// Clear canvas button
fontType.addEventListener('blur', () => {
  const font = fontType.value
  console.log(font + 'is the selected font'); 
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'font', value: font });
  });
});

// // Add text button
// textBtn.addEventListener('click', () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const colorValue = colorPicker.value // gets the color value
//     chrome.tabs.sendMessage(tabs[0].id, { command: 'createText', value: colorValue });
//   });
// });

// take screenshot button
screenshotButton.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'takeScreenshot' });
  });
});

deleteAllTools.addEventListener('click', () => {
  console.log('deleteTools has been called yo!'); 
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'deleteTools' });
  });
});


// clear canvas button
clearBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // let currentCanvas = getActiveCanvas(); // get the active canvas to be removed. 
    chrome.tabs.sendMessage(tabs[0].id, { command: 'clearCanvas'}); 
  });
  update(); 
});

// clear canvas button
cursorBtn.addEventListener('click', () => {
      // let currentCanvas = getActiveCanvas(); // get the active canvas to be removed. 
      isDrawingMode = false;
      isErasingMode = false;
      isHighlightingMode = false; 
      isCreatingText = false; 
      isCursor = true; 
  
      eraseBtn.classList.remove('active');
      drawBtn.classList.remove('active');
      highlightButton.classList.remove('active'); 
      textBtn.classList.remove('active');
      cursorBtn.classList.add('active');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'cursorActive'}); 
  });
});




// close window button
closeWindowBtn.addEventListener('click', () => {
  console.log('close window called'); 
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'closeWindow' });
  });
});


// add preset tool 
presetBtn.addEventListener('click', () => {
  // otherwise there is no valid preset to copy. 
  if(isDrawingMode || isErasingMode || isCreatingText || isHighlightingMode){
    console.log('create preset called'); 
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { command: 'addPreset' });
    });
    createPreset(); 
  }
});

// restore notes button
saveNotesBtn.addEventListener('click', () => {
  console.log('saving notes')
  saveNotesBtn.classList.add('on'); 
  saveNotesBtn2.classList.remove('on'); 
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'note1'});
  });
});

// restore notes button
saveNotesBtn2.addEventListener('click', () => {
  console.log('saving notes 2')
  saveNotesBtn2.classList.add('on'); 
  saveNotesBtn.classList.remove('on'); 
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'note2'});
  });
});

function getActiveCanvas() {
  // Get the button element
  const saveNotesBtn2 = document.getElementById('saveNotesBtn2');

  // Check if the button has the class 'on'
  if (saveNotesBtn2.classList.contains('on')) {
    return 1; // Return 1 if the class 'on' is present
  } else {
    return 2; // Return 2 if the class 'on' is not present
  }
}



// Flag to check if the listener has been added

let listenerAdded = false; 

function createPreset(presetId) {
  if (!listenerAdded) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'presetTool') {
        let settings = request.data;
        let lineColor = settings.lineColor;
        let toolImgSrc;

        // Create the preset button
        let tool = document.createElement('button'); 
        tool.className = 'preset-btn';
        tool.title = 'Save tool';
        // tool.id = presetId;


        // Create and add an image element to the button
        let toolImg = document.createElement('img');
        if (settings.isHighlightingMode) {
          toolImgSrc = './Assets/marker.png';
          tool.style.backgroundColor = settings.highlightColor;
        } else if (settings.isDrawingMode) {
          toolImgSrc = './Assets/pencilImg.png';
          tool.style.backgroundColor = lineColor;
        } else if (settings.isErasingMode) {
          toolImgSrc = './Assets/eraser.png';
          tool.style.backgroundColor = 'white';
        } else if (settings.isTextMode) {
          toolImgSrc = './Assets/text.png';
          tool.style.backgroundColor = lineColor;
        }

        toolImg.src = toolImgSrc;
        toolImg.className = 'setttingImg';
        tool.appendChild(toolImg);

        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.style.backgroundColor = 'red';
        deleteButton.style.color = 'white';
        deleteButton.style.width = '20px';
        deleteButton.style.height = '20px';
        deleteButton.style.position = 'relative';
        deleteButton.style.top = '5px';
        deleteButton.style.right = '5px';
        deleteButton.style.borderRadius = '50%';
        deleteButton.style.border = 'none';
        deleteButton.style.fontSize = '12px';
        deleteButton.style.zIndex = '99999999'

        // deleteButton.addEventListener('click', () => {
        //   document.getElementById('savedPresets').removeChild(tool);

        //   chrome.runtime.sendMessage({
        //     action: 'removeTool',
        //     id: presetId,
        //     settings: settings
        //   }, (response) => {
        //     console.log(response); 
        //   });
        // });

        // tool.appendChild(deleteButton);

        tool.dataset.settings = JSON.stringify(settings);

        tool.addEventListener('click', function() {
          let settings = JSON.parse(this.dataset.settings);
          retrieveSettings(settings);
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { command: 'savePresetSettings', value: settings });
          });
        });

        document.getElementById('savedPresets').appendChild(tool);

        console.log('Preset button created and added');
      }
    });

    listenerAdded = true;
  }
}





// select eraser option: 
const eraserModeSelect = document.querySelector('.eraser-mode-select');

function getCurrentTool() {
  console.log(' in get tool'); 
  // Return the currently selected tool (based on your app's current state)
  // For example, if a draw button is active, return 'draw'
  if (drawBtn.classList.contains('active')) return 'draw';

  if (eraseBtn.classList.contains('active')) return 'erase';

  if (highlightButton.classList.contains('active')) return 'highlight';

  if (textBtn.classList.contains('active')) return 'text';

  return 'none'; // Default fallback
}



// to apply a cursor to each tool: 

document.querySelector('.draw-btn').addEventListener('click', () => {
  console.log('clicked')
  chrome.runtime.sendMessage({ action: 'changeCursor', cursorType: './Assets/pencilImg.png' });
});
console.log('clicked')

document.querySelector('.erase-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'changeCursor', cursorType: './Assets/erasor.png' });
});
console.log('clicked')

document.querySelector('.highlight-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'changeCursor', cursorType: '/Assets/marker.png' });
});

document.querySelector('.theme-btn').addEventListener('click', function() {
  console.log('light theme')
  document.body.classList.toggle('light-theme');
});


// Function to update slider values dynamically
document.addEventListener('DOMContentLoaded', () => {
  const thicknessSlider = document.getElementById('thicknessSlider');
  const thicknessValue = document.getElementById('thicknessValue');
  
  const eraserSlider = document.getElementById('eraserSlider');
  const eraserValue = document.getElementById('eraserValue');
  
  const highlightSlider = document.getElementById('highlightSlider');
  const highlightValue = document.getElementById('highlightValue');
  
  const fontSlider = document.getElementById('fontSlider');
  const fontValue = document.getElementById('fontValue');
  
  // Update value display for stroke size
  thicknessSlider.addEventListener('input', function() {
    thicknessValue.textContent = this.value;
  });
  
  // Update value display for eraser size
  eraserSlider.addEventListener('input', function() {
    eraserValue.textContent = this.value;
  });
  
  // Update value display for highlight opacity
  highlightSlider.addEventListener('input', function() {
    highlightValue.textContent = this.value;
  });
  
  // Update value display for font size
  fontSlider.addEventListener('input', function() {
    fontValue.textContent = this.value;
  });
});








// sidebar website links --------------------

// Elements
const openSitesBtn = document.querySelector('.open-sites-btn');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const linksContainer = document.getElementById('links-container');

// Event Listener to open the sidebar
openSitesBtn.addEventListener('click', function() {
  loadLinksFromStorage();  // Load links and notes
  sidebar.classList.add('open');  // Open sidebar
});

// Event Listener to close the sidebar
closeSidebarBtn.addEventListener('click', function() {
  sidebar.classList.remove('open');  // Close sidebar
});

// Function to request links from contentScript.js and load them into the sidebar
function loadLinksFromStorage() {
// Listen for messages from contentScript.js or background.js

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { command: 'getLinks', value: fontSize });
});

}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.command === 'sendLinks') {
    const savedLinks = message.links;
    console.log('in send links inpopup. ')
    // Now you can use the savedLinks in popup.js
    if (savedLinks.length === 0) {
      linksContainer.innerHTML = '<p>No saved links found.</p>';
    } else {
      linksContainer.innerHTML = '';
      savedLinks.forEach((link) => {
        // Create a dropdown or display the links however you want
        const dropdown = createDropdown(link.url, link.note || 'No note');
        linksContainer.appendChild(dropdown);
      });
    }
  }
});



// Create dropdown for a site and its note
function createDropdown(url, note) {
  const dropdown = document.createElement('div');  // You can style this according to your needs
  dropdown.textContent = `Site: ${url}, Note: ${note}`;
  dropdown.classList.add('dropdown-item');  // You can style it using this class

  dropdown.addEventListener('click', () => {
    // Open the saved link in a new tab
    chrome.tabs.create({ url });
  });

  return dropdown;
}







// // screen to pdf: 


// document.getElementById('savePdf').addEventListener('click', () => {
//   const { jsPDF } = window.jspdf;

//   // Capture the screen content including the canvas and notes
//   html2canvas(document.body).then(canvas => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF({
//           orientation: 'p',
//           unit: 'mm',
//           format: 'a4'
//       });

//       // Calculate the width and height in mm
//       const imgWidth = 210; // A4 width in mm
//       const pageHeight = 295; // A4 height in mm
//       const imgHeight = canvas.height * imgWidth / canvas.width;
//       let heightLeft = imgHeight;

//       // Add the image to the PDF
//       let position = 0;
//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       // Add a new page if needed
//       while (heightLeft >= 0) {
//           position = heightLeft - imgHeight;
//           pdf.addPage();
//           pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//           heightLeft -= pageHeight;
//       }

//       // Save the PDF
//       pdf.save('screenshot.pdf');
//   });
// });


// document.getElementById('savePdf').addEventListener('click', () => {
//   // Access jsPDF from the global window object
//   const { jsPDF } = window.jspdf;

//   // Ensure jsPDF is loaded
//   if (!jsPDF) {
//     console.error('jsPDF is not loaded');
//     return;
//   }

//   // Capture the screen content including the canvas and notes
//   html2canvas(document.body).then(canvas => {
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF({
//       orientation: 'p',
//       unit: 'mm',
//       format: 'a4'
//     });

//     // Calculate the width and height in mm
//     const imgWidth = 210; // A4 width in mm
//     const pageHeight = 295; // A4 height in mm
//     const imgHeight = canvas.height * imgWidth / canvas.width;
//     let heightLeft = imgHeight;

//     // Add the image to the PDF
//     let position = 0;
//     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;

//     // Add a new page if needed
//     while (heightLeft >= 0) {
//       position = heightLeft - imgHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }

//     // Save the PDF
//     pdf.save('screenshot.pdf');
//   });
// });


//---------------

// document.addEventListener('DOMContentLoaded', () => {
//   document.getElementById('savePdf').addEventListener('click', () => {
//       html2canvas(document.body).then(canvas => {
//           // Create an image from the canvas
//           let imgData = canvas.toDataURL('image/png');

//           // Create a link element and trigger a download
//           let link = document.createElement('a');
//           link.href = imgData;
//           link.download = 'screenshot.png';
//           link.click();
//       });
//   });
// });
