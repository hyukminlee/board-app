import { useEffect, useState } from 'react';
import API from '../services/api';

function CommentList({ comments, setComments }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await API.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUserId(res.data.id);
      } catch (err) {
        console.error('사용자 정보 불러오기 실패', err);
      }
    };
    fetchUser();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      await API.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    }
  };

  const handleUpdate = async (id) => {
    await API.put(`/comments/${id}`, { text: editText });
    setEditingId(null);
    setComments((prev) =>
      prev.map((c) => (c._id === id ? { ...c, text: editText } : c))
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">댓글</h3>
      {comments.length === 0 && <p className="text-gray-500">댓글이 없습니다.</p>}
      {comments.map((comment) => {
        const isMyComment =
          currentUserId &&
          (String(comment.userId) === currentUserId ||
            String(comment.userId?._id) === currentUserId);

        return (
          <div key={comment._id} className="border-b py-2">
            {editingId === comment._id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border p-1 mr-2"
                />
                <button onClick={() => handleUpdate(comment._id)} className="text-blue-500">저장</button>
                <button onClick={() => setEditingId(null)} className="text-gray-500 ml-2">취소</button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-800">{comment.text}</p>
                <p className="text-xs text-gray-500">작성자: {comment.userId?.name || '익명'}</p>
                {isMyComment && (
                  <div className="text-sm text-right mt-1">
                    <button
                      onClick={() => {
                        setEditingId(comment._id);
                        setEditText(comment.text);
                      }}
                      className="text-blue-500 mr-2"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CommentList;
