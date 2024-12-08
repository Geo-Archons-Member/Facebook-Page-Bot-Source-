const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'gemini',
  description: 'Interact with the Gemini',
  admin: false,
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // 1. Get the prompt from the user's message
    const prompt = args.join(' '); // Combine all arguments into a single string
    if (prompt.trim() === '') {
      sendMessage(senderId, { text: 'Please provide a prompt for Gemini.' }, pageAccessToken);
      return;
    }

    // 2. Construct the API URL
    const apiUrl = `https://deku-apis.onrender.com/gemini?prompt=${encodeURIComponent(prompt)}`;

    // 3. Fetch data from the API
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // 4. Extract the Gemini response
      const geminiResponse = data.gemini;

      // 5. Send the response to the user
      sendMessage(senderId, { text: geminiResponse }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: 'Error interacting with Gemini API.' }, pageAccessToken);
    }
  }
};
        
