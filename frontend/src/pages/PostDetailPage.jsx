import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import CommentList from '../components/CommentList';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchPostAndComments();
    fetchUser();
  }, [id]);

  const fetchPostAndComments = async () => {
    const res = await API.get(`/posts/${id}`);
    setPost(res.data);
    const commentRes = await API.get(`/comments?postId=${id}`);
    setComments(commentRes.data);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await API.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUserId(res.data.id);
    } catch (err) {
      console.error('사용자 정보 불러오기 실패', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await API.post('/comments', { postId: id, text: commentText });
      setCommentText('');
      fetchPostAndComments();
    } catch (err) {
      console.error('댓글 작성 오류:', err);
      alert('댓글 작성 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await API.delete(`/posts/${id}`);
      navigate('/');
    }
  };

  if (!post) return <div className="text-center mt-10 text-gray-500">로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow border border-gray-300">
      {/* 제목 영역 */}
      <div className="border-b pb-4 mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
        <div className="flex justify-between text-sm text-gray-500">
          <span>작성자: {post.userId?.name || '알 수 없음'}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* 본문 내용 영역 */}
      <div className="mb-6 border rounded p-4 bg-gray-50">
        <h2 className="text-md font-semibold text-gray-700 mb-2">내용</h2>
        <p className="text-gray-800 whitespace-pre-line leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* 첨부파일 */}
      {post.fileUrl && (
        <div className="flex items-center gap-2 mb-6 border-t pt-4">
          <span className="text-sm text-gray-600 font-semibold">첨부파일:</span>
          <a
            href={`http://localhost:5000/api/posts/download/${post.fileUrl.split('/').pop()}?name=${encodeURIComponent(post.originalFileName)}`}
            className="text-blue-600 underline"
          >
            {post.originalFileName}
          </a>
        </div>
      )}

      {/* 수정/삭제 (작성자만 노출) */}
      {(post.userId &&
        (String(post.userId) === currentUserId ||
         String(post.userId._id) === currentUserId)) && (
        <div className="flex gap-2 mb-6 border-t pt-4">
          <Link
            to={`/posts/new?edit=true&id=${post._id}`}
            className="px-4 py-2 bg-yellow-400 text-white rounded shadow"
          >
            수정
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded shadow"
          >
            삭제
          </button>
        </div>
      )}

      {/* 댓글 입력 (로그인 사용자만) */}
      {currentUserId && (
        <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-6 border-t pt-4">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글 작성"
            className="border p-2 flex-1 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            작성
          </button>
        </form>
      )}

      {/* 댓글 리스트 */}
      <div className="mt-6 border-t pt-4">
        <CommentList comments={comments} setComments={setComments} />
      </div>
    </div>
  );
}

export default PostDetailPage;
