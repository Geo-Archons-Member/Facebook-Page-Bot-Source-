const { post, get } = require("axios");
const { sendMessage } = require('../handles/sendMessage'); // Assuming you have sendMessage function

module.exports = {
  config: { name: "kazuto", category: "" },
  admin: false, // This command is not admin-only
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const cmd = `${module.exports.config.name}`;
      const pref = `${utils.getPrefix(t)}`;
      const pr = [`${pref}${cmd}`, `${cmd}`];
      const _m = "gpt";
      if (args[0] && pr.some(x => args[0].toLowerCase() === x)) {
        const p = args.slice(1);
        const assistant = ["lover", "helpful", "friendly", "toxic", "bisaya", "horny", "tagalog" /*"makima", "godmode", "default"*/];
        const models = { 1: "llama", 2: "gemini" };
        let ads = "";
        if (role === 2) {
          ads = `To change model use:\n${cmd} model <num>\nTo allow NSFW use:\n${cmd} nsfw on/off`;
        }
        const num = assistant.map((i, x) => `${x + 1}. ${i}`).join("\n");
        const { name, settings = {}, gender } = await usersData.get(senderId) || {};
        const gen = gender === 2 ? 'male' : 'female';
        const sys = settings.system || "helpful";
        let url = undefined;
        if (msg && ["photo", "audio", "sticker"].includes(msg.attachments[0]?.type)) {
          url = { link: msg.attachments[0].url, type: msg.attachments[0].type === "photo" || msg.attachments[0].type === "sticker" ? "image" : "mp3" };
        }
        if (!p.length) return sendMessage(senderId, { text: `Hello ${name}, choose your assistant:\n${num}\nExample: ${cmd} set friendly\n\n${ads}` }, pageAccessToken);
        const mods = await globalData.get(_m) || { data: {} };
        if (p[0].toLowerCase() === "set" && p[1]?.toLowerCase()) {
          const choice = p[1].toLowerCase();
          if (assistant.includes(choice)) {
            await usersData.set(senderId, { settings: { ...settings, system: choice } });
            return sendMessage(senderId, { text: `Assistant changed to ${choice}` }, pageAccessToken);
          }
          return sendMessage(senderId, { text: `Invalid choice.\nAllowed: ${num}\nExample: ai set friendly` }, pageAccessToken);
        }
        if (p[0] === 'nsfw') {
          if (role < 2) {
            return sendMessage(senderId, { text: "You don't have permission to use this." }, pageAccessToken);
          }
          if (p[1].toLowerCase() === 'on') {
            mods.data.nsfw = true;
            await globalData.set(_m, mods);
            return sendMessage(senderId, { text: `Successfully turned on NSFW. NSFW features are now allowed to use.` }, pageAccessToken);
          } else if (p[1].toLowerCase() === 'off') {
            mods.data.nsfw = false;
            await globalData.set(_m, mods);
            return sendMessage(senderId, { text: `Successfully turned off NSFW. NSFW features are now disabled.` }, pageAccessToken);
          } else {
            return sendMessage(senderId, { text: `Invalid usage: to toggle NSFW, use 'nsfw on' or 'nsfw off'.` }, pageAccessToken);
          }
        }
        if (p[0].toLowerCase() === "model") {
          if (role < 2) {
            return sendMessage(senderId, { text: "You don't have permission to use this." }, pageAccessToken);
          }
          const _model = models[p[1]];
          if (_model) {
            try {
              mods.data.model = _model;
              await globalData.set(_m, mods);
              return sendMessage(senderId, { text: `Successfully changed model to ${_model}` }, pageAccessToken);
            } catch (error) {
              return sendMessage(senderId, { text: `Error setting model: ${error}` }, pageAccessToken);
            }
          } else {
            return sendMessage(senderId, { text: `Please choose only number\navailabale model\n${Object.entries(models).map(([id, name]) => `${id}: ${name}`).join("\n")}\n\nexample: ${pref}${cmd} model 1` }, pageAccessToken);
          }
        }
        let Gpt = await globalData.get(_m);
        if (!Gpt || Gpt === "undefined") {
          await globalData.create(_m, { data: { model: "llama", nsfw: false } });
          Gpt = await globalData.get(_m);
        }
        const { data: { nsfw, model } } = Gpt;
        const { result, media } = await ai(p.join(" "), senderId, name, sys, gen, model, nsfw, url);
        let attachments;
        if (media && media.startsWith(" { ")) {
          attachments = await global.utils.getStreamFromURL(media, "spotify.mp3");
        } else if (media) {
          attachments = await global.utils.getStreamFromURL(media);
        }
        const rs = {
          text: result.replace(/😂/g, "🤭"),
          mentions: [{ id: senderId, tag: name }]
        };
        if (attachments) {
          rs.attachment = attachments;
        }
        await sendMessage(senderId, rs, pageAccessToken);
      }
    } catch (error) {
      console.error('Error executing AI command:', error);
      await sendMessage(senderId, { text: `An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};

//llama3-70b-8192
async function ai(prompt, id, name, system, gender, model, nsfw, link = "") {
  const g4o = async (p, m = "gemma2-9b-it") => post(atob(String.fromCharCode(...atob((await get(atob("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2p1bnpkZXZvZmZpY2lhbC90ZXN0L3JlZnMvaGVhZHMvbWFpbi90ZXN0LnR4dA=="))).data).split(" ").map(Number))),
    {
      id,
      prompt: p,
      name,
      model,
      system,
      customSystem: [
        { default: "You are helpful assistant" },
        {
          makima: "You are a friendly  assistant, your name is makima"
        }
      ],
      /*Don't use the same system name that has already used on external api to avoid conflict*/
      gender,
      nsfw,
      url: link ? link : undefined, /*@{object}  { link, type: "image or mp3" } */
      config: [{
        gemini: { apikey: "AIzaSyAqigdIL9j61bP-KfZ1iz6tI9Q5Gx2Ex_o", model: "gemini-1.5-flash" },
        llama: { model: m }
      }]
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test'
      }
    });
  try {
    let res = await g4o(prompt);
    if (["i cannot", "i can't"].some(x => res.data.result.toLowerCase().startsWith(x))) {
      await g4o("clear");
      res = await g4o(prompt, "llama-3.1-70b-versatile");
    }
    return res.data;
  } catch {
    try {
      //  await g4o("clear");
      return (await g4o(prompt, "llama-3.1-70b-versatile")).data;
    } catch (err) {
      const e = err.response?.data;
      const errorMessage = typeof e === 'string' ? e : JSON.stringify(e);
      return errorMessage.includes("Payload Too Large") ? { result: "Your text is too long" } :
        errorMessage.includes("Service Suspended") ? { result: "The API has been suspended, please wait for the dev to replace the API URL" }:
          { result: e?.error || e || err.message };
    }
  }
}
