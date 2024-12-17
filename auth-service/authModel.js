const bcrypt = require('bcrypt')
const userModel = require('../user-service/userModel')


async function login(username, password) {
    try {
        const user = await userModel.getByUsername(username)

        if (!user) return Promise.reject('Invalid username')
        const match = await bcrypt.compare(password, user.password)
        if (!match) return Promise.reject('Invalid  password')

        delete user.password
        return user
    } catch (error) {
        console.error(`Failed to login ${username}`, error)
        throw error
    }
}

async function signup(username, password) {
    try {
        const saltRounds = 10

        if (!username || !password) return Promise.reject('Username and password are required!')

        const user = await userModel.getByUsername(username);
        if (user) return Promise.reject('Username is alrady taken.');

        const hash = await bcrypt.hash(password, saltRounds)
        return userModel.add({ username, password: hash })
    } catch (error) {
        console.error(`Failed to signup ${username}`, error)
        throw error
    }
}

module.exports = {
    signup,
    login,
}

