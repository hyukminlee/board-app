const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    userId: req.user.id,
    fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
    originalFileName: req.file ? req.file.originalname : null,
  });

  await post.save();
  res.status(201).json(post);
};

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const { search } = req.query;

    let query = {};

    if (search) {
      // 작성자 이름으로 검색하기 위한 사용자 먼저 찾기
      const matchingUsers = await User.find({
        name: { $regex: search, $options: 'i' },
      }).select('_id');

      const userIds = matchingUsers.map(user => user._id);

      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { userId: { $in: userIds } }
        ]
      };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name');

    res.json(posts);
  } catch (err) {
    console.error('게시글 검색 오류:', err);
    res.status(500).json({ message: '게시글을 불러오는 중 오류 발생' });
  }
};

exports.getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('userId', 'name');
  if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
  res.json(post);
};

exports.updatePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
  
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }
  
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
  
    // 파일 업데이트 시 기존 파일 유지 or 교체
    if (req.file) {
      post.fileUrl = `/uploads/${req.file.filename}`;
      post.originalFileName = req.file.originalname;
    }
  
    await post.save();
    res.json(post);
  };
  

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });

  if (post.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: '권한이 없습니다' });
  }

  await post.deleteOne();
  res.json({ message: '게시글 삭제 완료' });
};
