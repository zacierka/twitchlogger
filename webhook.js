const { WebhookClient } = require('discord.js');
const webhookClient = new WebhookClient({ id: process.env.DISCORD_WEBHOOK_ID, token: process.env.DISCORD_WEBHOOK_TOKEN });

function sendWebhookMessage(message) {
    webhookClient.send({content: `${message}`});
}

module.exports = sendWebhookMessage;