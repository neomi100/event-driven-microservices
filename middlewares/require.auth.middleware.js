const logger = require('../services/logger.service')

function requireAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        logger.error('There is no user logged in')
        res.status(401).end('Unauthorized!')
        return
    }
    next()
}

module.exports = {
    requireAuth
}