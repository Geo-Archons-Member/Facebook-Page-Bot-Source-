const axios = require('axios');

module.exports = {
  name: 'llama',
  description: 'Ask Llama 3.2',
  author: 'Aljur The great',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const question = args.join(' '); // Combine arguments into a single question
    if (!question) {
      sendMessage(senderId, { text: 'Please provide a question for Llama.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://deku-apis.onrender.com/ai/llama-3.2-11b-vision-instruct?q=${encodeURIComponent(question)}&uid=`;
      const response = await axios.get(apiUrl);

      if (response.data.error_message) {
        sendMessage(senderId, { text: 'Error: ' + response.data.error_message.file_error_message }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: response.data.response }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Llama API:', error);
      sendMessage(senderId, { text: 'There was an error calling the Llama API. Please try again later.' }, pageAccessToken);
    }
  }
};
