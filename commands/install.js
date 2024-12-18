const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  name: 'install',
  description: 'Install a command from code text',
  admin: true,
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const codeText = args.join(' ');
    if (codeText === "") {
      sendMessage(senderId, { text: "Usage: /install <code text>" }, pageAccessToken);
      return;
    }

    sendMessage(senderId, { text: 'Installing command... Please wait.' }, pageAccessToken);

    try {
      // Extract the command name from the code
      const commandNameMatch = codeText.match(/name: '([^']+)'/);
      let commandName = commandNameMatch ? commandNameMatch[1] : 'unknown';

      // Create the command file path
      const commandFilePath = path.join(__dirname, `${commandName}.js`);

      // Write the code to the file
      await fs.writeFile(commandFilePath, codeText);

      // Load the command
      global.commands.set(commandName, require(commandFilePath));

      sendMessage(senderId, { text: `Command '${commandName}' installed successfully!` }, pageAccessToken);
    } catch (error) {
      console.error('Error installing command:', error);
      sendMessage(senderId, { text: 'There was an error installing the command. Please try again later.' }, pageAccessToken);
    }
  }
};
