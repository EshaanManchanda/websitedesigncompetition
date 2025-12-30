import React, { useState, useRef } from 'react';
import { Upload, X, FileIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { ALLOWED_MIME_TYPES, formatFileSize } from '@/lib/fileUtils';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  maxSizeMB: number;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  maxSizeMB,
  error: externalError,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get list of acceptable file extensions for display
  const acceptedExtensions = [
    '.zip',
    '.pdf',
    '.ppt',
    '.pptx',
    '.doc',
    '.docx',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.svg',
  ];

  const handleFileChange = (file: File | null) => {
    setError('');

    if (!file) {
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    // Basic client-side validation (detailed validation happens in storage.ts)
    if (file.size > maxSizeMB * 1024 * 1024) {
      const errorMsg = `File size exceeds ${maxSizeMB}MB limit`;
      setError(errorMsg);
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      const errorMsg = 'File type not supported';
      setError(errorMsg);
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError('');
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayError = error || externalError;

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        accept={acceptedExtensions.join(',')}
        className="hidden"
        aria-label="File upload input"
      />

      {!selectedFile ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-yellow-500 bg-yellow-50 scale-105'
              : displayError
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-gray-50 hover:border-yellow-400 hover:bg-yellow-50'
            }
          `}
          role="button"
          tabIndex={0}
          aria-label="Click to upload file or drag and drop"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick();
            }
          }}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              p-4 rounded-full
              ${isDragging
                ? 'bg-yellow-200'
                : displayError
                ? 'bg-red-200'
                : 'bg-gray-200'
              }
            `}>
              <Upload
                className={`
                  w-8 h-8
                  ${isDragging
                    ? 'text-yellow-600'
                    : displayError
                    ? 'text-red-600'
                    : 'text-gray-600'
                  }
                `}
              />
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                {isDragging
                  ? 'Drop your file here'
                  : 'Drop your project file here or click to browse'
                }
              </p>
              <p className="text-sm text-gray-500 mb-3">
                Upload your completed project (Optional)
              </p>
              <p className="text-xs text-gray-400">
                Accepted formats: ZIP, PDF, PPTX, DOC, DOCX, and images
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Maximum file size: {maxSizeMB}MB
              </p>
            </div>
          </div>

          {displayError && (
            <div className="mt-4 flex items-center justify-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{displayError}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-green-300 bg-green-50 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="p-3 bg-green-200 rounded-lg">
                <FileIcon className="w-6 h-6 text-green-700" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="font-semibold text-gray-800">File Selected</p>
                </div>

                <p className="text-sm text-gray-700 truncate mb-1" title={selectedFile.name}>
                  {selectedFile.name}
                </p>

                <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Size:</span>
                    {formatFileSize(selectedFile.size)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Type:</span>
                    {selectedFile.type || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRemoveFile}
              className="ml-4 p-2 hover:bg-green-200 rounded-lg transition-colors flex-shrink-0"
              aria-label="Remove file"
              type="button"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-green-200">
            <button
              onClick={handleClick}
              className="text-sm text-green-700 hover:text-green-800 font-medium hover:underline"
              type="button"
            >
              Choose a different file
            </button>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <p>
          <span className="font-semibold">Note:</span> File upload is optional. You can submit the registration without uploading a file.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
