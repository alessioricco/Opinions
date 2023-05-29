// background.js

chrome.runtime.onInstalled.addListener(() => {
  // No need to register content script programmatically in Manifest V3

  // Event listener for message from content script and popup script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'selectedText') {
      var selectedText = request.text;
      // Store the selected text in storage for retrieval by the popup script
      chrome.storage.local.set({ selectedText: selectedText });
    } else if (request.action === 'getSelectedText') {
      // Retrieve the selected text from storage and send it back to the popup script
      chrome.storage.local.get(['selectedText'], function(result) {
        var selectedText = result.selectedText || '';
        sendResponse({ text: selectedText });
      });
      return true; // Indicates that the response will be sent asynchronously
    }
  });
});

// Function to execute content script in the active tab
function executeContentScript(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId, allFrames : true },
    files: ['content.js']
  });
}

// Execute content script when the extension icon is clicked
chrome.action.onClicked.addListener(function(tab) {
  console.log("click")
  executeContentScript(tab.id);
});
