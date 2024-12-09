
const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');

module.exports = {
  name: 'cmd',
  description: 'Manage command files',
  admin: true,
  async execute(args, message, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData) {
    const { unloadScripts, loadScripts } = global.utils;
    const getLang = global.getLang;

    // Load command
    if (args[0] === 'load' && args.length === 2) {
      const fileName = args[1];
      const infoLoad = loadScripts('cmds', fileName, log, configCommands, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, getLang);
      if (infoLoad.status === 'success') {
        message.reply(getLang('loaded', infoLoad.name));
      } else {
        message.reply(getLang('loadedError', infoLoad.name, infoLoad.error.name, infoLoad.error.message));
      }
    }

    // Load all commands
    else if ((args[0] || '').toLowerCase() === 'loadall' || (args[0] === 'load' && args.length > 2)) {
      const fileNeedToLoad = args[0].toLowerCase() === 'loadall' ? fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && !file.match(/(eg)\.js$/g) && (process.env.NODE_ENV === 'development' ? true : !file.match(/(dev)\.js$/g)) && !configCommands.commandUnload?.includes(file)).map(item => item = item.split('.')[0]) : args.slice(1);
      const arraySucces = [];
      const arrayFail = [];
      for (const fileName of fileNeedToLoad) {
        const infoLoad = loadScripts('cmds', fileName, log, configCommands, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, getLang);
        if (infoLoad.status === 'success') {
          arraySucces.push(fileName);
        } else {
          arrayFail.push(` ❗ ${fileName} => ${infoLoad.error.name}: ${infoLoad.error.message}`);
        }
      }
      let msg = '';
      if (arraySucces.length > 0) msg += getLang('loadedSuccess', arraySucces.length);
      if (arrayFail.length > 0) {
        msg += (msg ? '\n' : '') + getLang('loadedFail', arrayFail.length, arrayFail.join('\n'));
        msg += '\n' + getLang('openConsoleToSeeError');
      }
      message.reply(msg);
    }

    // Unload command
    else if (args[0] === 'unload') {
      const fileName = args[1];
      const infoUnload = unloadScripts('cmds', fileName, configCommands, getLang);
      if (infoUnload.status === 'success') {
        message.reply(getLang('unloaded', infoUnload.name));
      } else {
        message.reply(getLang('unloadedError', infoUnload.name, infoUnload.error.name, infoUnload.error.message));
      }
    }

    // Install command
    else if (args[0] === 'install') {
      let url = args[1];
      let fileName = args[2];
      let rawCode;
      if (!url || !fileName) return message.reply(getLang('missingUrlCodeOrFileName'));
      // ...
    }

    else {
      message.SyntaxError();
    }
  }
};
