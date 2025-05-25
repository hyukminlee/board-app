function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto p-4">
        {children}
      </div>
    </div>
  );
}

export default Layout;