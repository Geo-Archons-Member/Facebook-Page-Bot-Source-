const axios = require('axios');

module.exports = {
  name: 'gpt4',
  description: 'Ask a question to ChatGPT',
  author: 'Aljur Pogoy',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    if (prompt === '') {
      sendMessage(senderId, { text: 'Usage: gpt4 <question>' }, pageAccessToken);
      return;
    }

    sendMessage(senderId, { text: 'Thinking...' }, pageAccessToken);

    try {
      const apiUrl = 'https://www.niroblr.cloud/api/gpt4?prompt=' + encodeURIComponent(prompt); // Construct the API URL
      const response = await axios.get(apiUrl); // Use GET request

      if (response.status === 200) {
        const text = response.data.response.answer; // Assuming the response structure you provided
        sendMessage(senderId, { text: `ChatGPT4: \n\n${text}` }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Oops! Something went wrong. Please try again later.' }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error calling GPT-4 API:', error);
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
