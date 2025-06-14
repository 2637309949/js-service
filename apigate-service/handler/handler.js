const micro = require('comm/micro')
const util = require('comm/util')
const file = util.file
const  {
    createReadStreamR
} = file
const {
    withAction,
} = micro
const responseTypeHtml = 'text/html; charset=UTF-8'

withAction({
    home: createReadStreamR('./public/index.html', responseTypeHtml),
    login: createReadStreamR('./public/login.html', responseTypeHtml),
    register: createReadStreamR('./public/register.html', responseTypeHtml),
})
