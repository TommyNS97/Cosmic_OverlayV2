const { TelegramClient } = require('messaging-api-telegram');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const config = require('../../configurations/overlay_config.json');
const format = require('../Utility/Format/format.js');

const node_name = config.scripts.node_name;
const notifications = config.scripts.log_notifications.notifications;
var notif_count  = Object.keys(notifications).length;
var notif_count = Number(notif_count);

const chatId = config.scripts.telegram_chat_id;

async function notification(){
  try{
    for(var i = 0; i < notif_count; i++) {
        var obj = Object.entries(notifications)[i];
        var obj = obj[1];
        const enabled = obj.enabled
        const searchfor = obj.searchfor
        const since = obj.since
        const header = obj.header
        const dateTimeFormat = obj.format !== "" ? obj.format.dateTimeFormat : "";
        const simple = obj.format !== "" ? obj.format.simple : "false";

        const token = obj.telegram_bot_token;
        const client = new TelegramClient({
          accessToken: token,
        });

        if(enabled == 'true'){
            const command = 'sudo docker logs --since '+obj.since+' otnode | grep '+obj.searchfor
            const header = node_name + ' - '+obj.header

            exec(command, (error, stdout, stderr) => {
              if (error) {
                  return;
              }else{
                client.sendMessage(chatId, header + "\r\n" + format.formatStdout(stdout, dateTimeFormat, simple), {
                  disableWebPagePreview: true,
                  disableNotification: false,
                });
              }
            });
        }else{
          console.log(obj.header+' is disabled.');
        }
    }
  }catch(e){
    console.log(e);
    client.sendMessage(chatId, node_name+ ' failed to search logs.' + e, {
      disableWebPagePreview: true,
      disableNotification: true,
    });
    return;
  }
}
notification()
