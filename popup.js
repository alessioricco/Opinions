// popup.js

// Get the selected text from the background script
// chrome.runtime.sendMessage({ action: 'getSelectedText' }, function(response) {
//   if (!response) return;
//   var selectedText = response.text;
//   if (selectedText) {
//     // Update the selectedText element in the popup
//     var selectedTextElement = document.getElementById('selectedText');
//     selectedTextElement.textContent = selectedText;
//   }
// });

// popup.js

document.addEventListener('DOMContentLoaded', function() {
  var submitButton = document.getElementById('submitButton');
  var textArea = document.getElementById('textArea');
  var resultArea = document.getElementById('resultArea');

  submitButton.addEventListener('click', function() {
    var textAreaValue = textArea.value;
    var lambdaFunctionUrl = 'https://p5yv54ffwizsf2va6zyzedgdni0dzwnq.lambda-url.eu-west-2.on.aws/';

    // Prepare the request body JSON
    var requestBody = {
      text: textAreaValue
    };

    // Clear the result area and display a wait message
    resultArea.textContent = 'Please wait...';

    // Send a POST request to the Lambda function URL
    fetch(lambdaFunctionUrl, {
      method: 'POST',
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
    })
    .catch(error => {
      console.error('Error calling Lambda function:', error);
      resultArea.textContent = 'Error: ' + error.message;
    });
  });
});