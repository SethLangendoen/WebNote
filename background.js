chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.command === 'injectScript') {
	  // Query the active tab in the current window
	  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		// Ensure tabs array is not undefined or empty
		if (chrome.runtime.lastError || !tabs || tabs.length === 0) {
		  console.error('Failed to find active tab:', chrome.runtime.lastError);
		  sendResponse({ status: 'error', message: 'No active tab found' });
		  return;
		}
  
		const tabId = tabs[0].id; // Get the active tab's ID
  
		// Inject content script into the active tab
		chrome.scripting.executeScript({
		  target: { tabId: tabId },
		  files: ['contentScript.js']
		}, () => {
		  if (chrome.runtime.lastError) {
			console.error('Script injection failed:', chrome.runtime.lastError);
			sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
		  } else {
			console.log('Content script injected successfully!');
			sendResponse({ status: 'success' });
		  }
		});
	  });
  
	  return true; // Keep the message channel open for sendResponse
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
  