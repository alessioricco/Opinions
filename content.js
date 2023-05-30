chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'getSelectedText') {
      sendResponse({data: window.getSelection().toString()});
  }
});



