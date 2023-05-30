// popup.js

document.addEventListener('DOMContentLoaded', function() {
  var apiKeyInput = document.getElementById('apiKeyInput');
  var apiSubmitButton = document.getElementById('apiSubmitButton');
  var apiView = document.getElementById('apiView');
  var mainView = document.getElementById('mainView');
  var submitButton = document.getElementById('submitButton');
  var textArea = document.getElementById('textArea');
  var resultArea = document.getElementById('resultArea');
  var editApiKeyButton = document.getElementById('editApiKeyButton');
  var copyButton = document.getElementById('copyButton');

  // Check if API key is stored in local storage
  chrome.storage.local.get(['API_KEY'], function(result) {
    if(result.API_KEY) {
      // If API key is found, hide API view and show main view
      apiView.classList.add('hide');
      mainView.classList.remove('hide');
    }
  });

  // Textarea input event
  textArea.addEventListener('input', handleTextInput);

  // Handle the textarea content immediately
  handleTextInput.call(textArea);

  function handleTextInput() {
    submitButton.disabled = !this.value;
    if (!this.value) {
      resultArea.classList.add('hide');
      copyButton.disabled = true;
    } else {
      resultArea.classList.remove('hide');
    }
  }

  editApiKeyButton.addEventListener('click', function() {
    // Show API view and hide main view
    apiView.classList.remove('hide');
    mainView.classList.add('hide');
    
    chrome.storage.local.get(['API_KEY'], function(result) {
      apiKeyInput.value = result.API_KEY || '';
    });
  });

  apiSubmitButton.addEventListener('click', function() {
    var apiKeyValue = apiKeyInput.value;
    if(apiKeyValue) {
      // If an API key is entered, save it to local storage
      chrome.storage.local.set({ 'API_KEY': apiKeyValue }, function() {
        // Hide API view and show main view
        apiView.classList.add('hide');
        mainView.classList.remove('hide');
      });
    }
  });

  copyButton.addEventListener('click', function() {
    // Create a temporary textarea to hold the text to be copied
    var tempElement = document.createElement('textarea');
    tempElement.value = resultArea.innerText;  // changed from textContent to innerText
    document.body.appendChild(tempElement);
  
    // Select the text and copy it
    tempElement.select();
    document.execCommand('copy');
  
    // Remove the temporary textarea
    document.body.removeChild(tempElement);
  
    // Indicate that the copy was successful
    copyButton.textContent = 'Copied!';
    setTimeout(function() {
      copyButton.textContent = 'Copy Result';
    }, 2000);
  });
  
  

  submitButton.addEventListener('click', function() {
    var textAreaValue = textArea.value;
    var lambdaFunctionUrl = 'https://p5yv54ffwizsf2va6zyzedgdni0dzwnq.lambda-url.eu-west-2.on.aws/';

    // Get API key from local storage
    chrome.storage.local.get(['API_KEY'], function(result) {
      var apiKey = result.API_KEY;

      // Prepare the request body JSON
      var requestBody = {
        text: textAreaValue,
        LLM_engine: 'openai' // Include the LLM_engine in the request
      };

      // Clear the result area and display a wait message
      resultArea.textContent = 'Please wait...';

      // Send a POST request to the Lambda function URL
      fetch(lambdaFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the API key in the header
          'x-api-key': apiKey
        },
        body: JSON.stringify(requestBody)
      })
      .then(response => {
        // Handle the response
        console.log('Lambda function response:', response);
        return response.json(); // Convert response to JSON
      })
      .then(data => {
        // Display the result
        var resultText = data.result.replace(/\n/g, '<br>');
        resultArea.innerHTML = '<pre>' + resultText + '</pre>';
        // Enable the copy button now that there's a result to copy
        copyButton.disabled = false;
      })
      .catch(error => {
        console.error('Error calling Lambda function:', error);
        resultArea.textContent = 'Error: ' + error.message;
      });
    });
  });
});
