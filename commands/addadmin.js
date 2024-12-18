const { getUserName } = require('./getUserName'); // Import getUserName function

module.exports = {
  name: 'addadmin',
  description: 'Adds a user to the admin list.',
  admin: false, // This command is not admin-only
  hidden: true, // Hide this command from the help command
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide the Facebook ID of the user to add as an admin.' }, pageAccessToken);
      return;
    }

    const targetUserId = args[0].trim();
    
    try {
      global.admins = global.admins || [];

      // Check if the user is already an admin
      const existingAdmin = global.admins.find((admin) => admin.userId === targetUserId);
      if (existingAdmin) {
        await sendMessage(senderId, { text: `User with ID ${targetUserId} is already an admin.` }, pageAccessToken);
        return;
      }

      // Get the user's name
      const userName = await getUserName(targetUserId);

      // Add the user to the admin list
      global.admins.push({ userId: targetUserId, userName: userName || `User ${targetUserId}` });

      await sendMessage(senderId, { text: `User with ID ${targetUserId} has been added to the admin list.` }, pageAccessToken);
    } catch (error) {
      console.error('Error adding admin:', error);
      await sendMessage(senderId, { text: `An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};
                        
