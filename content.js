// content.js

// Event listener for mouseup event
document.addEventListener('mouseup', function() {
  var selectedText = window.getSelection().toString();
  console.log(selectedText)
  if (selectedText !== '') {
    // Send a message to the background script
    chrome.runtime.sendMessage({ action: 'selectedText', text: selectedText });
  }
});
