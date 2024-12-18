const userModel = require('./userService')
const logger = require('../../services/logger.service')


async function getUser(req, res) {
    try {
        const user = await userModel.getById(req.params.userId)
        res.json({ message: `Hello ${user.username}`, user: user });
    } catch (error) {
        logger.error('Failed to get user', error)
        res.status(500).send({ error: 'Failed to get user' })
    }
}

async function deleteUser(req, res) {
    try {
        await userModel.remove(req.params.userId)
        res.send({ msg: 'Deleted successfully' })
    } catch (error) {
        logger.error('Failed to delete user', error)
        res.status(500).send({ error: 'Failed to delete user' })
    }
}

async function updateUser(req, res) {
    try {
        const { userId } = req.params
        const user = req.body
        const savedUser = await userModel.update(user, userId)
        res.json({ message: 'Update successfully!', user: savedUser });
    } catch (error) {
        logger.error('Failed to update user', error)
        res.status(500).send({ error: 'Failed to update user' })
    }
}

module.exports = {
    getUser,
    deleteUser,
    updateUser
}