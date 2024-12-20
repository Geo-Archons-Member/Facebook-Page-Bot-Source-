const axios = require('axios');

module.exports = {
  name: 'liner',
  description: 'Ask question to liner ai',
  author: 'Aljur Pogoy',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    if (prompt === "") {
      sendMessage(senderId, { text: "Usage: liner<question>" }, pageAccessToken);
      return; // Ensure the function doesn't continue
    }
    // Inform the user that content is being generated
    sendMessage(senderId, { text: 'Generating... Please wait.' }, pageAccessToken);
    try {
      let apiUrl = 'https://liner-ai.vercel.app/kshitiz?prompt=${encodeURIComponent(prompt)}'; // Your API URL
      const response = await axios.post(apiUrl);
      const text = response.data.content.url_content; // Assuming the response structure is similar to your example
      // Send the generated text to the user
      sendMessage(senderId, { text: "Liner Ai Response:\n\n" + text }, pageAccessToken);
    } catch (error) {
      console.error('Error calling API:', error);
      sendMessage(senderId, { text: 'There was an error generating the code. Please try again later.' }, pageAccessToken);
    }
  }
};
