const axios = require('axios');

module.exports = {
  name: 'mlbbstalk',
  description: 'Get MLBB stalk information.',
  admin: true,
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // 1. Combine arguments into a single prompt
    const prompt = args.join(' ');
    if (prompt.trim() === '') {
      sendMessage(senderId, { text: 'Please provide a player ID and server ID.' }, pageAccessToken);
      return;
    }

    // 2. Extract player ID and server ID from the prompt
    const [playerId, serverId] = prompt.split(' ');
    if (!playerId || !serverId) {
      sendMessage(senderId, { text: 'Please provide a player ID and server ID in the format: `player_id server_id`.' }, pageAccessToken);
      return;
    }

    // 3. Construct the API URL
    const apiUrl = `https://deku-apis.onrender.com/api/ml?id=${playerId}&serverid=${serverId}`;

    // 4. Send the request to the API
    try {
      const response = await axios.get(apiUrl);

      // 5. Handle the response
      if (response.status === 200) {
        const result = response.data.result;
        sendMessage(senderId, { text: `MLBB Stalk: ${result}` }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Error getting MLBB stalk information.' }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Error getting MLBB stalk information.' }, pageAccessToken);
    }
  }
};
