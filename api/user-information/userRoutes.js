const express = require('express')
const { requireAuth } = require('../../middlewares/require.auth.middleware')
const { getUser, deleteUser, updateUser } = require('./userController')
const router = express.Router()

router.get('/:userId', getUser)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser, requireAuth)

module.exports = router
