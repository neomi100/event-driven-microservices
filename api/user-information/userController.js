const userService = require('./userService')
const logger = require('../../services/logger.service')
const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string().min(3).max(30),
    password: Joi.string().trim().min(8)
});

async function getUser(req, res) {
    try {
        const { userId } = req.params
        if (req.session.user._id !== userId) throw new Error('The information does not match')
        const user = await userService.getById(userId)
        res.json({ message: `Hello ${user.username}`, user: user });
    } catch (error) {
        logger.error('Failed to get user', error)
        res.status(500).json({ error: 'Failed to get user' })
    }
}

async function updateUser(req, res) {
    try {
        const { userId } = req.params
        if (!userId) throw new Error('Invalid user data');
        const user = req.body
        if (!user) throw new Error('Details must be filled in for updating');
        const { username, password } = user;
        const { error } = schema.validate({ username, password });
        if (error) {
            logger.error(`Validation error: ${error.details[0].message}`);
            return res.status(400).json({ message: error.details[0].message });
        }
        const savedUser = await userService.update(user, userId)
        res.json({ message: 'Update user successfully!', savedUser });
    } catch (error) {
        logger.error('Failed to update user', error)
        res.status(500).json({ error: 'Failed to update user' })
    }
}

async function deleteUser(req, res) {
    try {
        const { userId } = req.params
        if (req.session.user._id !== userId) throw new Error('The information does not match')
        await userService.remove(userId)
        req.session.destroy()
        res.send('Deleted successfully')
    } catch (error) {
        logger.error('Failed to delete user', error)
        res.status(500).json({ error: 'Failed to delete user' })
    }
}


module.exports = {
    getUser,
    updateUser,
    deleteUser
}