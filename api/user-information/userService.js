const dbService = require('../../services/db.service')
const { ObjectId } = require('mongodb')
const logger = require('../../services/logger.service')


async function getById(userId) {
  try {
    const collection = await dbService.getCollection('users')
    const user = await collection.findOne({ '_id': new ObjectId(userId) })
    delete user.password
    return user
  } catch (error) {
    logger.error(`User not found ${userId}`, error)
    throw error
  }
}

async function getByUsername(username) {
  try {
    const collection = await dbService.getCollection('users')
    return await collection.findOne({ username })
  } catch (error) {
    logger.error(`User not found ${username}`, error)
    throw error
  }
}

async function update(user, userId) {
  try {
    const userToUpdate = { ...user };
    const collection = await dbService.getCollection('users');
    const objectId = new ObjectId(userId);
    await collection.updateOne({ '_id': objectId }, { $set: userToUpdate })
    const updatedUser = await collection.findOne({ '_id': objectId });
    delete updatedUser.password
    return updatedUser
  } catch (error) {
    logger.error(`Failed update user ${userId}`, error)
    throw error
  }
}

async function add(user) {
  try {
    const userToAdd = {
      username: user.username,
      password: user.password
    }
    const collection = await dbService.getCollection('users')
    await collection.insertOne(userToAdd)
    return userToAdd
  } catch (error) {
    logger.error(`Failed insert user ${user}`, error)
    throw error
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection('users')
    await collection.deleteOne({ '_id': new ObjectId(userId) })
  } catch (error) {
    logger.error(`Failed remove user ${userId}`, error)
    throw error
  }
}


module.exports = {
  getById,
  getByUsername,
  update,
  add,
  remove
}

