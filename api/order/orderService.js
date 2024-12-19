const dbService = require('../../services/db.service')
const { ObjectId } = require('mongodb')
const logger = require('../../services/logger.service')
const { format } = require('date-fns');

const formattedDate = format(Date.now(), 'yyyy-MM-dd HH:mm:ss');


async function add(userId) {
    try {
        const newOrder = {
            number: _randomText(),
            userId,
            status: 'pending',
            createdAt: formattedDate,
            updatedAt: [formattedDate]
        }
        const collection = await dbService.getCollection('orders');
        await collection.insertOne(newOrder)
        return newOrder
    } catch (error) {
        logger.error(`Failed insert order ${order}`, error)
        throw error
    }
}

async function getById(orderId, userId) {
    try {
        const collection = await dbService.getCollection('orders');
        const order = await collection.findOne({ _id: new ObjectId(orderId) });
        if (!order) throw new Error('Order not found');
        if (order.userId !== userId) throw new Error('The information does not match');
        return order;
    } catch (error) {
        logger.error(`Order not found ${orderId}`, error)
        throw error
    }
}

async function getByUserId(userId) {
    try {
        const collection = await dbService.getCollection('orders');
        const order = await collection.find({ userId }).toArray();
        if (!order) throw new Error('No order found');
        if (order[0].userId !== userId) throw new Error('The information does not match');
        return order;
    } catch (error) {
        logger.error(`Order not found`, error)
        throw error
    }
}

async function save(updateOrder, orderId) {
    try {
        const orderToUpdate = JSON.parse(JSON.stringify(updateOrder));
        orderToUpdate.updatedAt.push(formattedDate)
        const collection = await dbService.getCollection('orders');
        const objectId = new ObjectId(orderId);
        await collection.updateOne({ '_id': objectId }, { $set: orderToUpdate });
        return await collection.findOne({ '_id': objectId });
    } catch (error) {
        logger.error(`Failed update order ${orderId}`, error);
        throw error;
    }
}

async function cancel(orderId, loggedinUserId) {
    try {
        const { userId, status } = await getById(orderId, loggedinUserId)
        if (userId !== loggedinUserId) throw new Error('The information does not match');
        if (status === 'cancelled') throw new Error('The order has already been cancelled');
        const collection = await dbService.getCollection('orders')
        const objectId = new ObjectId(orderId);
        return await collection.updateOne({ '_id': objectId }, { $set: { status: 'cancelled' } });
    } catch (error) {
        logger.error(`Failed cancle order ${orderId}`, error)
        throw error
    }
}

function _randomText(length = 5) {
    let text = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}


module.exports = {
    add,
    getById,
    getByUserId,
    save,
    cancel
}



