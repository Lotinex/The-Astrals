const http = require('http')
const socket = require('socket.io')
const COLOR = require('ansi-colors')
const Config = require('./config.json')

const Server = http.createServer()

const ws = socket(Server)

Server.listen(Config.GAME_PORT, () => {
    console.log(`${COLOR.white(COLOR.bgBlack('GAME'))} Server opened.`)
})