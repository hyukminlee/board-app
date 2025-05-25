import { Link } from 'react-router-dom';

// 게시글 하나를 카드 형태로 보여주는 컴포넌트
function PostCard({ post }) {
  return (
    <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
      <Link to={`/posts/${post._id}`}>
        <h2 className="text-xl font-bold">{post.title}</h2>
      </Link>
      <p className="text-gray-500 text-sm mt-2">{post.userId?.name || "작성자 없음"}</p>
    </div>
  );
}

export default PostCard;
