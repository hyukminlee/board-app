const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByPostId,
} = require('../controllers/commentController');

const router = express.Router();

// 댓글 생성
router.post('/', protect, createComment);

// 댓글 수정
router.put('/:id', protect, updateComment);

// 댓글 삭제
router.delete('/:id', protect, deleteComment);

// 특정 게시글의 댓글 전체 조회 (GET /comments?postId=xxx)
router.get('/', getCommentsByPostId);

module.exports = router;
