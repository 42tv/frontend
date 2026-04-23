export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600 dark:text-gray-400">상품 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
