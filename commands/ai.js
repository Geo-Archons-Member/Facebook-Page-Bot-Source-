const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Interact with LLMA META AI',
  usage: 'ai [your Question or Message]',
  admin: false,
  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "Usage: ai <question>" }, pageAccessToken);

    try {
      const response = await axios.get('https://kaiz-apis.gleeze.com/api/gpt-4o-pro', {
        params: {
          q: prompt,
          uid: 1,
          imageUrl: '' // Add an image URL if needed
        }
      });

      const data = response.data.content.url_content;
      const parsedData = JSON.parse(data); // Parse the response as JSON
      const responseText = parsedData.response; // Extract the response

      sendMessage(senderId, { text: responseText }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
