const logger = require('../services/logger.service')
const MongoClient = require('mongodb').MongoClient
const MONGO_URI = process.env.MONGO_URI;

module.exports = {
    getCollection
}

const dbName = 'Event-Driven'

let dbConnect = null

async function getCollection(collectionName) {
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (error) {
        logger.error('Failed to get Mongo collection', error)
        throw error
    }
}

async function connect() {
    if (dbConnect) return dbConnect
    try {
        const client = await MongoClient.connect(MONGO_URI)
        const db = client.db(dbName)
        dbConnect = db
        return db
    } catch (error) {
        logger.error('Cannot Connect to DB', error)
        throw error
    }
}