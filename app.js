/**
 * A Wechaty application
 * Connect, Publish event with a socket.io
 */
const { Wechaty, Config, Message } = require('wechaty')
const debug = require('debug')('ss-wechaty')
const QrcodeTerminal = require('qrcode-terminal')
const LOGIC_SERVER_URL = process.env['LOGIC_SERVER_URL']
const bot = Wechaty.instance({ profile: Config.DEFAULT_PROFILE })
var socket;

bot
    .on('login', user => {
        console.log(`Bot ${user.name()} logined.`)
        if (LOGIC_SERVER_URL) {
            socket = require('socket.io-client')(LOGIC_SERVER_URL)
            socket.on('connect', function () {
                console.log('socket.io', 'connected.')
            });
            socket.on('server:wechaty', function (data) {
                console.log('socket.io', 'server:wechaty', data)
                if (data.response && data.response.string && data.rawObj) {
                    let m = new Message(data.rawObj);
                    m.say(data.response.string);
                } else {
                    console.log('Omit reply.')
                }
            });
        }
    })
    .on('logout', user => {
        console.log(`Bot ${user.name()} logined.`)
    })
    .on('scan', (url, code) => {
        if (!/201|200/.test(code)) {
            let loginUrl = url.replace(/\/qrcode\//, '/l/')
            QrcodeTerminal.generate(loginUrl, function (qrcode) {
                console.log(`${url}\n[${code}] Scan QR Code in above url to login: \n ${qrcode}`)
            })
        }
    })
    .on('friend', (contact, request) => {
        if (request) {
            debug('Accept friend %s.', contact.name())
            request.accept()
            contact.say('Hello.')
        }
    })
    .on('message', message => {
        debug('on Message %s:%s', message.from().name(), message.content())
        onMessage(message, (err, response) => {
            if (err) {
                return console.error('onMessage', err)
            }
            if (response && response.string) {
                debug('Reply: %s', response.string)
                // m.say(response.string)
            }
        })
    })

bot.init()
    .then(() => {
        debug('Bot is starting ...')
    })
    .catch(e => {
        console.log('Bot gets error', e)
        bot.quit()
        process.exit(-1)
    })

/**
 * Only reply private text message currently.
 */
function onMessage(message, cb) {
    // Only reply text message.
    // https://github.com/Chatie/wechaty/blob/master/src/message.ts#L169
    let room = message.room() ? message.room().topic() : null;
    if (socket && (message.type() === 1) && !room) {
        let m = {
            author: message.from().name(),
            content: message.content(),
            rawObj: message.rawObj
        }
        debug('socket.io', 'emit', m)
        socket.emit('wechaty:server', m)
    } else {
        cb()
    }
}