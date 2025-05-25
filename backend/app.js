const express = require('express');
const cors = require('cors');
const passport = require('passport');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

dotenv.config();
require('./config/passport');

const app = express();

// DB 연결
connectDB();

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/uploads', express.static('uploads'));

// 라우터
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

module.exports = app;