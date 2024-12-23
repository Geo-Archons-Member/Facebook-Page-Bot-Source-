module.exports = {
  name: 'adminlist',
  description: 'Lists all current admins.',
  admin: true, // This command is admin-only
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const adminList = global.admins || [];

    if (adminList.length === 0) {
      await sendMessage(senderId, { text: 'No admins are currently listed.' }, pageAccessToken);
      return;
    }

    // Developer information
    const developerInfo = `━━━━━━━━━━━━━━\n👑Developer👑; \nID: 100073129302064\nName: Aljur Pogoy\nStatus: In relationship\nPortfolio: Upcoming...\n━━━━━━━━━━━━━━`;

    // Formatted admin list
    const formattedAdminList = adminList.map((admin) => 
      `- local ID: ${admin.userId}, Name: ${admin.userName}`
    ).join('\n');

    // Send the combined message
    await sendMessage(senderId, { text: `${developerInfo}\n\nCurrent Admins:\n${formattedAdminList}` }, pageAccessToken);
  }
};
