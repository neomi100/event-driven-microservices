const express = require('express')
const { requireAuth } = require('../../middlewares/require.auth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addOrder, getOrderById, updateOrder, getOrderByUserId, cancelOrder } = require('./orderController')

const router = express.Router()

router.post('/', log, requireAuth, addOrder)
router.get('/by/:id', log, requireAuth, getOrderById)
router.get('/byUser/:id', log, requireAuth, getOrderByUserId)
router.put('/:orderId', log, requireAuth, updateOrder)
router.put('/cancel/:orderId', log, requireAuth, cancelOrder)

module.exports = router
