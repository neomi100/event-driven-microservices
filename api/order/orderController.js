const logger = require('../../services/logger.service')
const orderService = require('./orderService')


async function addOrder(req, res) {
    try {
        const userId = req.session.user._id
        if (!userId) throw new Error('You must login to order');
        const updateOrder = await orderService.add(userId)
        res.json({ message: `Your order number ${updateOrder.number} has been received`, updateOrder })
    } catch (error) {
        logger.error('Failed to add order', error)
        res.status(500).send({ error: 'Failed to add order' })
    }
}

async function getOrderById(req, res) {
    try {
        const userId = req.session.user._id
        if (!userId) throw new Error('You must login to access your order');
        const orderId = req.params.id;
        if (!orderId) throw new Error('The information does not match');
        const order = await orderService.getById(orderId, userId);
        res.json({ message: `Your order number ${order.number}`, order })
    } catch (error) {
        logger.error('Failed to get your order', error)
        res.status(500).json({ error: 'Failed to get your order' })
    }
}

async function getOrderByUserId(req, res) {
    try {
        const userId = req.session.user._id
        if (!userId) throw new Error('You must login to access your order');
        const paramsUserId = req.params.id;
        if (paramsUserId !== userId) throw new Error('The information does not match');
        const order = await orderService.getByUserId(userId);
        res.json({ message: `Your order number ${order.number}`, order })
    } catch (error) {
        logger.error('Failed to get order', error)
        res.status(500).json({ error: 'Failed to get order' })
    }
}

async function updateOrder(req, res) {
    try {
        const loggedinUserId = req.session.user._id
        const order = req.body;
        if (!order) throw new Error('Details must be filled in for updating');
        const { userId, status } = order
        if (!userId) throw new Error('You must login to access your order');
        if (status === 'cancelled') throw new Error('The order cannot be updated because it has been cancelled');
        if (userId !== loggedinUserId) throw new Error('The information does not match');
        const { orderId } = req.params
        const updatedOrder = await orderService.save(order, orderId);
        res.json({ message: `Your order number ${updatedOrder.number} was update`, updatedOrder })
    } catch (error) {
        logger.error('Failed to update order', error)
        res.status(500).send({ error: 'Failed to update order' })
    }
}

async function cancelOrder(req, res) {
    try {
        const { orderId } = req.params
        const userId = req.session.user._id
        if (!userId) throw new Error('You must login to access your order');
        await orderService.cancel(orderId, userId)
        res.send('The order was cancelled')
    } catch (error) {
        logger.error('Failed cancel order', error)
        res.status(500).send({ error: 'Failed cancel order' })
    }
}

module.exports = {
    getOrderById,
    getOrderByUserId,
    addOrder,
    updateOrder,
    cancelOrder
}

