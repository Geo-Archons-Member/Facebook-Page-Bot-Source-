const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Ask a question to chatgpt',
  author: 'Aljur Pogoy',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    if (prompt === "") {
      sendMessage(senderId, { text: "Usage: /ai <question>" }, pageAccessToken);
      return; // Ensure the function doesn't continue
    }
    // Inform the user that content is being generated
    sendMessage(senderId, { text: 'Generating content... Please wait.' }, pageAccessToken);
    try {
      // Use the provided API URL
      const apiUrl = 'http://markdevs-last-api.onrender.com/api/v2/gpt4'; // Replace with your actual API URL
      const response = await axios.post(apiUrl, { query: prompt });
      const text = response.data.gpt4;
      // Send the generated text to the user
      sendMessage(senderId, { text: "Kazuto Kirigaya response;\n\n" + text }, pageAccessToken);
    } catch (error) {
      console.error('Error calling API:', error);
      sendMessage(senderId, { text: 'There was an error generating the content. Please contact the owner to fix the erro.' }, pageAccessToken);
    }
  }
};
