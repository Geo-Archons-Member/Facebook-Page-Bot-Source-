module.exports = {
  name: 'adminlist',
  description: 'Lists all current admins.',
  admin: true, //This command is admin-only
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const adminList = global.admins || [];

    if (adminList.length === 0) {
      await sendMessage(senderId, { text: 'No admins are currently listed.' }, pageAccessToken);
      return;
    }

    const formattedList = adminList.map((admin) => `- ID: ${admin.userId}, Name: ${admin.userName}`).join('\n');
    await sendMessage(senderId, { text: `Current Admins:\n${formattedList}` }, pageAccessToken);
  }
};
