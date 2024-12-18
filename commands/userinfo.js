const { sendMessage } = require('../handles/sendMessage'); // Assuming you have sendMessage function

module.exports = {
  name: 'userinfo',
  description: 'Displays information about a user.',
  admin: false, // This command is admin-only
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length === 0) {
      // If no user ID is provided, display info about the sender
      const targetUserId = senderId;
      await displayUserInfo(targetUserId, pageAccessToken, sendMessage);
    } else {
      // If a user ID is provided, display info about that user
      const targetUserId = args[0].trim();
      await displayUserInfo(targetUserId, pageAccessToken, sendMessage);
    }
  }
};

async function displayUserInfo(userId, pageAccessToken, sendMessage) {
  try {
    // Fetch user information from the Facebook Graph API
    const response = await fetch(`https://graph.facebook.com/${userId}?fields=name,picture.type(large)`);
    const userData = await response.json();

    // Construct the user info message
    const userInfoMessage = `
━━━━━━━━━━━━━━
User Information:
ID: ${userId}
Name: ${userData.name || 'Unknown'}
Profile Picture: ${userData.picture.data.url}
━━━━━━━━━━━━━━`;

    await sendMessage(userId, { text: userInfoMessage }, pageAccessToken);
  } catch (error) {
    console.error('Error getting user info:', error);
    await sendMessage(userId, { text: `An error occurred: ${error.message}` }, pageAccessToken);
  }
}
