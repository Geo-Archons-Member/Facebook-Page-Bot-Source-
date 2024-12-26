const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

const commandCategories = {
    "📖 | 𝙴𝚍𝚞𝚌𝚊𝚝𝚒𝚘𝚗": ['bible', 'translate', 'teach', 'wikipedia'],
    "🖼 | 𝙸𝚖𝚊𝚐𝚎": ['avatar', 'photoleap', 'pinterest', 'emojimix', 'imagine', 'remini'],
    "🎧 | 𝙼𝚞𝚜𝚒𝚌": ['aimusic', 'music', 'spotify', 'lyrics'],
    "🤖 | AI & Chat": ['ai', 'claude2', 'claude3', 'gpt4', 'gpt4o', 'gemini', 'geminipro', 'mixtral', 'llama', 'kazuto', 'cici', 'blackbox'],
    "🕹 | Games": ['game', 'ttt', 'slot', 'riddle'],
    "🌐 | Web & Search": ['bing', 'billboard', 'wikipedia'],
    "📱 | Utilities": ['help', 'about', 'botversion', 'contact', 'corn', 'countcmd', 'daily', 'donate', 'eabab', 'emogif', 'generate', 'install', 'joke', 'liner', 'meta', 'mlbbstalk', 'npm', 'owner', 'password', 'rbg', 'say', 'shoti', 'smsbomb', 'tempmail', 'unity', 'update', 'userinfo', 'version', 'video', 'ytb'],
    "👮 | Admin": ['addadmin', 'admincheck', 'adminlist'],
    "👤 | User": ['balance', 'bankai']
};

module.exports = {
  name: 'help',
  description: 'Show available commands',
  usage: '-help',
  author: 'System',

  execute(senderId, args, pageAccessToken) {
    const response = args.length ? fetchCommandInfo(args[0]) : buildHelpMessage();
    sendMessage(senderId, { text: response }, pageAccessToken)
      .catch(error => console.error(`Error sending message: ${error.message}`));
  }
};

// Function to build the help message
function buildHelpMessage() {
  return `━━━━━━━━━━━━━━
𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜:
${Object.entries(commandCategories).map(
    ([category, commands]) => `╭─╼━━━━━━━━╾─╮\n│ ${category}\n` + commands.map(cmd => `│ - ${cmd}`).join('\n') + `\n╰─━━━━━━━━━╾─╯`
  ).join('\n')}
Chat 𝚑𝚎𝚕𝚙 [command name]
to see how to use available commands
𝙴𝚡𝚊𝚖𝚙𝚕𝚎: help bible
━━━━━━━━━━━━━━
Developer; Aljur Pogoy 
Admin; Ana sophia
━━━━━━━━━━━━━━
`;
}

// Function to fetch command information
function fetchCommandInfo(commandName) {
  const commandFilePath = path.join(__dirname, '../commands', `${commandName}.js`);
  if (fs.existsSync(commandFilePath)) {
    try {
      const command = require(commandFilePath);
      return `
━━━━━━━━━━━━━━
𝙲𝚘𝚖𝚖𝚊𝚗𝚝 𝙽𝚊𝚖𝚎: ${command.name}
𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${command.description}
𝚄𝚜𝚊𝚐𝚎: ${command.usage}
━━━━━━━━━━━━━━`;
    } catch (error) {
      return `Error loading command "${commandName}": ${error.message}`;
    }
  }
  return `Command "${commandName}" not found.`;
  }
