chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.command === 'injectScript') {
	  // Query the active tab in the current window
	  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (chrome.runtime.lastError || !tabs || tabs.length === 0) {
		  console.error('Failed to find active tab:', chrome.runtime.lastError);
		  sendResponse({ status: 'error', message: 'No active tab found' });
		  return;
		}

		const tabId = tabs[0].id; // Get the active tab's ID
  


		// Send a message to the content script to check if it's already injected
		chrome.tabs.sendMessage(tabId, { command: 'checkInjected' }, (response) => {
		  // Check if there's no response or if the script is not injected
		  if (chrome.runtime.lastError || !response || response.status !== 'injected') {
			// Script is not injected, so inject it
			chrome.scripting.executeScript({
			  target: { tabId: tabId },
			  files: ['contentScript.js']
			}, () => {
			  if (chrome.runtime.lastError) {
				console.error('Script injection failed:', chrome.runtime.lastError);
				sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
			  } else {
				console.log('Content script injected successfully!');
				// right here is where we are going to ensure that we populate all existing settings. 
				sendResponse({ status: 'success' });
			  }
			});
		  } else {
			// Script is already injected
			console.log('Content script is already injected!');
			// right here is where we are going to ensure that we populate all existing settings. 
			sendResponse({ status: 'alreadyInjected' });
			// this is where we 
		  }
		});
	  });
  
	  return true; // Keep the message channel open for sendResponse
	}
  });
  


  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === 'changeCursor') {
		console.log('changing cursor.');

		// Check if sender.tab is defined (meaning the message came from a content script)
		if (sender.tab && sender.tab.id) {
			chrome.scripting.executeScript({
				target: {tabId: sender.tab.id},
				func: (cursorType) => {
					document.body.style.cursor = cursorType;
				},
				args: [message.cursorType]
			});
		} else {
			// If sender.tab is not defined, get the active tab
			chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
				if (tabs.length > 0) {
					chrome.scripting.executeScript({
						target: {tabId: tabs[0].id},
						func: (cursorType) => {
							document.body.style.cursor = cursorType;
						},
						args: [message.cursorType]
					});
				}
			});
		}
	}
});




  // command to re-open the chrome extension
  chrome.commands.onCommand.addListener((command) => {
	if (command === "reopen-extension") {
	  chrome.windows.getAll({populate: true}, (windows) => {
		let extensionWindow = windows.find((win) => {
		  // Check if the window is the extension's popup
		  return win.tabs.some(tab => tab.url.includes("popup.html"));
		});
  
		if (extensionWindow) {
		  // If extension window is found, focus it
		  chrome.windows.update(extensionWindow.id, { focused: true });
		} else {
		  // If the extension popup is not open, create a new one
		  chrome.windows.create({
			url: chrome.runtime.getURL("popup.html"),
			type: "popup",
			width: 400,
			height: 400
		  });
		}
	  });
	}
  });


// Background script
// Background script

// function checkPopupOpen() {
// 	try {
// 	  // Use chrome.runtime.getViews instead of chrome.extension.getViews
// 	  const views = chrome.runtime.getViews({ type: 'popup' });
// 	  if (views.length > 0) {
// 		console.log('Popup is open');
// 		// Handle popup open state
// 	  } else {
// 		console.log('Popup is closed');
// 		// Handle popup closed state
// 	  }
// 	} catch (e) {
// 	  console.error('Error checking popup state:', e);
// 	}
//   }
  
//   // Check periodically (e.g., every 5000ms)
//   setInterval(checkPopupOpen, 5000);
  


  