const axios = require('axios');

module.exports = {
  name: 'ask',
  admin: false,// you can change it, like author: ""
  execute: async (senderId, args, pageAccessToken, sendMessage) => {
    const question = args.join(' ');
    if (!question) {
      await sendMessage(senderId, { text: 'Please provide a question.' }, pageAccessToken);
      return;
    }

    const encodedQuestion = encodeURIComponent(question);
    const apiUrl = `https://openai-rest-api.vercel.app/hercai?ask=${encodedQuestion}&model=v3`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      await sendMessage(senderId, { text: data.reply }, pageAccessToken);
    } catch (error) {
      console.error('Error making API call:', error);
      await sendMessage(senderId, { text: 'An error occurred while processing your request.' }, pageAccessToken);
    }
  },
};
