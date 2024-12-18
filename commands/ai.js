const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Ask a question to ChatGPT',
  author: 'Aljur Pogoy',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    if (prompt === '') {
      sendMessage(senderId, { text: 'Usage: /ai <question>' }, pageAccessToken);
      return;
    }

    sendMessage(senderId, { text: 'Thinking...' }, pageAccessToken);

    try {
      const apiUrl = 'http://markdevs-last-api.onrender.com/api/v2/gpt4'; // Replace with your actual API URL
      const response = await axios.post(apiUrl, { query: prompt });

      if (response.status === 200) {
        const text = response.data.gpt4;
        sendMessage(senderId, { text: `ChatGPT says: \n\n${text}` }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Oops! Something went wrong. Please try again later.' }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error calling GPT-4 API:', error);
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
