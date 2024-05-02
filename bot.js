const tmi = require('tmi.js');
const getDBConnection = require('./mysql');
const sendWebhookMessage = require('./webhook');
const { minutesToMilliseconds, millisToMinutesAndSeconds, isNumber } = require('./util');
var ignoreList = [];
var enabled = true;
var isQueued = false;
var duration = 600000; // 10 mins default
var bot;
var config = require('./config').config;
module.exports = function initBot() {
    let options = {
        options: { debug: config.debug },
        channels:  config.channels
    }
    duration = config.duration;

    ignoreList = config.admins.filter(user => user.rule_ignore).map(u => u.name);

    bot = new tmi.Client(options);
    bot.chatters = [];
    bot.connect().catch(console.error);

    bot.on('message', handleMessage);

    return bot; // not used
};

function handleMessage(channel, tags, message, self) {
    if(self) return;
    
    if(config.admins.some(obj => obj.name === tags.username) && channel === '#switchrl' && message.startsWith('!')) {
        const args = message.slice(1).split(' ');
        const command = args.shift().toLowerCase();
        let u = tags.username[0].toUpperCase() + tags.username.slice(1);
        if(command === 'stoplogger') {
            enabled = !enabled;
            sendWebhookMessage({content: `${u} ${enabled ? "**Enabled**" : "**Disabled**"} the Twitch Logger Notifier Service`});
        } else if(command === 'getchannelmessages') {
            if(args.length != 2 || !bot.getChannels().includes(`#${args[0]}`)) {
                return;
            }
            getChannelMessagesByLimit(args[0], args[1]);
        } else if(command === 'setduration') {
            if(args.length == 1 && isNumber(args[0])) { 
                duration = minutesToMilliseconds(args[0]);
                sendWebhookMessage(`${u} set Twitch Logger message duration to ${millisToMinutesAndSeconds(duration)}`);
            }
        }
        return;
    }

    if(ignoreList.includes(tags.username)) { return; } // ignore admin channels

    let user = {channel: channel, name: tags.username}
    if(!bot.chatters.find(u => ((u.name === user.name) && (u.channel === user.channel)))) {
        console.log(`New [${user.channel}]: ${user.name}`);
        bot.chatters.push(user);
    }

    if(enabled && !isQueued) {
        isQueued = true;
        queueMsg();
    }

    saveUserMsg(channel.substring(1), user.name, message); 
}

function queueMsg() {
    console.log(`Queuing Message ${millisToMinutesAndSeconds(duration)}`);
    setTimeout(function () {
        isQueued = false;

        let ctx = "";
        bot.getChannels().forEach(c => {
            let chatters = bot.chatters.filter((chat) => {
                return chat.channel === c
            }).map(ch => ch.name);
            if(chatters.length != 0) {
                ctx += `${c.substring(1)}: ${chatters.join(",")}\n`
            }
        });

        if(enabled && (ctx.length != 0)) {
            sendWebhookMessage(`**Twitch Chatters:**\n${ctx}`);
        }

        bot.chatters = [];
        
      }, duration);
}


function saveUserMsg(channel, username, message) {
    const sql = 'INSERT INTO `twitch`.`messages`(`channel`, `username`, `content`) VALUES (?, ?, ?)';
    const values = [channel, username, message];

    let connection = getDBConnection();
    connection.execute(sql, values, (err, result, fields) => {
      if (err instanceof Error) {
        console.log(err);
        return;
      }
    });

    connection.end();
}

function getChannelMessagesByLimit(channel, limit) {

    if(limit < 0 || limit > 30) { limit = 30; }
        
    const sql = `SELECT username,content FROM twitch.messages m WHERE m.channel='${channel}' LIMIT ${limit};`;
    let connection = getDBConnection();
    connection.query(sql, (err, rows, fields) => {
        if (err instanceof Error) {
          console.log(err);
          return;
        }

        let ctx = `Messages for ${channel}:\n`;
        if(rows.length > 0) {
            rows.forEach(r => {
                let message = r.content;
                if(message.length > 50) {
                    message = `${r.content.substring(0,50)}...`;
                }

                ctx += `${r.username}:${message}\n`
                message = '';
            });
        }

        if(ctx.length > 1000) {
            ctx.substring(0,999);
        }
        sendWebhookMessage(ctx);
      });

      connection.end();
}