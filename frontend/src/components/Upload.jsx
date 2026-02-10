import React from 'react';

const Upload = ({
  uploadedFiles,
  isUploading,
  fileInputRef,
  handleFileUpload
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white rounded-full p-2">
              <span className="text-xl">📚</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                Study Materials Library
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Upload and manage your academic resources
              </p>
            </div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <span className="text-lg">📁</span>
                Upload Materials
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Upload Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
          <span>📋</span>
          Supported File Types
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-700 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>PDF Documents (.pdf)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Text Files (.txt)</span>
          </div>
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
          Maximum file size: 10MB • Files are processed for AI-powered Q&A
        </p>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base flex items-center gap-2">
            <span>📂</span>
            Your Study Materials ({uploadedFiles.length})
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full p-2">
                      <span className="text-xl sm:text-2xl">
                        {file.type === 'pdf' ? '📄' : '📝'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-white text-sm sm:text-base truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <span>🔢</span>
                          {file.chunks} chunks processed
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🕒</span>
                          {file.uploadTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-1 rounded">
                      <span className="text-sm">✓</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploadedFiles.length === 0 && (
        <div className="text-center py-8">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No Study Materials Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Upload PDF or text files to start building your knowledge base for AI-powered Q&A.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">📁</span>
            Upload Your First File
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;
