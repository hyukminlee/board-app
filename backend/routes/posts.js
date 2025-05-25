const express = require('express');
const path = require('path'); // ✅ 요거 필수!
const { protect } = require('../middlewares/authMiddleware');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const multer = require('multer');

const router = express.Router();

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// 게시글 API
router.route('/')
  .get(getPosts)
  .post(protect, upload.single('file'), createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, upload.single('file'), updatePost)
  .delete(protect, deletePost);

// ✅ 첨부파일 다운로드 라우트
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  const originalName = req.query.name || filename;
  res.download(filePath, originalName);
});

module.exports = router;
