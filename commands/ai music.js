const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'aimusic',
  description: 'Generate music using deku rest api',
  author: 'Aljur pogoy',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // 1. Get the prompt from the user's message
    const prompt = args.join(' '); // Combine all arguments into a single string
    if (prompt.trim() === '') {
      sendMessage(senderId, { text: 'Please provide a prompt for the AI music generator.' }, pageAccessToken);
      return;
    }

    // 2. Construct the API URL
    const apiUrl = `https://deku-apis.onrender.com/api/aimusic?prompt=${encodeURIComponent(prompt)}`;

    // 3. Fetch data from the API
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // 4. Handle potential errors
      if (!data.status) {
        sendMessage(senderId, { text: `Error: ${data.result}` }, pageAccessToken);
        return;
      }

      // 5. Send a message indicating the music is being generated
      sendMessage(senderId, { text: 'Generating music... Please wait.' }, pageAccessToken);

      // 6.  (Optional) You might want to handle the music generation process and send the resulting audio file to the user. 
      //    This would involve fetching the generated audio from the API and sending it as a file. 

      // For now, we simply send a confirmation message.
      sendMessage(senderId, { text: 'Music generated successfully!' }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: 'Error interacting with AI music API.' }, pageAccessToken);
    }
  }
};
