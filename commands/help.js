const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage'); // Assuming you have a sendMessage function

const commandCategories = {
  "📖 | 𝙴𝚍𝚞𝚌𝚊𝚝𝚒𝚘𝚗": ['bible', 'translate', 'teach', 'wikipedia'],
  "🖼 | 𝙸𝚖𝚊𝚐𝚎": ['avatar', 'photoleap', 'pinterest', 'emojimix', 'imagine', 'remini'],
  "🎧 | 𝙼𝚞𝚜𝚒𝚌": ['aimusic', 'music', 'spotify', 'lyrics'],
  "🤖 | AI & Chat": ['ai', 'claude2', 'claude3', 'gpt4', 'gpt4o', 'gemini', 'geminipro', 'mixtral', 'llama'],
  "🕹 | Games": ['game', 'ttt', 'slot', 'riddle'],
  "🌐 | Web & Search": ['bing', 'billboard', 'wikipedia'],
  "📱 | Utilities": ['help', 'about', 'botversion', 'contact', 'corn', 'countcmd', 'daily', 'donate', 'eabab', 'emogif', 'generate', 'install', 'joke', 'kazuto', 'liner', 'meta', 'mlbbstalk', 'npm', 'owner', 'password', 'rbg', 'say', 'shoti', 'smsbomb', 'tempmail', 'unity', 'update', 'userinfo', 'version', 'video', 'ytb'],
  "👮 | Admin": ['addadmin', 'admincheck', 'adminlist'],
  "👤 | User": ['balance', 'bankai']
};

module.exports = {
  name: 'help',
  description: 'Show available commands',
  usage: '-help [command name]',
  author: 'System',
  imageUrl: "https://imgur.com/a/X7Y5Nsv.mp4",
  async execute(senderId, args, pageAccessToken) {
    const commandName = args[0];
    if (commandName) {
      const commandInfo = await fetchCommandInfo(commandName);
      if (commandInfo.imageUrl) {
        sendMessage(senderId, {
          attachment: {
            type: 'video', // Use 'video' for video attachments
            payload: {
              url: commandInfo.imageUrl,
            },
          },
        }, pageAccessToken)
          .catch(error => console.error(`Error sending message: ${error.message}`));
      } else {
        sendMessage(senderId, { text: commandInfo.text }, pageAccessToken)
          .catch(error => console.error(`Error sending message: ${error.message}`));
      }
    } else {
      sendMessage(senderId, { text: buildHelpMessage() }, pageAccessToken)
        .catch(error => console.error(`Error sending message: ${error.message}`));
    }
  },
};

// Function to build the help message
function buildHelpMessage() {
  return `━━━━━━━━━━━━━━
  𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜:
  ${Object.entries(commandCategories).map(
    ([category, commands]) => `╭─╼━━━━━━━━╾─╮\n│ ${category}\n` + commands.map(cmd => `│ - ${cmd}`).join('\n') + `\n╰─━━━━━━━━━╾─╯`
  ).join('\n')}
  Chat 𝚑𝚎𝚕𝚙 [command name]
  to see how to use available commands.
  developer: Aljur Pogoy
  admin: Ana Sophia
  𝙴𝚡𝚊𝚖𝚙𝚕𝙴: help bible
  ━━━━━━━━━━━━━━`;
}

// Function to fetch command information
async function fetchCommandInfo(commandName) {
  const commandFilePath = path.join(__dirname, '../commands', `${commandName}.js`);
  if (fs.existsSync(commandFilePath)) {
    try {
      const command = require(commandFilePath);
      const imageUrl = command.config.imageUrl || null; // Get image URL from command config
      if (imageUrl) {
        return {
          text: `━━━━━━━━━━━━━━
          𝙲𝚘𝚖𝚖𝚊𝚗𝚝 𝙽𝚊𝚖𝚎: ${command.config.name}
          𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${command.config.description}
          𝚄𝚜𝚊𝚐𝚎: ${command.config.usage}
          ━━━━━━━━━━━━━━`,
          imageUrl: imageUrl, // Directly use the provided Imgur URL
        };
      } else {
        return {
          text: `━━━━━━━━━━━━━━
          𝙲𝚘𝚖𝚖𝚊𝚗𝚝 𝙽𝚊𝚖𝚎: ${command.config.name}
          𝙳𝚎ಸ್𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${command.config.description}
          𝚄𝚜𝚊𝚐𝚎: ${command.config.usage}
          ━━━━━━━━━━━━━━`,
        };
      }
    } catch (error) {
      return `Error loading command "${commandName}": ${error.message}`;
    }
  }
  return `Command "${commandName}" not found.`;
          }
      
