import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import PostListPage from './pages/PostListPage';
import PostDetailPage from './pages/PostDetailPage';
import PostFormPage from './pages/PostFormPage';
import PrivateRoute from './utils/PrivateRoute';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import './tailwind.css';

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/oauth2/redirect'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <Layout>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

        {/* ✅ 로그인 없이 접근 가능한 공개 페이지 */}
        <Route path="/" element={<PostListPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />

        {/* ✅ 로그인 필요 */}
        <Route path="/posts/new" element={
          <PrivateRoute>
            <PostFormPage />
          </PrivateRoute>
        } />
      </Routes>
    </Layout>
  );
}

export default App;
