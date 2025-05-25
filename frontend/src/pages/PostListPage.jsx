import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const limit = 5;

  const isLoggedIn = !!localStorage.getItem('token'); // ✅ 로그인 여부 확인


  useEffect(() => {
    fetchPosts(1, keyword, true);
  }, [keyword]);

  const fetchPosts = async (pageNum = 1, searchTerm = '', replace = false) => {
    const res = await API.get(`/posts?page=${pageNum}&limit=${limit}&search=${searchTerm}`);
    if (res.data.length < limit) setHasMore(false);
    else setHasMore(true);

    if (replace) setPosts(res.data);
    else setPosts(prev => [...prev, ...res.data]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setKeyword(search);
  };

  const handleMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, keyword);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white rounded-xl shadow border border-gray-300">
      <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">게시판</h1>
      <div className="flex gap-2">
        {!isLoggedIn && (
          <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
            로그인
          </Link>
        )}
        {isLoggedIn && (
          <Link to="/posts/new" className="bg-green-500 text-white px-4 py-2 rounded">
            글쓰기
          </Link>
        )}
      </div>
    </div>

      {/* 🔍 검색창 */}
      <form onSubmit={handleSearch} className="flex mb-4 gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색어 입력"
          className="border p-2 flex-1 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          검색
        </button>
      </form>

      {posts.length === 0 && (
        <p className="text-center text-gray-500">게시글이 없습니다.</p>
      )}

      <div className="space-y-4">
        {posts.map(post => (
          <Link
            to={`/posts/${post._id}`}
            key={post._id}
            className="block border rounded-md p-4 hover:shadow bg-gray-50"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{post.title}</h2>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{post.userId?.name || '작성자 없음'}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && posts.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleMore}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            더 보기
          </button>
        </div>
      )}
    </div>
  );
}

export default PostListPage;
