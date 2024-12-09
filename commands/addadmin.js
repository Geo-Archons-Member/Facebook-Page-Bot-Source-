const { getUserName } = require('./getUserName'); //Import getUserName function from getUserName.js
module.exports = {
  name: 'addadmin',
  description: 'Adds the current user to the admin list (requires verification code).',
  admin: false, //This command is not admin-only
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const verificationCode = process.env.VERIFICATION_CODE || '-Admin69'; // Get verification code from environment variables

    if (!verificationCode) {
      console.error("VERIFICATION_CODE environment variable not set!");
      await sendMessage(senderId, { text: 'Verification code not configured.' }, pageAccessToken);
      return;
    }

    if (args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide the verification code.' }, pageAccessToken);
      return;
    }

    const providedCode = args[0];
    if (providedCode !== verificationCode) {
      await sendMessage(senderId, { text: 'Incorrect verification code.' }, pageAccessToken);
      return;
    }

    try {
      global.admins = global.admins || [];
      const existingAdmin = global.admins.find((admin) => admin.userId === senderId);
      if (existingAdmin) {
        await sendMessage(senderId, { text: 'You are already an admin.' }, pageAccessToken);
        return;
      }

      const userName = await getUserName(senderId);
      global.admins.push({ userId: senderId, userName: userName || `User ${senderId}` });
      await sendMessage(senderId, { text: 'You have been added to the admin list.' }, pageAccessToken);
    } catch (error) {
      console.error('Error adding admin:', error);
      await sendMessage(senderId, { text: `An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};
        
