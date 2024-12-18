const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'help',
  description: 'Show available commands',
  usage: 'help\nhelp [command name]',
  author: 'System',
  execute(senderId, args, pageAccessToken) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    if (args.length > 0) {
      const commandName = args[0].toLowerCase();
      const commandFile = commandFiles.find(file => {
        const command = require(path.join(commandsDir, file));
        // Check if the command is not hidden
        return command.name.toLowerCase() === commandName && !command.hidden; 
      });

      if (commandFile) {
        const command = require(path.join(commandsDir, commandFile));
        const commandDetails = `━━━━━━━━━━━━━━𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙽𝚊𝚖𝚎: ${command.name}
𝙳𝚎𝚜𝚌𝚛𝚒𝚋𝚝𝚒𝚘𝚗: ${command.description}
𝚄𝚜𝚊𝚐𝚎: ${command.usage}
━━━━━━━━━━━━━━`;
        sendMessage(senderId, { text: commandDetails }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: `Command "${commandName}" not found.` }, pageAccessToken);
      }
      return;
    }

    // Filter out hidden commands
    const commands = commandFiles.map(file => {
      const command = require(path.join(commandsDir, file));
      // Only include commands that are not hidden
      if (!command.hidden) {
        return `│ - ${command.name}`;
      }
    }).filter(Boolean); // Remove null values from the array

    const helpMessage = `━━━━━━━━━━━━━━𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜:
╭─╼━━━━━━━━╾─╮
${commands.join('\n')}
╰─━━━━━━━━━╾─╯
Chat help [name] to see command details.
━━━━━━━━━━━━━━`;
    sendMessage(senderId, { text: helpMessage }, pageAccessToken);
  }
};
          
