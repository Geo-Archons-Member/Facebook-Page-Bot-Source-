const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'unity',
  category: '𝙴𝚍𝚞𝚌𝚊𝚝𝚒𝚘𝚗',
  description: 'Get answer from unity ai',
  usage: 'unity [question]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {

    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "Usage: unity <question>" }, pageAccessToken);

    try {
       const { data } = await axios.get(`https://api.kenliejugarap.com/unity/?question=${encodeURIComponent(prompt)}`);
      
      sendMessage(senderId, { text: data.response }, pageAccessToken);
    } catch {
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
