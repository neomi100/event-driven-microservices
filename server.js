require('dotenv').config();
const express = require('express');
const expressSession = require('express-session')
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const logger = require('./services/logger.service')
const authRoutes = require('./api/authentication/authRoutes');
const userRoutes = require('./api/user-information/userRoutes');
const orderRoutes = require('./api/order/orderRoutes');

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

mongoose.connect(MONGO_URI, {
}).then(() => {
    logger.info('MongoDB connected');
}).catch(error => logger.error(error));

const app = express();

app.use(expressSession({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/Event-Driven',
        ttl: 24 * 60 * 60
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/order', orderRoutes);

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});