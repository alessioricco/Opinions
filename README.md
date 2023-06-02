# Facts & Opinions
Google Chrome Plugin using AI to separate facts from opinions

This is a Google Chrome extension that uses the OpenAI GPT-4 model to analyze selected text. It provides features to identify and categorize facts and opinions, summarize text, determine sentiment, and generate actionable items based on the text, sentiments, and facts. 

## Features

1. Identifying and categorizing facts and opinions.
2. Summarizing text in less than 512 characters.
3. Determining the sentiment in the short, mid, and long term.
4. Formulating actionable items based on the text, sentiments, and facts.
5. API Key management for OpenAI.

## Setup

1. **Clone the repository**
   
   `git clone https://github.com/<username>/text-analysis-extension.git`

2. **Load the extension into Google Chrome**

   - Open Google Chrome browser, navigate to chrome://extensions.
   - Enable Developer mode by ticking the checkbox in the upper-right corner.
   - Click on the "Load unpacked" button.
   - Select the directory containing the extension's files.

3. **API Key Configuration**

   - Click on the extension's icon to open the popup.
   - Enter your OpenAI API key.
   - Click "Submit" to save the API key.

## Usage

1. Highlight the text you want to analyze on any webpage.
2. Click on the extension's icon to open the popup.
3. The selected text will automatically populate the text field.
4. Select the type of analysis you want to perform from the dropdown.
5. Click "Submit" to get the analysis.
6. The result will be displayed below.
7. You can copy the result to your clipboard by clicking "Copy Result".

## Development

This extension is built primarily using JavaScript, with HTML and CSS for the frontend. The entry point for the JavaScript is the 'DOMContentLoaded' event listener in popup.js.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/alessioricco/Opinions/issues).

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Alessio Ricco - [@alessioricco](https://twitter.com/alessioricco) - dev@infinite-loop.uk
