const bcrypt = require('bcrypt')
const userService = require('../user-information/userService')
const logger = require('../../services/logger.service')


async function login(username, password) {
    try {
        const user = await userService.getByUsername(username)
        if (!user) throw new Error('Invalid username')
        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new Error('Invalid password')
        delete user.password
        return user
    } catch (error) {
        logger.error(`Failed to login ${username}`, error)
        throw error
    }
}

async function signup(username, password) {
    try {
        if (!username || !password) throw new Error('Username and password are required!')
        const user = await userService.getByUsername(username);
        if (user) throw new Error('Username is alrady taken.');
        const saltRounds = 10
        const hash = await bcrypt.hash(password, saltRounds)
        return userService.add({ username, password: hash })
    } catch (error) {
        logger.error(`Failed to signup ${username}`, error)
        throw error
    }
}


module.exports = {
    signup,
    login
}

