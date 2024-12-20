const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');
const commands = new Map();
const prefix = '/';
const commandCategories = {};


function loadCommands(commandsDir) {
    const commandFiles = fs.readdirSync(commandsDir)
        .filter(file => file.endsWith('.js'));

    commandFiles.forEach(file => {
        const command = require(path.join(commandsDir, file));
        commands.set(command.name, command);

        //Improved category handling:
        command.category = command.category || 'Others'; //Default to 'Others' if category is missing
        commandCategories[command.category] = commandCategories[command.category] || [];
        commandCategories[command.category].push(command);
    });
}

async function handleMessage(event, pageAccessToken) {
    const senderId = event?.sender?.id;
    if (!senderId) {
        console.error('Invalid event object:', event);
        return;
    }

    const messageText = event?.message?.text?.trim();
    if (!messageText) {
        console.log('Received event without message text:', event);
        return;
    }

    const [commandName, ...args] = messageText.startsWith(prefix)
        ? messageText.slice(prefix.length).split(' ')
        : [messageText]; // Handle messages without prefix as commands


    try {
        const command = commands.get(commandName.toLowerCase()); // Case-insensitive command matching

        if (command) {
            if (command.admin && !(global.admins || []).find(admin => admin.userId === senderId)) {
                await sendMessage(senderId, { text: 'You do not have permission to use this command.' });
                return;
            }
            await command.execute(senderId, args, pageAccessToken, sendMessage);
        } else if (commandName.toLowerCase() === 'help') {
            await handleHelpCommand(senderId, args, sendMessage);
        } else {
            await sendMessage(senderId, { text: `Unknown command: ${messageText}` });
        }
    } catch (error) {
        console.error('Error handling message:', error);
        await sendMessage(senderId, { text: `An error occurred: ${error.message}` });
    }
}

async function handleHelpCommand(senderId, args, sendMessage) {
    if (args.length > 0) {
        const commandName = args[0].toLowerCase();
        const command = commands.get(commandName);
        if (command) {
            await sendMessage(senderId, { text: generateCommandHelp(command) });
        } else {
            await sendMessage(senderId, { text: `Command "${commandName}" not found.` });
        }
    } else {
        await sendMessage(senderId, { text: generateGeneralHelp(commandCategories) });
    }
}

function generateCommandHelp(command) {
    return `━━━━━━━━━━━━━━
    𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙽𝚊𝚖𝚎: ${command.name}
    𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${command.description || 'No description provided.'}
    𝚄𝚜𝚊𝚐𝚎: ${command.usage || 'No usage information provided.'}
    ━━━━━━━━━━━━━━`;
}

function generateGeneralHelp(categories) {
    let helpMessage = '━━━━━━━━━━━━━━\n𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚂:\n';
    for (const category in categories) {
        helpMessage += `╭─╼━━━━━━━━╾─╮\n│ 📖 | ${category}\n`;
        categories[category].forEach(command => helpMessage += `│ - ${command.name}\n`);
        helpMessage += `╰─━━━━━━━━━╾─╯\n`;
    }
    helpMessage += 'Chat -help [command name] to see command details.\n━━━━━━━━━━━━━━';
    return helpMessage;
}

loadCommands(path.join(__dirname, '../commands')); // Load commands on startup

module.exports = { handleMessage };
                
