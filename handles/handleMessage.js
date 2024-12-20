const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage'); // Your sendMessage function

const commands = new Map();
const prefix = '/';
const commandCategories = {
  "𝙴𝚍𝚞𝚌𝚊𝚝𝚒𝚘𝚗": []
};

fs.readdirSync(path.join(__dirname, '../commands'))
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const command = require(`../commands/${file}`);
    commands.set(command.name, command);
    commandCategories[command.category].push(command.name);
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
    const command = commands.get(commandName);
    if (command) {
      if (command.admin && !(global.admins || []).find(admin => admin.userId === senderId)) {
        await sendMessage(senderId, { text: 'You do not have permission to use this command.' }, pageAccessToken);
        return;
      }
      await command.execute(senderId, args, pageAccessToken, sendMessage);
    } else {
      // Handle help command
      if (commandName === 'help') {
        if (args.length > 0) {
          const commandToHelp = args[0].toLowerCase();
          const command = commands.get(commandToHelp);
          if (command) {
            const commandDetails = `━━━━━━━━━━━━━━
            𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙽𝚊𝚖𝚎: ${command.name}
            𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${command.description}
            𝚄𝚜𝚊𝚐𝚎: ${command.usage}
            ━━━━━━━━━━━━━━`;
            sendMessage(senderId, { text: commandDetails }, pageAccessToken);
          } else {
            sendMessage(senderId, { text: `Command "${commandToHelp}" not found.` }, pageAccessToken);
          }
          return;
        }
        // Show all commands with categories
        let helpMessage = '━━━━━━━━━━━━━━\n𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜:\n';
        for (const category in commandCategories) {
          helpMessage += `╭─╼━━━━━━━━╾─╮\n│ 📖 | ${category}\n${commandCategories[category].map(command => `│ - ${command}`).join('\n')}\n╰─━━━━━━━━━╾─╯\n`;
        }
        helpMessage += 'Chat -help [command name] to see command details.\n━━━━━━━━━━━━━━';
        sendMessage(senderId, { text: helpMessage }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: `Unknown command: ${messageText}` }, pageAccessToken);
      }
    }
  } catch (error) {
    console.error(`Error handling message:`, error);
    await sendMessage(senderId, { text: `An error occurred: ${error.message}` }, pageAccessToken);
  }
}

module.exports = { handleMessage };
            
