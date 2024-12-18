const express = require('express')
const { requireAuth } = require('../../middlewares/require.auth.middleware')
const { getUser, deleteUser, updateUser } = require('./userController')
const router = express.Router()

router.get('/:userId', requireAuth, getUser)
router.put('/:userId', requireAuth, updateUser)
router.delete('/:userId', requireAuth, deleteUser)

module.exports = router
