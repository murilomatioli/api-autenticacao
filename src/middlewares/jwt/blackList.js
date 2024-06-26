const { createBlackList } = require('jwt-blacklist');

const blacklist = createBlackList({
    daySize: 200,
})

module.exports = blacklist