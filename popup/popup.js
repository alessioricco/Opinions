
/*
document.addEventListener('DOMContentLoaded', function() {...}): 
The script inside this function will run once the DOM is fully loaded. 
This is the entry point for your extension's JavaScript.
*/
document.addEventListener('DOMContentLoaded', function() {

  function getBrowser() {
    if (typeof chrome !== 'undefined') {
        // Chrome extension runtime
        return chrome;
    } else if (typeof browser !== 'undefined') {
        // Firefox extension runtime
        return browser;
    } else {
        throw new Error('Unsupported browser');
    }
}

const currentBrowser =  getBrowser();

  function hideElement(element) {
    element.style.display = 'none';
  }

  function showElement(element) {
    element.style.display = 'block';
  }

  function flexElement(element) {
    element.style.display = 'flex';
  }

  let selectedText = '';
  setTimeout(async function(){
    try {
      selectedText = await fetchAndSetSelectedText();
    } catch (error) {
      console.error('Error getting selected text:', error);
    }
  }, 250); // Execute after a delay

  const PROMPTS = {
    'facts': `
      Your task is to accurately identify and categorize the facts and opinions within it. 
      Your response should consist only of two bullet lists: one presenting the facts, and the other presenting the opinions. 
    `,
    'strategy': `
      Analyze the provided text to complete the following tasks:
      - Summarize the content in less than 512 characters.
      - Differentiate between facts and opinions within the text.
      - Determine the sentiment in the short, mid, and long term.
      - Formulate actionable items based on the text, sentiments, and facts. 
      The output will be divided in paragraphs and bullet points
    `,
    'tldr': `
      Analyze the provided text to complete the following tasks:
      - Generate a TL;DR summary. 
    `,
    'sentiment': `
      Analyze the provided text to complete the following tasks:
      - Generate a sentiment analysis. 
    `,
  };
  

  const apiKeyInput = document.getElementById('apiKeyInput');
  const apiSubmitButton = document.getElementById('apiSubmitButton');
  const apiView = document.getElementById('apiView');
  const mainView = document.getElementById('mainView');
  const submitButton = document.getElementById('submitButton');
  const textArea = document.getElementById('textArea');
  const resultArea = document.getElementById('resultArea');
  const editApiKeyButton = document.getElementById('editApiKeyButton');
  const copyButton = document.getElementById('copyButton');
  const analysisTypeDropdown = document.getElementById('analysisType');
  const hiddenArea = document.getElementById('hiddenArea');
  const mainContent = document.getElementById('mainContent');
  const instructions = document.getElementById('instructions');
  const spinner = document.getElementById('spinner');
  const languageDropdown = document.getElementById('languages');


  hiddenArea.style.display = 'none'; // hide the div

  function submit() {
    if (analysisTypeDropdown.value !== "blank" && languageDropdown.value) {
      // Click the submit button
      submitButton.click();
    }    
  }


  analysisTypeDropdown.addEventListener('change', function() {
    // Fetch the selected prompt when the analysis type changes
    if (this.value !== "blank") {
      // Click the submit button
      // submitButton.click();
      submit();
    }
  });
  
  languageDropdown.addEventListener('change', function() {
    // Store selected language in local storage
    currentBrowser.storage.local.set({ 'language': this.value });
    submit();
  });
  
  // Fetch language from local storage
  currentBrowser.storage.local.get(['language'], function(result) {
    if (result.language) {
      languageDropdown.value = result.language;
    } else {
      languageDropdown.value = 'english';
    }
  });



  function getSelectedTextFromActiveTab() {
    return new Promise((resolve, reject) => {
      currentBrowser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        currentBrowser.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            function: function () {
              return window.getSelection().toString();
            },
          },
          function (results) {
            if (results && results.length > 0) {
              resolve(results[0].result);
            } else {
              reject(new Error('No result from executeScript'));
            }
          }
        );
      });
    });
  }
  


  async function fetchAndSetSelectedText() {
    const selectedText = await getSelectedTextFromActiveTab();
    textArea.value = selectedText;
    handleTextInput.call(textArea);
    return textArea.value;
  }

  /*
  The copySelectedTextButton.addEventListener('click', function() {...}) 
  function executes a script in the context of the currently selected tab 
  which gets the selected text and places it in the text area for analysis.
   */
  copySelectedTextButton.addEventListener('click', async function() {
    try {
      await fetchAndSetSelectedText();
    } catch (error) {
      console.error('Error getting selected text:', error);
    }
  });

  /*
  switchToMainView(): 
  This function hides the 'apiView' element and displays the 'mainView' element. 
  This is used when you have a valid API key saved and you want to switch the user to the main input form.
  */
  function switchToMainView() {
    apiView.classList.add('hide');
    mainView.classList.remove('hide');
  }

  function toggleRemoveAPIKeyButton(){
    apiRemoveButton.style.display =  (isValidApiKey(apiKeyInput.value)) ? "block" : "none"
  }

  /*
  switchToApiView(): 
  This function hides the 'mainView' element and displays the 'apiView' element. 
  This is used when you don't have a valid API key and need the user to enter it.
  */
  function switchToApiView() {
    apiView.classList.remove('hide');
    mainView.classList.add('hide');
    toggleRemoveAPIKeyButton()
  }

  // Fetch API key from local storage
  currentBrowser.storage.local.get(['API_KEY'], function(result) {
    if (result.API_KEY && isValidApiKey(result.API_KEY)) {
      switchToMainView();
    } else {
      switchToApiView();
      // switchToMainView();
      // mainContent.style.display = 'none';
      // instructions.style.display = 'block';
    }
  });

  /*
  isValidApiKey(apiKey): 
  This function takes an API key as a parameter and checks if it's a valid OpenAI API key. 
  It returns a boolean result.
  */
  function isValidApiKey(apiKey) {
    // Check for "sk-" prefix and 39 alphanumeric characters afterward, for a total length of 42
    var re = /^sk-[a-zA-Z0-9]{32,}$/;
    return re.test(apiKey);
  }

  /*
  isValidInputText(text): 
  This function checks if the user's input text is valid (in this case, not empty). 
  It returns a boolean result.
  */
  function isValidInputText(text) {
    return text && text.length > 0;
  }

  textArea.addEventListener('input', handleTextInput);
  handleTextInput.call(textArea);

  /*
  handleTextInput(): 
  This function is called whenever the user types into the textarea. 
  It validates the input and enables/disables the submit button accordingly. 
  It also handles showing/hiding the result area.
  */
  function handleTextInput() {
    var isValid = isValidInputText(this.value);
    submitButton.disabled = !isValid;
    hideElement(resultArea);
    if (!isValid) {
      hideElement(mainContent);
      showElement(instructions);
    } else {
      showElement(mainContent);
      hideElement(instructions);
    }
  }
  

  /*
  The editApiKeyButton.addEventListener('click', function() {...}) 
  function switches the view back to the API input form when clicked.
  */ 
  editApiKeyButton.addEventListener('click', function() {
    switchToApiView();
    currentBrowser.storage.local.get(['API_KEY'], function(result) {
      apiKeyInput.value = result.API_KEY || '';
      // apiRemoveButton.style.display =  (isValidApiKey(apiKeyInput.value)) ? "block" : "none"
    });
  });

  apiKeyInput.addEventListener('input', function() {
    if (isValidApiKey(this.value)) {
      // The API key is valid
    } else {
      // The API key is not valid
      alert('Invalid API key. Please enter a valid API key.');
    }
  });
  

  /*
  The apiSubmitButton.addEventListener('click', function() {...}) 
  function handles the submission of the API key. 
  It validates the input and saves it to local storage if it's valid.
  */ 
  apiSubmitButton.addEventListener('click', function() {
    var apiKeyValue = apiKeyInput.value;
    if (isValidApiKey(apiKeyValue)) {
      currentBrowser.storage.local.set({ 'API_KEY': apiKeyValue }, function() {
        // document.getElementById('api-key-saved-message').classList.remove('hide');
        switchToMainView();
      });
    } else {
      alert('Invalid API key. Please enter a valid API key.');
    }
    
  });

  document.getElementById('apiRemoveButton').addEventListener('click', function() {
    // Clear the input field
    document.getElementById('apiKeyInput').value = '';
    
    // Remove the key from the storage
    currentBrowser.storage.local.remove('API_KEY', function() {
      // This is a callback function that runs after the key is removed
      toggleRemoveAPIKeyButton()
      console.log('Key removed from storage');
    });
  });
  
  

  /*
  The copyButton.addEventListener('click', function() {...}) 
  function allows the result of the OpenAI API call to be copied to the clipboard.
  */ 
  copyButton.addEventListener('click', function() {
    var tempElement = document.createElement('textarea');
    tempElement.value = resultArea.innerText;  // Changed from textContent to innerText
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);
    copyButton.textContent = 'Copied!';
    setTimeout(function() {
      copyButton.textContent = 'Copy Result';
    }, 2000);
  });

  /*
  fetchOpenAIResult(text, apiKey): 
  This function fetches the result from the OpenAI API. 
  It constructs the request payload and sends a POST request to the API. 
  It then returns the API's response.
  */  
  async function fetchOpenAIResult(text, apiKey, selectedPrompt) {
    const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
    const MODEL = 'gpt-3.5-turbo';
    const TEMPERATURE = 0;
  
    let promptTemplate = (selectedPrompt);
    let prompt = promptTemplate.replace('{{text}}', text);
    
    try {
      const response = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [ {"role":"system","content": "You are a multilingual fact-checker."},
                      { role: 'user', content: prompt }],
          temperature: TEMPERATURE
        })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    }
    catch(error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }
  

  function displayResult(resultText) {
      // replace innerHTML with textContent to avoid potential XSS attacks
      resultArea.innerHTML = resultText;
      // Enable the copy button now that there's a result to copy
      showElement(copyButton);
      showElement(resultArea);
  }

  function handleError(error) {
    console.error('Error:', error);
    resultArea.textContent = 'Error: ' + error.message;
  }
  
  /*
  LLMCall(textAreaValue, prompt):
  This function retrieves the API key from local storage, calls the OpenAI API with the given text and prompt, 
  and then displays the result in the result area.
  */
  async function LLMCall(textAreaValue, prompt) {
    // Get API key from local storage
    currentBrowser.storage.local.get(['API_KEY'], async function(result) {
      var apiKey = result.API_KEY;
  
      // Show spinner
      // const spinner = document.getElementById('spinner');
      flexElement(spinner);
  
      // Disable the dropdown
      analysisTypeDropdown.disabled = true;
      hideElement(copyButton);
      hideElement(resultArea);
  
      // Call OpenAI API
      try {
        const data = await fetchOpenAIResult(textAreaValue, apiKey, prompt);
        // Display the result
        displayResult(data.choices[0].message.content);
        showElement(copyButton); // Show the copy button
      } catch (error) {
        handleError(error);
      }
  
      // Hide spinner
      hideElement(spinner);
  
      // Enable the dropdown
      analysisTypeDropdown.disabled = false;
      showElement(copyButton);
      showElement(resultArea);
    });
  }
  
  
  

  /*
  The submitButton.addEventListener('click', function() {...}) 
  function handles the submission of the user's input text. 
  It retrieves the saved API key, clears the result area, and then calls the OpenAI API with the user's input.
   */
  submitButton.addEventListener('click', function() {

    if (analysisTypeDropdown.value === "blank") return;

    if (selectedText === null || selectedText.trim() === '') return;

    var textAreaValue = textArea.value;
  
    // Get the selected analysis type and corresponding prompt
    const selectedAnalysisType = analysisTypeDropdown.value;
    const selectedPrompt = PROMPTS[selectedAnalysisType] + `
    - Your output MUST include only the required information
    - Your output MUST be in ${languageDropdown.value} language
    - The text to analize is the following:
    "{{text}}"
    `;

    LLMCall(textAreaValue, selectedPrompt)

  });


});
