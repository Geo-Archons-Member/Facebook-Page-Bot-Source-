const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'install',
  description: 'Install a new command (paste the JavaScript code)',
  admin: true,
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // 1. Get the code from the user's message
    const code = args.join(' '); // Combine all arguments into a single string
    if (code.trim() === '') {
      sendMessage(senderId, { text: 'Please paste the JavaScript code for your command.' }, pageAccessToken);
      return;
    }

    // 2. Extract the command name from the code (assuming it's in the 'name' property)
    let commandName = null;
    try {
      const commandObject = eval(`(${code})`); // Evaluate the code as a JavaScript object
      commandName = commandObject.name;
    } catch (error) {
      sendMessage(senderId, { text: 'Invalid JavaScript code. Please check your code and try again.' }, pageAccessToken);
      return;
    }

    // 3. Check if the command already exists
    const commandPath = path.join(__dirname, 'commands', `${commandName}.js`);
    if (fs.existsSync(commandPath)) {
      sendMessage(senderId, { text: `Command "${commandName}" already exists.` }, pageAccessToken);
      return;
    }

    // 4. Create the command file
    try {
      fs.writeFileSync(commandPath, code);
      sendMessage(senderId, { text: `Command "${commandName}" installed successfully.` }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: `Error installing command "${commandName}".` }, pageAccessToken);
    }
  }
};
        
