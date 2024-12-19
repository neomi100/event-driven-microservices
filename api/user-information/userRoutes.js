const express = require('express')
const { requireAuth } = require('../../middlewares/require.auth.middleware')
const { getUser, deleteUser, updateUser } = require('./userController')
const { log } = require('../../middlewares/logger.middleware')

const router = express.Router()

router.get('/:userId', requireAuth, getUser)
router.put('/:userId', log, requireAuth, updateUser)
router.delete('/:userId', requireAuth, deleteUser)

module.exports = router
