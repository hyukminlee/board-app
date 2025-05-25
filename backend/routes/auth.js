const express = require('express');
const passport = require('passport');
const { googleAuthCallback } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();
const User = require('../models/User');

// 구글 로그인 요청
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 구글 로그인 콜백
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleAuthCallback
);

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ message: '사용자 정보를 가져올 수 없습니다.' });
  }
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
