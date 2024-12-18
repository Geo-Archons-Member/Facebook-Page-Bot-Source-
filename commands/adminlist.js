module.exports = {
  name: 'adminlist',
  description: 'Lists all current admins.',
  admin: false, // users can use also
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const adminList = global.admins || [];
    if (adminList.length === 0) {
      await sendMessage(senderId, { text: 'No admins are currently listed.' }, pageAccessToken);
      return;
    }

    // Get the user's name from the global usersData
    const user = global.usersData.find(user => user.userId === senderId);
    const userName = user ? user.userName : 'Unknown';

    const formattedList = adminList.map((admin) => {
      const adminName = global.usersData.find(user => user.userId === admin.userId)?.userName || 'Unknown';
      return `- ID: ${admin.userId} | ${adminName}`;
    }).join('\n');

    await sendMessage(senderId, { text: `Current Admins:\n${formattedList}\n\nYour ID: ${senderId} | ${userName}` }, pageAccessToken);
  }
};
