const express = require('express')
const COLOR = require('ansi-colors')
const Config = require('./config.json')
const LANG = require('./lang.json')
const FS = require('fs')
const GLOB = require('glob')

const Server = express()

Server.use(express.static(__dirname + '/public'));
Server.use(express.json())
Server.set('views', __dirname + '/views')
Server.set('view engine', 'pug');



Server.listen(Config.WEB_PORT, function(){
    console.log(`${COLOR.black(COLOR.bgWhite('WEB'))} Server opened.`)
})

Server.get('/', function(req, res){
     res.render('index')
})

Server.get('/lang', (req, res) => {
    res.send("window.LANG = " + JSON.stringify(LANG))
})