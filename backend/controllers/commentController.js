// controllers/commentController.js
const Comment = require('../models/Comment');

// 댓글 작성
exports.createComment = async (req, res) => {
  try {
    const comment = new Comment({
      postId: req.body.postId,
      userId: req.user.id,
      text: req.body.text,
    });
    await comment.save();
    res.status(201).json(comment); // ✅ 사용자 이름은 안 보냄 (프론트가 전체 다시 조회함)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다' });
    }
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    comment.text = req.body.text || comment.text;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다' });
    }
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    await comment.deleteOne();
    res.json({ message: '댓글 삭제 완료' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ 특정 게시글에 대한 댓글 전체 조회 + 작성자 이름 포함
exports.getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.query;
    const comments = await Comment.find({ postId }).populate('userId', 'name');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};