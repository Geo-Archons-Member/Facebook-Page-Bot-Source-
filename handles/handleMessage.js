const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage'); // Your sendMessage function
const commands = new Map();
const prefix = '/';

// Load admin data from config.json
const adminData = JSON.parse(fs.readFileSync('config.json', 'utf8')).ADMINS;
global.admins = adminData.map(admin => ({ userId: admin.uid, userName: admin.name }));

fs.readdirSync(path.join(__dirname, '../commands'))
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const command = require(`../commands/${file}`);
    commands.set(command.name, command); // Removed toLowerCase()
  });

async function handleMessage(event, pageAccessToken) {
  const senderId = event?.sender?.id;
  if (!senderId) return console.error('Invalid event object');
  const messageText = event?.message?.text?.trim();
  if (!messageText) return console.log('Received event without message text');
  const [commandName, ...args] = messageText.startsWith(prefix)
    ? messageText.slice(prefix.length).split(' ')
    : messageText.split(' ');
  try {
    const command = commands.get(commandName); // Removed toLowerCase()
    if (command) {
      if (command.admin && !(global.admins || []).find(admin => admin.userId === senderId)) {
        await sendMessage(senderId, { text: 'You do not have permission to use this command.' }, pageAccessToken);
        return;
      }
      await command.execute(senderId, args, pageAccessToken, sendMessage);
    } else {
      await sendMessage(senderId, { text: `Unknown command: ${messageText}` }, pageAccessToken);
    }
  } catch (error) {
    console.error(`Error handling message:`, error);
    await sendMessage(senderId, { text: `An error occurred: ${error.message}` }, pageAccessToken);
  }
}

module.exports = { handleMessage };
