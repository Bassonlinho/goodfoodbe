'use strict';
var OneSignal = require('onesignal-node');
require('dotenv').config();

var myClient = new OneSignal.Client({
    userAuthKey: process.env.ONE_SIGNAL_USER_AUTH_KEY,
    app: {
        appAuthKey: process.env.ONE_SIGNAL_APP_AUTH_KEY,
        appId: process.env.ONE_SIGNAL_APP_ID
    }
});

module.exports = {
    sendWEBNotification: (player_ids, body, title='GoodFood') => {
        var notification = new OneSignal.Notification({
            headings: { en: title },
            contents: {
                en: body,
            },
            include_player_ids: player_ids
        });

        myClient.sendNotification(notification)
            .then(function (response) {
                console.log(response.data, response.httpResponse.statusCode);
            })
            .catch(function (err) {
                console.log('Something went wrong...', err);
            });
    },

    sendMobileNotification: (player_ids, body, title = 'AgroLIFE') => {
        var notification = new OneSignal.Notification({
            headings: { en: title },
            contents: {
                en: body,
            },
            include_player_ids: player_ids,
            android_background_layout: {
                headings_color: "ff000000",
                contents_color: "ff000000"
            },
            small_icon: "ic_stat_onesignal_default",
        });

        myClient.sendNotification(notification)
            .then(function (response) {
                console.log(response.data, response.httpResponse.statusCode);
            })
            .catch(function (err) {
                console.log('Something went wrong...', err);
            });
    },
};