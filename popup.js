

let isDrawingMode = false;
let isErasingMode = false;
let isHighlightingMode = false; 

// const popupWindow = window.open('https://your-url.com', 'popup', 'width=400,height=400');

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
const minimizeBtn = document.querySelector('.minimize-btn'); 
const containingDiv = document.querySelector('.popup-container'); 
const popupContentDiv = document.querySelector('.popup-content'); 
const restoreNotes = document.querySelector('.restore-notes-btn'); 
const presetBtn = document.querySelector('.preset-btn'); 


// popup.js

// load settings. 
document.addEventListener('DOMContentLoaded', () => {


  console.log('dom loaded'); 
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	// destination tab and message object 
    chrome.tabs.sendMessage(tabs[0].id, { command: 'applySettings'});
  });
});





minimizeBtn.addEventListener('click', function () {
  if( popupContentDiv.style.display === 'none'){
    popupContentDiv.style.display = 'flex'; // show content.
  } else {
    popupContentDiv.style.display = 'none' // remove it. 
  }

})


// Toggle drawing mode
drawBtn.addEventListener('click', function () {
  isDrawingMode = !isDrawingMode;
  isErasingMode = false;

  if (isDrawingMode || isHighlightingMode || isErasingMode) {
    drawBtn.classList.add('active');
    eraseBtn.classList.remove('active');
    chrome.runtime.sendMessage({ command: 'injectScript' }, (response) => {
      if (response.status === 'success') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { command: 'toggleDrawing' });
        });
      }
    });
  } else {
    drawBtn.classList.remove('active');
  }
});

// Toggle erasing mode
eraseBtn.addEventListener('click', function () {
  isErasingMode = !isErasingMode;
  isDrawingMode = false;

  if (isErasingMode) {
    eraseBtn.classList.add('active');
    drawBtn.classList.remove('active');
    chrome.runtime.sendMessage({ command: 'injectScript' }, (response) => {
      if (response.status === 'success') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { command: 'toggleErasing' });
        });
      }
    });
  } else {
    eraseBtn.classList.remove('active');
  }
});

// Handle line thickness changes
thicknessSlider.addEventListener('input', (event) => {
  const thicknessValue = event.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'setLineThickness', value: thicknessValue });
  });
});

// Handle eraser size changes
eraserSlider.addEventListener('input', (event) => {
  const eraserValue = event.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'setEraserSize', value: eraserValue });
  });
});

// Handle eraser size changes
highlightOpacitySlider.addEventListener('input', (event) => {
  const highlightOpacity = event.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'setHighlightOpacity', value: highlightOpacity });
  });
});

fontSlider.addEventListener('input', (event) => {
  const fontSize = event.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'setFontSize', value: fontSize });
  });
});

// Handle color picker changes
colorPicker.addEventListener('input', (event) => {
  const colorValue = event.target.value; // gets the color value
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	// destination tab and message object 
    chrome.tabs.sendMessage(tabs[0].id, { command: 'setLineColor', value: colorValue });
  });
});

highlightColorPicker.addEventListener('input', (event) => {
  const colorValue = event.target.value; // gets the color value
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	// destination tab and message object 
    chrome.tabs.sendMessage(tabs[0].id, { command: 'setHighlightColor', value: colorValue });
  });
});


// Clear canvas button
clearBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'clearCanvas' });
  });
});

// Add text button
textBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const colorValue = colorPicker.value // gets the color value
    chrome.tabs.sendMessage(tabs[0].id, { command: 'createText', value: colorValue });
  });
});

// take screenshot button
screenshotButton.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'takeScreenshot' });
  });
});

// close window button
closeWindowBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'closeWindow' });
  });
});

// highlight button
highlightButton.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'highlight' });
  });
});

// add preset tool 
presetBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('calling from popup.js (presets)'); 
    chrome.tabs.sendMessage(tabs[0].id, { command: 'addPreset' });
  });
});

// restore notes button
restoreNotes.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'restore' });
  });
});


// select eraser option: 
const eraserModeSelect = document.querySelector('.eraser-mode-select');


