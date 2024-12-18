const userModel = require('./userService')
const logger = require('../../services/logger.service')


async function getUser(req, res) {
    try {
        const { userId } = req.params
        if (req.session.user._id !== userId) throw new Error('The information does not match')
        const user = await userModel.getById(userId)
        res.json({ message: `Hello ${user.username}`, user: user });
    } catch (error) {
        logger.error('Failed to get user', error)
        res.status(500).json({ error: 'Failed to get user' })
    }
}

async function deleteUser(req, res) {
    try {
        const { userId } = req.params
        if (req.session.user._id !== userId) throw new Error('The information does not match')
        await userModel.remove(userId)
        res.send('Deleted successfully')
    } catch (error) {
        logger.error('Failed to delete user', error)
        res.status(500).json({ error: 'Failed to delete user' })
    }
}

async function updateUser(req, res) {
    try {
        const { userId } = req.params
        if (!userId) throw new Error('Invalid user data');
        const user = req.body
        if (!user) throw new Error('Details must be filled in for updating');
        const savedUser = await userModel.update(user, userId)
        res.json({ message: 'Update user successfully!', savedUser });
    } catch (error) {
        logger.error('Failed to update user', error)
        res.status(500).json({ error: 'Failed to update user' })
    }
}

module.exports = {
    getUser,
    deleteUser,
    updateUser
}