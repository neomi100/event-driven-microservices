const authModel = require('./authModel');

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await authModel.login(username, password)
    req.session.user = user
    res.json({ message: 'Login successfully!', user: user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function signup(req, res) {
  try {
    const { username, password } = req.body
    await authModel.signup(username, password)
    const user = await authModel.login(username, password)
    req.session.user = user
    res.json({ message: 'Signup successfully!', user: user })
  } catch (error) {
    console.error('Failed to signup', error)
    res.status(500).send({ error: 'Failed to signup' })
  }
};

async function logout(req, res) {
  try {
    req.session.destroy()
    res.send({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(500).send({ error: 'Failed to logout' })
  }
};

module.exports = { login, signup, logout };