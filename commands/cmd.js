const fs = require('fs');
const path = require('path');

// Function to install a new command
function installCommand(commandName, commandData) {
  // 1. Check if the command already exists
  const commandPath = path.join(__dirname, 'commands', `${commandName}.js`);
  if (fs.existsSync(commandPath)) {
    console.error(`Command "${commandName}" already exists.`);
    return false;
  }

  // 2. Check if the command is marked as admin-only
  if (!commandData.admin) {
    console.error(`Command "${commandName}" is not marked as admin-only.`);
    return false;
  }

  // 3. Create the command file
  try {
    fs.writeFileSync(commandPath, `
      const axios = require('axios');

      module.exports = {
        name: '${commandName}',
        description: '${commandData.description}',
        author: '${commandData.author}',
        admin: true, // Include the admin flag in the command file
        async execute(senderId, args, pageAccessToken, sendMessage) {
          // Your command logic goes here
          // Example:
          const prompt = args.join(' ');
          if (prompt === "") {
            sendMessage(senderId, { text: "Usage: /${commandName} <your input>" }, pageAccessToken);
            return; 
          }
          // ... your command logic ...
        }
      };
    `);
    console.log(`Command "${commandName}" installed successfully.`);
    return true;
  } catch (error) {
    console.error(`Error installing command "${commandName}":`, error);
    return false;
  }
}

// Example usage:
const newCommand = {
  name: 'adminCommand',
  description: 'This is an admin-only command',
  author: 'Your Name',
  admin: true, // Mark the command as admin-only
};

installCommand(newCommand.name, newCommand);
