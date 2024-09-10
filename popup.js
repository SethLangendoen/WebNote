// Initial drawing state
let isDrawingMode = false;

// Toggle button element
const drawBtn = document.querySelector('.draw-btn');

// Event listener for draw button click
drawBtn.addEventListener('click', function() {
  isDrawingMode = !isDrawingMode; // Toggle drawing mode
  if (isDrawingMode) {
    // Activate drawing mode
    drawBtn.classList.add('active'); // Optionally add an 'active' class for styling
	console.log('drawing mode wtv'); 
	// toggleDrawing(); 
  } else {
    // Deactivate drawing mode
    drawBtn.classList.remove('active');

  }
});


/* 
 Event listener for draw button click. This is going to send a message to the background script to inject
 the content script in the given browser. ( In this case a script to add the canvas to the browser to 
 be drawn on). 
*/

// Send a message to the background script to inject the content script
function injectContentScriptAndToggleDrawing() {
	chrome.runtime.sendMessage({ command: 'injectScript' }, (response) => {
	  if (chrome.runtime.lastError) {
		console.error('Error sending message to background:', chrome.runtime.lastError);
	  } else if (response.status === 'success') {
		console.log('Content script injected successfully.');
		
		// Now that the content script is injected, send a message to toggle drawing mode
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		  chrome.tabs.sendMessage(tabs[0].id, { command: 'toggleDrawing' });
		});
	  } else {
		console.error('Background script error:', response.message);
	  }
	});
  }
  
  // Attach event listener for draw button
  drawBtn.addEventListener('click', injectContentScriptAndToggleDrawing);



// // Function to send message to content script to toggle drawing mode
// function toggleDrawing() {
// 	chrome.tabs.query({ active: true, currentWindow: true }, 
// 		function(tabs) {
// 		  // After injecting content script, send the message
// 			chrome.tabs.sendMessage(tabs[0].id, { command: 'toggleDrawing' }, (response) => {
// 			console.log("Toggled drawing mode");
// 		}
// 	  );
// 	});
//   }
  
  