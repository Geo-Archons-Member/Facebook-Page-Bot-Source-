const axios = require('axios');

module.exports = {
  name: 'gemini',
  description: 'Interact with the Gemini.',
  author: 'Aljur Pogoy',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // 1. Combine arguments into a single prompt
    const prompt = args.join(' ');
    if (prompt.trim() === '') {
      sendMessage(senderId, { text: 'Please provide a prompt for the Gemini API.' }, pageAccessToken);
      return;
    }

    // 2. Construct the API URL
    const apiUrl = 'https://deku-apis.onrender.com/gemini';

    // 3. Send the request to the API
    try {
      const response = await axios.get(apiUrl, {
        params: {
          prompt: prompt
        }
      });

      // 4. Handle the response
      if (response.status === 200) {
        sendMessage(senderId, { text: response.data }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Error interacting with the Gemini API.' }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Error interacting with the Gemini API.' }, pageAccessToken);
    }
  }
};
