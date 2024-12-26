const axios = require('axios');

module.exports = {
  name: 'cici',
  description: 'Ask a question to CICI',
  author: 'Aljur Pogoy',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    if (prompt === "") {
      sendMessage(senderId, { text: "Usage: /cici <question>" }, pageAccessToken);
      return; // Ensure the function doesn't continue
    }
    // Inform the user that content is being generated
    sendMessage(senderId, { text: 'Generating content... Please wait.' }, pageAccessToken);
    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/gemini-pro?q=${encodeURIComponent(prompt)}&uid=${senderId}`;
      const response = await axios.get(apiUrl);
      const text = response.data.response;
      // Send the generated text to the user
      sendMessage(senderId, { text: "Kaizenji BY CHATGPT:\n\n" + text }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Kaizenji API:', error);
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
  
