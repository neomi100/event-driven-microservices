const logger = require('../services/logger.service')

async function log(req, res, next) {
    if (req.session && req.session.user) {
        logger.info('Req from: ' + req.session.user.username)
    }
    next()
}

module.exports = {
    log
}