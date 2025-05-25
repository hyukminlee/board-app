function LoginPage() {
    const handleGoogleLogin = () => {
      window.location.href = 'http://localhost:5000/api/auth/google?prompt=select_account';
    };
  
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">로그인</h1>
        <button 
          onClick={handleGoogleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Google로 로그인
        </button>
      </div>
    );
  }
  
  export default LoginPage;
  