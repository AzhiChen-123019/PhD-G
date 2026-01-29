'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">发生错误</h2>
        <p className="text-gray-600 mb-6">{error.message || '页面加载失败，请重试'}</p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          重试
        </button>
      </div>
    </div>
  );
}
