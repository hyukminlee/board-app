import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../services/api';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await API.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('사용자 정보 가져오기 실패', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchUser();
  }, [token, navigate]);

  if (location.pathname === '/login' || location.pathname === '/oauth2/redirect') {
    return null;
  }

const handleLogout = () => {
  localStorage.removeItem('token'); // JWT 토큰 삭제

  // ✅ Google 세션까지 완전히 로그아웃 + 게시판 페이지로 리디렉션
  window.location.href =
    'https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000';
};

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm border-b">
      <h1 className="text-xl font-bold text-blue-600">📝 게시판</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">{user.name} 님</span>
          <button
            onClick={handleLogout}
            className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
