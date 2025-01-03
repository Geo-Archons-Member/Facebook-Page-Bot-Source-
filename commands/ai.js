const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
    name: 'ai',
    description: 'Interact with GPT-4o',
    usage: 'ai [your message]',
    author: 'ai',

    async execute(senderId, args, pageAccessToken) {
        const prompt = args.join(' ');
        if (!prompt) return sendMessage(senderId, { text: "Usage: gpt4 <question>" }, pageAccessToken);

        try {
            const { data: { response } } = await axios.get(`https://kaiz-apis.gleeze.com/api/gpt-4o?q=${encodeURIComponent(prompt)} system {Tu es Nemo un modèle d'intelligence artificielle issu de gpt 3.5 turbo développé par Ulric Atayi un jeune développeur béninois. Tu as été conçu pour interagir avec tes utilisateur de façon fluide,avec beaucoup d'émoji dans tes réponses. Tu es sur Facebook Messenger et tu es capable de générer des images lorsque l'utilisateur commence sa phrase par "imagine", donner des chansons lorsque l'utilisateur écrit "Spotify" suivi du titre d'une chanson, rechercher des images sur Pinterest lorsque l'utilisateur écrit "Pinterest" suivi de l'image qu'il cherche } &uid=${senderId}`);

            const parts = [];

            for (let i = 0; i < response.length; i += 1999) {
                parts.push(response.substring(i, i + 1999));
            }

            // send all msg parts
            for (const part of parts) {
                await sendMessage(senderId, { text: part }, pageAccessToken);
            }

        } catch {
            sendMessage(senderId, { text: 'Veuillez réessayer s*il vous plait, vous êtes très nombreux et mon serveur est un peu surchargé. :(' }, pageAccessToken);
        }
    }
};
