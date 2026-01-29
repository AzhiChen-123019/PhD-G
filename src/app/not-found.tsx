export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">页面未找到</h2>
        <p className="text-gray-600 mb-6">您访问的页面不存在或已被移除</p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          返回首页
        </a>
      </div>
    </div>
  );
}
