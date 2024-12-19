const authService = require('./authService');
const logger = require('../../services/logger.service')
const Joi = require('joi');


const schema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().trim().min(8).required()
});

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const { error } = schema.validate({ username, password });
    if (error) {
      logger.error(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({ message: error.details[0].message });
    }
    const user = await authService.login(username, password)
    req.session.user = user
    res.json({ message: 'Login successfully!', user });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login error' });
  }
};

async function signup(req, res) {
  try {
    const { username, password } = req.body
    const { error } = schema.validate({ username, password });
    if (error) return res.status(400).json({ message: error.details[0].message });
    const user = await authService.signup(username, password);
    req.session.user = user
    res.json({ message: 'Signup successfully!', user })
  } catch (error) {
    logger.error('Failed to signup', error)
    res.status(500).json({ error: 'Failed to signup' })
  }
};

async function logout(req, res) {
  try {
    if (!req.session.user._id) throw new Error('You are not login')
    req.session.destroy()
    res.send('Logged out successfully')
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout' })
  }
};

module.exports = { login, signup, logout };