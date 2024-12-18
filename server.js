require('dotenv').config();
const express = require('express');
const expressSession = require('express-session')
const mongoose = require('mongoose');

const logger = require('./services/logger.service')
const authRoutes = require('./api/authentication/authRoutes');
const userRoutes = require('./api/user-information/userRoutes');

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI, {
}).then(() => {
    logger.info('MongoDB connected');
}).catch(err => console.error(err));

const session = expressSession({
    secret: 'event-driven',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})

const app = express();

app.use(session)
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

