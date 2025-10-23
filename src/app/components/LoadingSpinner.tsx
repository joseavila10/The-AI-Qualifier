import React from 'react';

const LoadingSpinner = ({ loadingMessage }: { loadingMessage?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100px] space-y-3">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-blue-500 border-t-blue-200 rounded-full animate-spin"></div>

      {/* Optional loading message */}
      {loadingMessage && (
        <span className="text-gray-700 dark:text-gray-200 text-sm text-white">
          {loadingMessage}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
