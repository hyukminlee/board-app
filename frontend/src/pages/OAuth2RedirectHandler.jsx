import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuth2RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <p>로그인 중입니다...</p>;
}

export default OAuth2RedirectHandler;